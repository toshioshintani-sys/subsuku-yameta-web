import { useEffect } from 'react';

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

export default function Seo({ title, description }) {
  useEffect(() => {
    const finalTitle = title
      ? `${title}｜サブスクやめた`
      : 'サブスクやめた｜解約ページへ1クリックで飛べるサイト';
    const finalDesc = description || DEFAULT_DESC;

    document.title = finalTitle;
    setMeta('description', finalDesc);
    setMeta('og:title', finalTitle, 'property');
    setMeta('og:description', finalDesc, 'property');
  }, [title, description]);

  return null;
}
