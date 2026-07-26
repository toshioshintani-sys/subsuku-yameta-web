#!/usr/bin/env node
/**
 * fetch-pages.mjs — 調査用に公式ページの本文をまとめて取ってくる（2026-07-26 追加）
 *
 * ■ なぜ要るのか（実測にもとづく）
 *   2026-07-26、7サービスの価格調査に **36.5分** かかった。内訳を測ると、
 *   ボトルネックはモデルではなく **Web取得の往復** だった：
 *     ・1回のページ取得に約 9〜11秒
 *     ・調査役1体あたり 40〜70回叩く（検索してURLを探す往復が大半）
 *     ・→ 1体で8〜14分。並列にしても「最長の1体＋その検証」が全体時間になる
 *
 *   このスクリプトは **取得だけ** を並列でやる。20ページでも数分で終わる。
 *   取れた本文をそのまま読めば、調査エージェントを立てる必要すらなくなり、
 *   サブエージェントのトークンがゼロになる。
 *
 *   ＝ **取得（機械・速い・無料）と 判断（人/Claude・遅い・高い）を分ける。**
 *
 * ■ 使い方
 *   node scripts/price-watch/fetch-pages.mjs netflix spotify        # watch-list のURLを使う
 *   node scripts/price-watch/fetch-pages.mjs --all                  # enabled 全件
 *   node scripts/price-watch/fetch-pages.mjs --all --skip-known-bad # 取れないと分かっている先を飛ばす
 *   node scripts/price-watch/fetch-pages.mjs --url https://example.com/pricing
 *   node scripts/price-watch/fetch-pages.mjs netflix --out tmp/pages.md
 *
 *   既定では「金額を含む行」だけを、直前の行（プラン名になりやすい）とセットで出す。
 *   全文が要るときは --full。
 *
 * ■ 知識が自動で溜まる（2026-07-26 追加・俊雄さん指示）
 *   実行するたびに、各サービスの取得結果を watch-list.json の `fetch` に書き戻す：
 *     status  … ok（金額が取れた）/ no-money（開けたが金額なし）/ short-body（JS・アプリ前提）
 *               / timeout / http-error
 *     ms      … 所要ミリ秒（速い先・遅い先が分かる）
 *     checkedAt / moneyLines … 最後に確かめた日と、拾えた金額行の数
 *   これで「このサイトは素で速い」「ここはクッキー壁で無理」という判断が、
 *   私の記憶ではなくファイルに残る。**覚えておく必要がある仕組みは必ず抜けるので、
 *   道具の側が勝手に覚える形にしてある。**
 *   `--skip-known-bad` を付けると、直近で timeout / short-body だった先を最初から飛ばす。
 *   記録したくない時だけ `--no-record`。
 *
 * ■ 注意
 *   ここで取れるのは素材であって答えではない。**誤報ゼロ原則は変わらない**——
 *   出てきた数字をそのまま services.js に書かず、プラン名との対応・割引と通常価格の別・
 *   税込税別・アプリ内課金の差を、必ず自分の目で確かめること。
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');

const MONEY = /[¥￥]\s?[\d,]+|\d[\d,]*\s?円|\$\s?[\d,.]+/;
const CONCURRENCY = 5; // 相手サイトに迷惑をかけない範囲で並列

function parseArgs(argv) {
  const ids = [];
  const urls = [];
  let out = null;
  let full = false;
  let all = false;
  let record = true;
  let skipKnownBad = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--all') all = true;
    else if (a === '--full') full = true;
    else if (a === '--no-record') record = false;
    else if (a === '--skip-known-bad') skipKnownBad = true;
    else if (a === '--out') out = argv[++i];
    else if (a === '--url') urls.push(argv[++i]);
    else if (!a.startsWith('--')) ids.push(a);
  }
  return { ids, urls, out, full, all, record, skipKnownBad };
}

// 取得結果を分類する。次回の判断材料になるので、曖昧に丸めず理由を分けて残す。
function classify(r, moneyLines) {
  if (!r.ok) return /timeout/i.test(r.error || '') ? 'timeout' : 'http-error';
  if (r.text.length < 300) return 'short-body'; // JS/アプリ前提・同意壁など、素では中身が出ない
  if (moneyLines === 0) return 'no-money'; // 開けたが金額が無い（URLが違う／同意壁の可能性）
  return 'ok';
}

const STATUS_LABEL = {
  ok: '✅ 取れる',
  'ok-suspect': '🔶 取れたが要確認',
  'no-money': '⚠️ 開くが金額なし',
  'short-body': '⚠️ JS/アプリ前提',
  timeout: '❌ タイムアウト',
  'http-error': '❌ 取得失敗',
};

/**
 * 「取得は成功したのに中身がおかしい」を検出する（2026-07-26 追加・俊雄さん指示）。
 *
 * ■ なぜ要るのか
 *   同じ失敗を繰り返さないのは --skip-known-bad で足りる。危ないのは**成功の側**で、
 *   2026-07-26 に実際に起きた偽陽性は全部「取得は成功していた」：
 *     ・LINE MUSIC … ページは開いたが、拾えたのは生HTMLに残る**古い**価格だった
 *     ・Claude Pro … ページは開いたが、それは**APIのトークン単価**ページで個人向け価格が無かった
 *     ・Google Workspace … 開いたが「割引価格と通常価格」のペアを両方拾っていた
 *   どれも status:ok なので、成功として素通りすると誤報になる。
 *   **成功しても違和感があれば、すぐ別角度で見る。** そのための検査。
 */
function suspicion(tokens, ours, usdExpected) {
  const reasons = [];
  const yen = tokens.yen;
  const usd = tokens.usd;

  // ドル建てで請求されるサービス（USD_PRICED）は、ドルしか出ないのが正常。
  // ここを毎回警告すると Claude Pro / Cursor 等が常時点灯してオオカミ少年になるので、
  // ドル建ての時は「期待するドル額がページにあるか」で見る。
  if (usdExpected) {
    if (usd.size === 0) {
      reasons.push('ドル建てのはずなのにドル表記が無い（別ページを見ている疑い）');
    } else if (!usd.has(usdExpected) && !usd.has(Math.round(usdExpected / 1.1))) {
      // 税抜（$20）と日本向け税込（$22）のどちらでも一致すればよしとする
      reasons.push(`期待するドル額（$${usdExpected}）がページに無い（$${[...usd].slice(0, 6).join(', $')}）`);
    }
    return reasons.concat(sharedChecks(yen, usd));
  }

  // ① うちが表示している金額が1つもページに無い＝別ページを見ているか、価格が変わったか
  if (ours.size > 0 && yen.size > 0) {
    const overlap = [...ours].filter((v) => yen.has(v));
    if (overlap.length === 0) reasons.push('うちの表示価格がページに1つも無い（別ページか、価格が変わった）');
  }

  // ② 円建てのはずなのにドルしか出ない＝海外向け/API料金ページを見ている疑い
  if (ours.size > 0 && yen.size === 0 && usd.size > 0) {
    reasons.push('円が1つも無くドルだけ（海外向けページ／API料金ページを見ている疑い）');
  }

  return reasons.concat(sharedChecks(yen, usd));
}

// 円建て・ドル建てのどちらでも効く共通の検査
function sharedChecks(yen, usd) {
  const reasons = [];

  // ③ 極端な値が混ざる＝本文中の無関係な数字を拾っている
  const extreme = [...yen].filter((v) => v > 0 && (v < 50 || v > 500000));
  if (extreme.length) reasons.push(`桁が不自然な値を拾っている（${extreme.slice(0, 4).join(', ')}）`);

  // ④ 金額が多すぎる＝1ページに複数商品・複数国の価格が並んでいる
  if (yen.size + usd.size > 15) reasons.push(`金額の種類が多すぎる（${yen.size + usd.size}種）＝別商品が混ざっている疑い`);

  // ⑤ 割引価格と通常価格のペア（片方がもう片方のちょうど半額）
  //    Google Workspace が「¥400 と ¥800」を並べて出していた実例に対応する。
  const arr = [...yen].sort((a, b) => a - b);
  const pair = arr.find((v) => arr.includes(v * 2));
  if (pair) reasons.push(`ちょうど半額の組がある（${pair} と ${pair * 2}）＝割引価格と通常価格の並記の疑い`);

  return reasons;
}

async function main() {
  const { ids, urls, out, full, all, record, skipKnownBad } = parseArgs(process.argv.slice(2));

  const wlPath = resolve(HERE, 'watch-list.json');
  const wl = JSON.parse(readFileSync(wlPath, 'utf-8'));
  const listKey = wl.watch ? 'watch' : 'targets';
  const list = wl[listKey] || [];
  const timeoutMs = wl.settings?.timeoutMs || 35000;

  // 「取れない先」と決めつけるのは**2回続けて失敗してから**。
  // 1回のタイムアウトは回線・負荷・たまたまで普通に起きる（実際 claude-pro は
  // 20秒前に取れていたのに次の実行でタイムアウトした）。
  // 一時的な失敗を永久の知識にすると、取れるはずの先を永久に飛ばすことになる。
  const KNOWN_BAD = new Set(['timeout', 'short-body', 'http-error']);
  const isKnownBad = (w) => KNOWN_BAD.has(w.fetch?.status) && (w.fetch?.fails || 0) >= 2;

  let targets = [];
  if (all) {
    targets = list
      .filter((w) => w.enabled !== false)
      .filter((w) => !(skipKnownBad && isKnownBad(w)))
      .map((w) => ({ id: w.id, url: w.url }));
    const skipped = list.filter((w) => w.enabled !== false && skipKnownBad && isKnownBad(w));
    if (skipped.length) {
      console.error(`（既知の取得不可を ${skipped.length} 件スキップ: ${skipped.map((s) => s.id).join(', ')}）`);
    }
  } else if (ids.length) {
    for (const id of ids) {
      const hit = list.find((w) => w.id === id);
      if (!hit) {
        console.error(`  ⚠ watch-list に "${id}" が無い。--url で直接指定してください`);
        continue;
      }
      targets.push({ id: hit.id, url: hit.url });
    }
  }
  urls.forEach((u, i) => targets.push({ id: `url${i + 1}`, url: u }));

  if (!targets.length) {
    console.error('対象がありません。サービスidか --url か --all を指定してください。');
    process.exit(1);
  }

  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--lang=ja-JP'],
  });

  const started = Date.now();
  const results = [];

  // 並列（ただし CONCURRENCY 本まで）。相手ごとに1タブ。
  let cursor = 0;
  async function worker() {
    while (cursor < targets.length) {
      const t = targets[cursor++];
      const page = await browser.newPage();
      await page.setExtraHTTPHeaders({ 'accept-language': 'ja' });
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      );
      const t0 = Date.now();
      try {
        await page.goto(t.url, { waitUntil: 'networkidle2', timeout: timeoutMs });
        await page.waitForFunction(
          () => document.body && document.body.innerText.replace(/\s/g, '').length > 80,
          { timeout: 8000 }
        ).catch(() => {});
        const text = await page.evaluate(() => (document.body ? document.body.innerText : ''));
        results.push({ ...t, ok: true, ms: Date.now() - t0, text });
      } catch (e) {
        results.push({ ...t, ok: false, ms: Date.now() - t0, error: String(e.message || e).slice(0, 120) });
      } finally {
        await page.close();
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, targets.length) }, worker));
  await browser.close();

  results.sort((a, b) => targets.findIndex((t) => t.id === a.id) - targets.findIndex((t) => t.id === b.id));

  // --- 取得結果を分類して、watch-list に知識として書き戻す ---
  // うちの表示価格（services.js）を読み、成功した取得の中身が妥当かを検査する材料にする。
  let PRICING = {};
  let PLANS = {};
  let USD_PRICED = {};
  try {
    ({ PRICING, PLANS, USD_PRICED = {} } = await import(pathToFileURL(resolve(ROOT, 'src/data/services.js')).href));
  } catch {
    console.error('（services.js を読めなかったので、中身の妥当性検査は省略します）');
  }
  const oursOf = (id) => {
    const set = new Set();
    if (typeof PRICING[id] === 'number' && PRICING[id] > 0) set.add(PRICING[id]);
    for (const p of PLANS[id]?.plans || []) {
      if (typeof p.monthly === 'number' && p.monthly > 0) set.add(p.monthly);
      if (typeof p.yearly === 'number' && p.yearly > 0) set.add(p.yearly);
    }
    return set;
  };

  const profile = new Map(); // id -> { status, ms, moneyLines, suspects }
  for (const r of results) {
    const moneyLineList = r.ok
      ? r.text.split('\n').map((s) => s.trim()).filter((l) => l && MONEY.test(l) && l.length <= 140)
      : [];
    let status = classify(r, moneyLineList.length);
    let suspects = [];
    if (status === 'ok') {
      // 拾った金額を数値化（円とドルを分ける）
      const yen = new Set();
      const usd = new Set();
      for (const line of moneyLineList) {
        for (const m of line.matchAll(new RegExp(MONEY.source, 'g'))) {
          const tok = m[0];
          const n = Number(tok.replace(/[¥￥$,\s円]/g, ''));
          if (!Number.isFinite(n) || n <= 0) continue;
          (tok.includes('$') ? usd : yen).add(n);
        }
      }
      suspects = suspicion({ yen, usd }, oursOf(r.id), USD_PRICED[r.id]);
      if (suspects.length) status = 'ok-suspect';
    }
    profile.set(r.id, { status, ms: r.ms, moneyLines: moneyLineList.length, suspects });
  }

  if (record) {
    const today = new Date().toISOString().slice(0, 10);
    let updated = 0;
    for (const w of list) {
      const p = profile.get(w.id);
      if (!p) continue; // --url で直接指定したものは watch-list に無いので記録しない
      // ⚠️ 上書きする前に前回値を退避すること（上書き後に読むと必ず undefined になる）
      const prevFails = w.fetch?.fails || 0;
      const prevOkAt = w.fetch?.lastOkAt;
      const failed = KNOWN_BAD.has(p.status);
      const succeeded = p.status === 'ok' || p.status === 'ok-suspect';
      w.fetch = {
        status: p.status,
        ms: p.ms,
        moneyLines: p.moneyLines,
        checkedAt: today,
        // 連続失敗の回数。成功したら0に戻す＝一度きりの不調を引きずらない
        fails: failed ? prevFails + 1 : 0,
      };
      // 最後に取れた日は消さずに残す（「前は取れていた＝一時的な不調」が分かるように）
      const lastOkAt = succeeded ? today : prevOkAt;
      if (lastOkAt) w.fetch.lastOkAt = lastOkAt;
      if (p.suspects?.length) w.fetch.suspects = p.suspects;
      updated++;
    }
    if (updated) {
      wl[listKey] = list;
      writeFileSync(wlPath, JSON.stringify(wl, null, 2) + '\n', 'utf-8');
    }
  }

  const lines = [];
  lines.push(`# 公式ページ取得結果（${targets.length}件・${((Date.now() - started) / 1000).toFixed(1)}秒）`);
  lines.push('');
  lines.push('⚠️ ここにあるのは素材であって答えではない。プラン名との対応・割引と通常価格の別・');
  lines.push('　 税込税別・アプリ内課金の差を必ず自分の目で確かめてから services.js に書くこと。');
  lines.push('');

  for (const r of results) {
    lines.push(`## ${r.id}`);
    lines.push(r.url);
    if (!r.ok) {
      lines.push(`❌ 取得失敗（${(r.ms / 1000).toFixed(1)}秒）: ${r.error}`);
      lines.push('');
      continue;
    }
    const prof = profile.get(r.id);
    lines.push(`${STATUS_LABEL[prof?.status] || '✅'} ${(r.ms / 1000).toFixed(1)}秒 / 本文 ${r.text.length}字`);
    if (r.text.length < 300) {
      lines.push('⚠️ 本文が極端に短い＝JS/アプリ前提のページの可能性。別URLを探すこと。');
    }
    // 「取得は成功したが中身がおかしい」時は、抜き出した行だけ見ても判断を誤る。
    // その場で全文（別角度）も出して、文脈ごと確かめられるようにする。
    if (prof?.suspects?.length) {
      lines.push('');
      lines.push('🔶 **取れたが違和感あり。抜き出した行だけで判断しないこと。**');
      prof.suspects.forEach((s) => lines.push(`   - ${s}`));
      lines.push('   → 下に全文を出すので、金額がどのプランのものか文脈で確かめる。');
      lines.push('   → それでも判然としなければ、別URL（料金ページ/ヘルプ/申込ページ）を当たる。');
    }
    lines.push('');
    if (full || prof?.suspects?.length) {
      lines.push('```');
      lines.push(r.text.slice(0, 20000));
      lines.push('```');
    } else {
      const L = r.text.split('\n').map((s) => s.trim()).filter(Boolean);
      let hit = 0;
      L.forEach((l, i) => {
        if (!MONEY.test(l) || l.length > 140) return;
        hit++;
        const prev = L[i - 1] && L[i - 1].length < 60 ? `[${L[i - 1]}] ` : '';
        lines.push(`- ${prev}${l}`);
      });
      if (!hit) lines.push('（金額を含む行が見つからなかった）');
    }
    lines.push('');
  }

  const body = lines.join('\n');
  if (out) {
    const p = resolve(ROOT, out);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, body + '\n', 'utf-8');
    console.log(body.split('\n').slice(0, 4).join('\n'));
    console.log(`\n→ ${out} に書き出しました`);
  } else {
    console.log(body);
  }

  // --- どのサイトが速いか／取れないかの一覧（次回の判断材料） ---
  const rows = [...profile.entries()].sort((a, b) => a[1].ms - b[1].ms);
  console.error('\n── 取得プロファイル（速い順・watch-list に記録済み）──');
  for (const [id, p] of rows) {
    console.error(
      `  ${(p.ms / 1000).toFixed(1)}s`.padStart(8) +
        `  ${STATUS_LABEL[p.status] || p.status}`.padEnd(22) +
        `  ${id}` +
        (p.moneyLines ? `（金額行 ${p.moneyLines}）` : '')
    );
  }
  const suspect = rows.filter(([, p]) => p.status === 'ok-suspect');
  if (suspect.length) {
    console.error(`\n🔶 取れたが違和感がある ${suspect.length} 件（成功として素通りさせない）:`);
    for (const [id, p] of suspect) {
      console.error(`  ${id}`);
      p.suspects.forEach((s) => console.error(`    - ${s}`));
    }
    console.error('  → 出力に全文を併記した。抜き出した行だけで判断せず、文脈で確かめること。');
  }

  const bad = rows.filter(([, p]) => !['ok', 'ok-suspect'].includes(p.status));
  if (bad.length) {
    console.error(
      `\n取れなかった ${bad.length} 件は、別URLを探すか手で見るしかない。` +
        `\n次回 --skip-known-bad を付けると最初から飛ばす。`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
