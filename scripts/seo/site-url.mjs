// 本番オリジンの単一ソース（Nodeスクリプト用）。
// アプリ側は src/config.js（import.meta.env.VITE_SITE_URL）が担うが、node実行のスクリプトは
// import.meta.env を持たないため、ここで process.env.VITE_SITE_URL を読む（.env も最小ロード）。
//
// ドメイン移行時は .env / Netlify の VITE_SITE_URL を差し替えるだけで全スクリプトに反映される。
// env 未設定なら現行 Netlify ドメインにフォールバック＝挙動は不変（移行前の安全弁）。
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FALLBACK_SITE_URL = 'https://sabusuku.netlify.app';

// .env を最小ロード（post-note.mjs と同方式・既存の process.env を上書きしない）
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
(function loadEnv() {
  const f = resolve(ROOT, '.env');
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const i = t.indexOf('=');
    const k = t.slice(0, i).trim();
    if (k && !process.env[k]) process.env[k] = t.slice(i + 1).trim();
  }
})();

export const SITE_URL = (process.env.VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, '');
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '');
