import { useEffect, useRef, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { YAMETE_KAU_PRODUCTS } from '../data/yameteKau';
import styles from './SavingsGame.module.css';

/**
 * やめたつもり貯金ゲーム
 * - 8bit レトロ風キャッチゲーム
 * - コイン（+100円）を捕まえ、衝動買い（-50円）を避ける
 * - 60秒で累計貯金額を表示
 * - 終了時に「やめて買う」ページの商品からランダムで1つ提案
 *
 * BAE 設計憲法 v2.0：
 * - 「捕まえる」というポジティブUX（v1.0の教条主義回避）
 * - 攻撃要素なし（インベーダーの撃ち落としではなく「キャッチ系」）
 * - 解約導線への戻り口を末尾に必ず配置
 */

const GAME_WIDTH = 240;
const GAME_HEIGHT = 320;
const PLAYER_SIZE = 24;
const PLAYER_Y = GAME_HEIGHT - PLAYER_SIZE - 8;
const ITEM_SIZE = 16;
const GAME_DURATION_MS = 60_000;

// ピクセルアート色（8bit パレット）
const COLORS = {
  bg: '#0a1530',
  bgGrid: '#162347',
  player: '#5eead4',
  playerShadow: '#0d9488',
  coin: '#fbbf24',
  coinShadow: '#b45309',
  bad: '#f87171',
  badShadow: '#991b1b',
  text: '#f1f5f9',
};

function randomProduct() {
  return YAMETE_KAU_PRODUCTS[Math.floor(Math.random() * YAMETE_KAU_PRODUCTS.length)];
}

export default function SavingsGame({ onClose }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState('title'); // title | playing | ended
  const [finalScore, setFinalScore] = useState(0);
  const [suggested, setSuggested] = useState(null);

  // ゲーム状態を ref で管理（useState では描画が追いつかない）
  const state = useRef({
    playerX: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
    moveDir: 0, // -1 left, 0 stop, 1 right
    items: [],
    score: 0,
    startTime: 0,
    lastSpawn: 0,
    rafId: 0,
  });

  // キーボード操作
  useEffect(() => {
    if (phase !== 'playing') return undefined;
    const keyDown = (e) => {
      if (e.key === 'ArrowLeft') state.current.moveDir = -1;
      else if (e.key === 'ArrowRight') state.current.moveDir = 1;
    };
    const keyUp = (e) => {
      if (e.key === 'ArrowLeft' && state.current.moveDir === -1) state.current.moveDir = 0;
      else if (e.key === 'ArrowRight' && state.current.moveDir === 1) state.current.moveDir = 0;
    };
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
    };
  }, [phase]);

  const endGame = useCallback(() => {
    cancelAnimationFrame(state.current.rafId);
    setFinalScore(state.current.score);
    setSuggested(randomProduct());
    setPhase('ended');
  }, []);

  // メインループ
  useEffect(() => {
    if (phase !== 'playing') return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    state.current.playerX = GAME_WIDTH / 2 - PLAYER_SIZE / 2;
    state.current.moveDir = 0;
    state.current.items = [];
    state.current.score = 0;
    state.current.startTime = performance.now();
    state.current.lastSpawn = 0;

    function spawnItem(now) {
      // 8割コイン・2割衝動買い
      const isBad = Math.random() < 0.2;
      state.current.items.push({
        x: Math.random() * (GAME_WIDTH - ITEM_SIZE),
        y: -ITEM_SIZE,
        isBad,
        spawnedAt: now,
      });
    }

    function loop(now) {
      const s = state.current;
      const elapsed = now - s.startTime;
      const remaining = Math.max(0, GAME_DURATION_MS - elapsed);

      // 移動
      s.playerX += s.moveDir * 3.5;
      if (s.playerX < 0) s.playerX = 0;
      if (s.playerX > GAME_WIDTH - PLAYER_SIZE) s.playerX = GAME_WIDTH - PLAYER_SIZE;

      // スポーン（時間とともに頻度上がる）
      const interval = Math.max(400, 900 - elapsed / 100);
      if (now - s.lastSpawn > interval) {
        spawnItem(now);
        s.lastSpawn = now;
      }

      // 落下＆当たり判定
      const fallSpeed = 1.5 + elapsed / 30000; // 徐々に加速
      const playerRect = { x: s.playerX, y: PLAYER_Y, w: PLAYER_SIZE, h: PLAYER_SIZE };
      s.items = s.items.filter((item) => {
        item.y += fallSpeed;
        const itemRect = { x: item.x, y: item.y, w: ITEM_SIZE, h: ITEM_SIZE };
        const hit =
          itemRect.x < playerRect.x + playerRect.w &&
          itemRect.x + itemRect.w > playerRect.x &&
          itemRect.y < playerRect.y + playerRect.h &&
          itemRect.y + itemRect.h > playerRect.y;
        if (hit) {
          s.score += item.isBad ? -50 : 100;
          if (s.score < 0) s.score = 0;
          return false;
        }
        if (item.y > GAME_HEIGHT) return false;
        return true;
      });

      // 描画
      // 背景
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      // 8bit グリッド
      ctx.fillStyle = COLORS.bgGrid;
      for (let i = 0; i < GAME_HEIGHT; i += 16) {
        ctx.fillRect(0, i, GAME_WIDTH, 1);
      }
      for (let j = 0; j < GAME_WIDTH; j += 16) {
        ctx.fillRect(j, 0, 1, GAME_HEIGHT);
      }

      // アイテム描画（8bit 風・正方形ベース）
      for (const item of s.items) {
        const x = Math.floor(item.x);
        const y = Math.floor(item.y);
        if (item.isBad) {
          // 衝動買い：赤いバツ模様
          ctx.fillStyle = COLORS.badShadow;
          ctx.fillRect(x, y + 2, ITEM_SIZE, ITEM_SIZE - 2);
          ctx.fillStyle = COLORS.bad;
          ctx.fillRect(x, y, ITEM_SIZE, ITEM_SIZE - 2);
          ctx.fillStyle = COLORS.badShadow;
          ctx.fillRect(x + 4, y + 4, 2, 2);
          ctx.fillRect(x + 10, y + 4, 2, 2);
          ctx.fillRect(x + 6, y + 6, 4, 2);
          ctx.fillRect(x + 4, y + 10, 8, 2);
        } else {
          // コイン：黄色い円風
          ctx.fillStyle = COLORS.coinShadow;
          ctx.fillRect(x + 2, y + 4, ITEM_SIZE - 4, ITEM_SIZE - 4);
          ctx.fillStyle = COLORS.coin;
          ctx.fillRect(x + 2, y + 2, ITEM_SIZE - 4, ITEM_SIZE - 4);
          ctx.fillStyle = COLORS.coinShadow;
          ctx.fillRect(x + 6, y + 6, 4, 4);
        }
      }

      // プレイヤー描画（8bit 風キャラ）
      const px = Math.floor(s.playerX);
      ctx.fillStyle = COLORS.playerShadow;
      ctx.fillRect(px, PLAYER_Y + 2, PLAYER_SIZE, PLAYER_SIZE - 2);
      ctx.fillStyle = COLORS.player;
      ctx.fillRect(px, PLAYER_Y, PLAYER_SIZE, PLAYER_SIZE - 2);
      // 目
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(px + 6, PLAYER_Y + 8, 3, 3);
      ctx.fillRect(px + 15, PLAYER_Y + 8, 3, 3);

      // UI: スコアと残り時間
      ctx.fillStyle = COLORS.text;
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`¥${s.score.toLocaleString('ja-JP')}`, 6, 18);
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.ceil(remaining / 1000)}s`, GAME_WIDTH - 6, 18);

      if (remaining <= 0) {
        endGame();
        return;
      }
      s.rafId = requestAnimationFrame(loop);
    }

    s.rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(s.rafId);
  }, [phase, endGame]);

  // タッチ操作（モバイル）
  const onTouch = (e) => {
    if (phase !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = (touch.clientX - rect.left) * (GAME_WIDTH / rect.width);
    state.current.playerX = touchX - PLAYER_SIZE / 2;
    if (state.current.playerX < 0) state.current.playerX = 0;
    if (state.current.playerX > GAME_WIDTH - PLAYER_SIZE) state.current.playerX = GAME_WIDTH - PLAYER_SIZE;
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="やめたつもり貯金ゲーム"
      >
        <button
          type="button"
          onClick={onClose}
          className={styles.close}
          aria-label="ゲームを閉じる"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <h2 className={styles.title}>やめたつもり貯金</h2>

        {phase === 'title' && (
          <div className={styles.intro}>
            <p>
              60秒間、コイン（節約）をキャッチして、<br />
              衝動買いを避けるゲームです。
            </p>
            <ul className={styles.rules}>
              <li>🟡 コイン：+100円</li>
              <li>🔴 衝動買い：−50円</li>
            </ul>
            <button
              type="button"
              onClick={() => setPhase('playing')}
              className={styles.startBtn}
            >
              スタート
            </button>
            <p className={styles.hint}>← → キー（PC）/ 画面タップ（スマホ）</p>
          </div>
        )}

        {phase === 'playing' && (
          <canvas
            ref={canvasRef}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            className={styles.canvas}
            onTouchStart={onTouch}
            onTouchMove={onTouch}
            aria-label="ゲーム画面"
          />
        )}

        {phase === 'ended' && (
          <div className={styles.result}>
            <p className={styles.resultLabel}>今回の貯金額</p>
            <p className={styles.resultScore}>¥{finalScore.toLocaleString('ja-JP')}</p>
            {suggested && finalScore >= 1500 && (
              <div className={styles.suggestion}>
                <p>これだけ貯まると、たとえばこんな買い物ができます：</p>
                <p className={styles.suggestionItem}>
                  <strong>{suggested.name}</strong>
                  <span className={styles.suggestionPrice}>{suggested.priceHint}</span>
                </p>
                <Link to="/yamete-kau" onClick={onClose} className={styles.suggestionLink}>
                  「やめて買う」をもっと見る →
                </Link>
              </div>
            )}
            {finalScore < 1500 && (
              <p className={styles.tryAgain}>
                もう一度プレイすると、もっと貯まるかも。
              </p>
            )}
            <div className={styles.endActions}>
              <button
                type="button"
                onClick={() => {
                  setPhase('title');
                  setFinalScore(0);
                }}
                className={styles.againBtn}
              >
                もう一度
              </button>
              <button type="button" onClick={onClose} className={styles.closeBtn}>
                閉じる
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
