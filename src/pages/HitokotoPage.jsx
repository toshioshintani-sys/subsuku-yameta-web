import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import NotFoundPage from './NotFoundPage';
import { HITOKOTO, getHitokoto } from '../data/hitokoto';
import styles from './StaticPage.module.css';

export function HitokotoIndexPage() {
  return (
    <div className={styles.page}>
      <Seo
        title="ひとこと"
        description="日常の小さな「あるある」を一言で。そのあとに、少しだけ真面目な話を添えています。"
        canonical="/hitokoto"
      />
      <div className={styles.inner}>
        <h1 className={styles.title}>ひとこと</h1>
        <p className={styles.lead}>
          日常の小ネタです。だいたい実話の顔をした創作です。気になった一言があれば、そのあとの少し真面目な話も読んでみてください。
        </p>
        {HITOKOTO.map((h) => (
          <div className={styles.card} key={h.id}>
            <p><Link to={`/hitokoto/${h.id}`}>{h.neta}</Link></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HitokotoPage() {
  const { id } = useParams();
  const h = getHitokoto(id);
  if (!h) return <NotFoundPage />;
  return (
    <div className={styles.page}>
      <Seo title={h.neta} description={h.insight} canonical={`/hitokoto/${h.id}`} />
      <div className={styles.inner}>
        <h1 className={styles.title}>{h.neta}</h1>
        <p className={styles.lead}>{h.insight}</p>
        <div className={styles.card}>
          <h2>少しだけ真面目な話</h2>
          {h.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className={styles.card}>
          <h2>次の一手（急がなくて大丈夫です）</h2>
          <ul>
            {h.next.map((n) => <li key={n.to}><Link to={n.to}>{n.label}</Link></li>)}
          </ul>
        </div>
        <p><Link to="/hitokoto">ほかのひとこと</Link></p>
      </div>
    </div>
  );
}
