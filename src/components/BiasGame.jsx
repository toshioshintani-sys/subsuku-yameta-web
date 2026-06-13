import { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './BiasGame.module.css';

// 告知ファネル計測：診断の開始/完了を GA4 に送る。
// GA4 がセッションの utm_source（threads 等）に自動で紐付けるため、
// 「告知→診断開始→診断完了」のファネルと撤退ライン（100本×1,000）の母数が取れる。
function trackEvent(name, params) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', name, params || {});
  } catch {
    // 計測失敗でUXを止めない
  }
}

/**
 * バイアスゲーム 汎用エンジン（データ駆動）
 * - data/biasGames.js の1ゲーム設定（game prop）を受け取って描画する。
 * - 量産は「データを足す」だけ。トーン（やめる？・説明主役・押し付けない）はここで一括担保。
 *
 * BAE 準拠：ユーザーを操作しない。サブスクが使う"クセ"を体験して見抜く力を渡す。末尾は解約導線へ。
 */

function verdict(game, score, total) {
  if (score >= total) {
    return {
      head: `${game.scoreLabel}が高い`,
      body: 'その場の気持ちではなく「これからの損得」で判断できています。サブスク事業者が一番苦手なタイプです。',
    };
  }
  if (score >= total - 1) {
    return {
      head: '惜しい。あと一歩',
      body: `1つだけ、${game.term}に引っ張られたかも。引き止めの言葉ではなく、これからの損得で見てみましょう。`,
    };
  }
  return {
    head: `${game.term}の罠にかかりやすいタイプ`,
    body: `でも大丈夫。「${game.term}」というクセがあると知るだけで、次から見抜けます。サブスクの多くは、これであなたを引き止めています。`,
  };
}

export default function BiasGame({ game }) {
  const total = game.scenarios.length;
  const [phase, setPhase] = useState('intro'); // intro | playing | result
  const [round, setRound] = useState(0);
  const [choice, setChoice] = useState(null);
  const [score, setScore] = useState(0);

  const sc = game.scenarios[round];

  function start() {
    setPhase('playing');
    setRound(0);
    setChoice(null);
    setScore(0);
    trackEvent('diagnosis_start', { game: game.id || String(game.n), bias: game.term });
  }

  function pick(key) {
    if (choice) return;
    setChoice(key);
    if (key === sc.rational) setScore((s) => s + 1);
  }

  function next() {
    if (round + 1 >= total) {
      setPhase('result');
      trackEvent('diagnosis_complete', { game: game.id || String(game.n), bias: game.term, score, total });
    } else {
      setRound((r) => r + 1);
      setChoice(null);
    }
  }

  // ---- イントロ ----
  if (phase === 'intro') {
    return (
      <div className={styles.game}>
        <div className={styles.badge}>やめられない理由・第{game.n}弾</div>
        <h2 className={styles.gameTitle}>{game.headline}</h2>
        <p className={styles.termSub}>
          あとで知る → この心のクセは「<strong>{game.term}</strong>」と呼ばれています
        </p>
        <p className={styles.lead}>{game.lead}</p>
        <button type="button" className={styles.startBtn} onClick={start}>
          はじめる（30秒）
        </button>
        <p className={styles.note}>
          ※ あなたを誘導するゲームではありません。逆に、サブスクがあなたに使う"クセ"を見抜く練習です。
        </p>
      </div>
    );
  }

  // ---- 結果 ----
  if (phase === 'result') {
    const v = verdict(game, score, total);
    return (
      <div className={styles.game}>
        <div className={styles.badge}>結果</div>
        <div className={styles.scoreWrap}>
          <span className={styles.scoreLabel}>{game.scoreLabel}</span>
          <span className={styles.scoreValue}>
            {score}
            <span className={styles.scoreMax}> / {total}</span>
          </span>
        </div>
        <h3 className={styles.verdictHead}>{v.head}</h3>
        <p className={styles.verdictBody}>{v.body}</p>

        <div className={styles.lessonCard}>
          <p className={styles.lessonTitle}>持ち帰る1行</p>
          <p className={styles.lessonText}>{game.lesson}</p>
        </div>

        <Link to="/tracker" className={styles.ctaCancel}>
          あなたのサブスクで同じ罠にかかっていませんか？
          <br />
          <strong>棚卸しダッシュボードで「これからのコスト」を見る →</strong>
        </Link>

        <div className={styles.gameExits}>
          <span className={styles.gameExitsLabel}>このあとの一手：</span>
          <Link
            to="/discover"
            className={styles.gameExitLink}
            onClick={() => trackEvent('game_exit', { to: 'discover', game: game.id })}
          >
            合うものに乗り換える
          </Link>
          <Link
            to="/yamete-kau"
            className={styles.gameExitLink}
            onClick={() => trackEvent('game_exit', { to: 'yamete-kau', game: game.id })}
          >
            買い切りで済ます
          </Link>
        </div>

        <button type="button" className={styles.againBtn} onClick={start}>
          もう一度
        </button>
      </div>
    );
  }

  // ---- プレイ中 ----
  const correct = choice && choice === sc.rational;
  return (
    <div className={styles.game}>
      <div className={styles.progress}>
        {game.scenarios.map((_, i) => (
          <span key={i} className={`${styles.dot} ${i <= round ? styles.dotOn : ''}`} aria-hidden="true" />
        ))}
        <span className={styles.progressText}>
          {round + 1} / {total}
        </span>
      </div>

      <h3 className={styles.scenarioTitle}>{sc.title}</h3>

      <div className={styles.facts}>
        {sc.facts.map((f, i) => (
          <div key={i} className={`${styles.fact} ${f.danger ? styles.factDanger : ''}`}>
            <span className={styles.factLabel}>{f.label}</span>
            <span className={styles.factValue}>{f.value}</span>
            {f.tag && <span className={styles.factTag}>{f.tag}</span>}
          </div>
        ))}
      </div>

      {!choice ? (
        <div className={styles.choices}>
          {game.choices.map((c) => (
            <button key={c.key} type="button" className={styles.choiceBtn} onClick={() => pick(c.key)}>
              <span className={styles.choiceLabel}>{c.label}</span>
              <span className={styles.choiceSub}>{c.sub}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className={`${styles.reveal} ${correct ? styles.revealOk : styles.revealNg}`}>
          <p className={styles.revealHead}>
            {correct ? '◎ これからの損得で判断できました' : '△ その場の気持ちに引っ張られたかも'}
            <span className={styles.revealAnswer}>
              合理的なのは「{game.choices.find((c) => c.key === sc.rational)?.label}」
            </span>
          </p>
          <p className={styles.revealText}>{sc.explain}</p>
          <button type="button" className={styles.nextBtn} onClick={next}>
            {round + 1 >= total ? '結果を見る' : '次へ'}
          </button>
        </div>
      )}
    </div>
  );
}
