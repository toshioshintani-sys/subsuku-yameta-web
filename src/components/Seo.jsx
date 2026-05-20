import { useEffect } from 'react';
import { SITE_URL } from '../config.js';

const DEFAULT_DESC =
  'Netflix・Spotify・Amazonプライム…30以上のサブスクの解約ページへ直接ジャンプ。手順と注意点も3ステップで要約。';

function setMeta(name, content, attr = 'name') {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  if (!href) return;
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function absolutize(urlOrPath) {
  if (!urlOrPath) return undefined;
  if (/^https?:\/\//.test(urlOrPath)) return urlOrPath;
  return SITE_URL + (urlOrPath.startsWith('/') ? urlOrPath : '/' + urlOrPath);
}

export default function Seo({ title, description, canonical, ogUrl, jsonLd }) {
  useEffect(() => {
    const finalTitle = title
      ? `${title}｜サブスクやめた`
      : 'サブスクやめた｜解約ページへ1クリックで飛べるサイト';
    const finalDesc = description || DEFAULT_DESC;
    const finalCanonical = absolutize(canonical);
    const finalOgUrl = absolutize(ogUrl) || finalCanonical;

    document.title = finalTitle;
    setMeta('description', finalDesc);
    setMeta('og:title', finalTitle, 'property');
    setMeta('og:description', finalDesc, 'property');
    if (finalOgUrl) setMeta('og:url', finalOgUrl, 'property');
    if (finalCanonical) setCanonical(finalCanonical);

    const scripts = [];
    const items = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
    items.forEach((obj, i) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-seo-jsonld', String(i));
      s.text = JSON.stringify(obj);
      document.head.appendChild(s);
      scripts.push(s);
    });

    return () => {
      scripts.forEach((s) => {
        if (s.parentNode) s.parentNode.removeChild(s);
      });
    };
  }, [title, description, canonical, ogUrl, jsonLd]);

  return null;
}
