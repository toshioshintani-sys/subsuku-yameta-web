import { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './SunkCostGame.module.css';

/**
 * バイアスゲーム 第1弾：サンクコストの罠
 *
 * 設計（BAE 準拠）：
 * - ユーザーを「操作」しない。逆に「あなたの脳がどう釣られるか」を体験させ、見抜く力を渡す。
 * - サブスクの実利フレーム（お金・解約判断）。思想層は持ち込まない。
 * - 末尾に必ず解約導線（/tracker）へ戻す。
 *
 * 仕組み：3つの場面で「続ける / やめる」を選ぶ。各場面は「もう払った額（サンクコスト）」が
 * 大きく見えるよう作られている。正解は常に『これからの価値 vs これからのコスト』だけで決まり、
 * 払った額は判断材料にならない（=無視するのが鉄則）。2問は「やめる」が、1問は「続ける」が合理的。
 * 「いつもやめろ」ではなく「未来で判断せよ」を体験で教える。
 */

const SCENARIOS = [
  {
    id: 'video',
    title: '動画配信サブスク',
    paid: '8ヶ月で ¥9,600',
    future: '先月の視聴は0回。今後も観たい作品の予定はほぼない。',
    cost: '続けるなら来月も ¥1,200',
    rational: 'cancel',
    explain:
      '払った¥9,600は、続けても・やめても戻りません（これがサンクコスト）。判断材料は「これから¥1,200で得る価値 vs ¥1,200」だけ。観ないなら、やめるのが合理的です。',
  },
  {
    id: 'gym',
    title: 'ジム',
    paid: '入会金 + 3ヶ月で ¥31,000',
    future: '最近の利用は週0回。「来月から本気出す」と毎月思っている。',
    cost: '続けるなら来月も ¥7,000',
    rational: 'cancel',
    explain:
      '¥31,000は何を選んでも戻りません。「来月こそ」は未来の自分を過信するクセ。これまで行けていないなら、これからの確率も低い。続ける理由が「もったいない」だけなら、やめる側です。',
  },
  {
    id: 'lang',
    title: '語学アプリ',
    paid: '半年で ¥6,000',
    future: '毎日15分使い、実際に話せる実感がある。来月以降も続けたい。',
    cost: '続けるなら来月も ¥1,000',
    rational: 'keep',
    explain:
      'ここが肝。サンクコストは無視するのが鉄則ですが、それは「やめろ」という意味ではありません。判断は『これからの価値 vs これからのコスト』だけ。毎日使って成長しているなら、¥1,000の価値は十分。続けるのが合理的です。払った額ではなく、未来で決める。',
  },
];

const CHOICES = {
  keep: { label: '続ける', sub: 'もったいないし' },
  cancel: { label: 'やめる', sub: 'これからで判断' },
};

function verdict(score) {
  if (score === 3)
    return {
      head: 'サンクコストに強い',
      body: '払った額に引きずられず、「これから」で判断できています。サブスク事業者が一番苦手なタイプです。',
    };
  if (score === 2)
    return {
      head: '惜しい。あと一歩',
      body: '1つだけ「もったいなさ」に引っ張られたかも。払った額は、続けてもやめても戻りません。',
    };
  return {
    head: 'サンクコストの罠にかかりやすいタイプ',
    body: 'でも大丈夫。「払った額は判断材料にしない」と知るだけで、次から見抜けます。サブスクの多くは、この"もったいない"であなたを引き止めています。',
  };
}

export default function SunkCostGame() {
  const [phase, setPhase] = useState('intro'); // intro | playing | result
  const [round, setRound] = useState(0);
  const [choice, setChoice] = useState(null); // 当該ラウンドの選択（reveal表示中）
  const [score, setScore] = useState(0);

  const sc = SCENARIOS[round];

  function start() {
    setPhase('playing');
    setRound(0);
    setChoice(null);
    setScore(0);
  }

  function pick(c) {
    if (choice) return;
    setChoice(c);
    if (c === sc.rational) setScore((s) => s + 1);
  }

  function next() {
    if (round + 1 >= SCENARIOS.length) {
      setPhase('result');
    } else {
      setRound((r) => r + 1);
      setChoice(null);
    }
  }

  // ---- イントロ ----
  if (phase === 'intro') {
    return (
      <div className={styles.game}>
        <div className={styles.badge}>やめられない理由・第1弾</div>
        <h2 className={styles.gameTitle}>「ここまで払ったし…」で、やめられない</h2>
        <p className={styles.termSub}>
          あとで知る → この心のクセは「<strong>サンクコスト</strong>」と呼ばれています
        </p>
        <p className={styles.lead}>
          「ここまで払ったんだから、もったいない」——その気持ちが、使っていないサブスクを続けさせます。
          でも、<strong>払ったお金は、続けても・やめても戻りません。</strong>
          3つの場面で、あなたが「もったいなさ」に引っ張られないか試してみましょう。
        </p>
        <button type="button" className={styles.startBtn} onClick={start}>
          はじめる（30秒）
        </button>
        <p className={styles.note}>※ あなたを誘導するゲームではありません。逆に、サブスクがあなたに使う"クセ"を見抜く練習です。</p>
      </div>
    );
  }

  // ---- 結果 ----
  if (phase === 'result') {
    const v = verdict(score);
    return (
      <div className={styles.game}>
        <div className={styles.badge}>結果</div>
        <div className={styles.scoreWrap}>
          <span className={styles.scoreLabel}>サンクコスト耐性</span>
          <span className={styles.scoreValue}>{score}<span className={styles.scoreMax}> / 3</span></span>
        </div>
        <h3 className={styles.verdictHead}>{v.head}</h3>
        <p className={styles.verdictBody}>{v.body}</p>

        <div className={styles.lessonCard}>
          <p className={styles.lessonTitle}>持ち帰る1行</p>
          <p className={styles.lessonText}>
            続ける・やめるは「払った額」ではなく、<strong>「これからの価値 と これからのコスト」だけ</strong>で決める。
          </p>
        </div>

        <Link to="/tracker" className={styles.ctaCancel}>
          あなたのサブスクで同じ罠にかかっていませんか？<br />
          <strong>棚卸しダッシュボードで「これからのコスト」を見る →</strong>
        </Link>

        <button type="button" className={styles.againBtn} onClick={start}>
          もう一度
        </button>
      </div>
    );
  }

  // ---- プレイ中（シナリオ） ----
  const correct = choice && choice === sc.rational;
  return (
    <div className={styles.game}>
      <div className={styles.progress}>
        {SCENARIOS.map((_, i) => (
          <span key={i} className={`${styles.dot} ${i <= round ? styles.dotOn : ''}`} aria-hidden="true" />
        ))}
        <span className={styles.progressText}>{round + 1} / {SCENARIOS.length}</span>
      </div>

      <h3 className={styles.scenarioTitle}>{sc.title}</h3>

      <div className={styles.facts}>
        <div className={`${styles.fact} ${styles.factPaid}`}>
          <span className={styles.factLabel}>もう払った額</span>
          <span className={styles.factValue}>{sc.paid}</span>
          <span className={styles.factTag}>← これは戻らない</span>
        </div>
        <div className={styles.fact}>
          <span className={styles.factLabel}>これからの使い道</span>
          <span className={styles.factValueSm}>{sc.future}</span>
        </div>
        <div className={styles.fact}>
          <span className={styles.factLabel}>これからのコスト</span>
          <span className={styles.factValueSm}>{sc.cost}</span>
        </div>
      </div>

      {!choice ? (
        <div className={styles.choices}>
          {(['keep', 'cancel']).map((c) => (
            <button key={c} type="button" className={styles.choiceBtn} onClick={() => pick(c)}>
              <span className={styles.choiceLabel}>{CHOICES[c].label}</span>
              <span className={styles.choiceSub}>{CHOICES[c].sub}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className={`${styles.reveal} ${correct ? styles.revealOk : styles.revealNg}`}>
          <p className={styles.revealHead}>
            {correct ? '◎ 未来で判断できました' : '△ 払った額に引っ張られたかも'}
            <span className={styles.revealAnswer}>
              合理的なのは「{sc.rational === 'keep' ? '続ける' : 'やめる'}」
            </span>
          </p>
          <p className={styles.revealText}>{sc.explain}</p>
          <button type="button" className={styles.nextBtn} onClick={next}>
            {round + 1 >= SCENARIOS.length ? '結果を見る' : '次へ'}
          </button>
        </div>
      )}
    </div>
  );
}
