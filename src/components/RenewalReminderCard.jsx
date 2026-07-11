import { useState } from 'react';
import { CalendarPlus, Download, ExternalLink } from 'lucide-react';
import styles from './RenewalReminderCard.module.css';

// 「続ける人」向けの更新日リマインダー（信頼はしご 第2段=カレンダー直結／第3段=.icsダウンロード）。
// サーバー・localStorageのどちらにも更新日を保存しない。生成物（URL・ファイル）は本人の
// カレンダーに置くだけで、このサイトには何も残らない＝「更新日はあなたの端末にしか無い」と
// 言い切れる設計（docs/lessons.md 2026-07-11 参照）。
export default function RenewalReminderCard({ serviceName, monthlyDisplay, cancelUrl, renewalCheckUrl }) {
  const [date, setDate] = useState('');
  const [interval, setIntervalType] = useState('year'); // 'year' | 'month'

  const title = `${serviceName}の更新日`;
  const details = [
    `現在の目安料金: ${monthlyDisplay || '不明（ご自身の契約でご確認ください）'}`,
    `解約ページ: ${cancelUrl}`,
    'このリマインダーはサブスクやめた（sabusuku-yameta.com）で作成しました。',
  ].join('\n');

  const dateDigits = date.replaceAll('-', ''); // YYYYMMDD

  function buildGoogleCalendarUrl() {
    if (!date) return null;
    const nextDay = addDays(date, 1).replaceAll('-', '');
    const recur = interval === 'year' ? 'RRULE:FREQ=YEARLY' : 'RRULE:FREQ=MONTHLY';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${dateDigits}/${nextDay}`,
      details,
      recur,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function downloadIcs() {
    if (!date) return;
    const freq = interval === 'year' ? 'YEARLY' : 'MONTHLY';
    const uid = `renewal-${cancelUrl}-${Date.now()}@sabusuku-yameta.com`;
    const escaped = (s) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//sabusuku-yameta.com//renewal-reminder//JA',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${icsStamp()}`,
      `DTSTART;VALUE=DATE:${dateDigits}`,
      `RRULE:FREQ=${freq}`,
      `SUMMARY:${escaped(title)}`,
      `DESCRIPTION:${escaped(details)}`,
      'BEGIN:VALARM',
      'TRIGGER:-P3D',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escaped(`${title}が3日後に更新されます`)}`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `renewal-${cancelUrl.split('/')[2] || 'service'}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const googleUrl = buildGoogleCalendarUrl();

  return (
    <section className={styles.card} aria-label="更新日リマインダー">
      <p className={styles.eyebrow}>{serviceName}は続けますか？</p>
      <p className={styles.lead}>
        なら、<strong>更新日だけ</strong>控えておきましょう。値上げや使わなくなった時に、更新される前に気づけます。
      </p>

      {renewalCheckUrl && (
        <a
          className={styles.checkLink}
          href={renewalCheckUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          更新日が分からない方はこちらで確認できます
          <ExternalLink size={12} strokeWidth={1.75} aria-hidden="true" />
        </a>
      )}

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>次回の更新日</span>
          <input
            type="date"
            className={styles.dateInput}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <div className={styles.toggle} role="group" aria-label="繰り返しの間隔">
          <button
            type="button"
            className={`${styles.toggleBtn} ${interval === 'year' ? styles.toggleOn : ''}`}
            aria-pressed={interval === 'year'}
            onClick={() => setIntervalType('year')}
          >
            毎年
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${interval === 'month' ? styles.toggleOn : ''}`}
            aria-pressed={interval === 'month'}
            onClick={() => setIntervalType('month')}
          >
            毎月
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <a
          className={`${styles.btn} ${styles.btnPrimary} ${!googleUrl ? styles.btnDisabled : ''}`}
          href={googleUrl || undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!googleUrl}
          onClick={(e) => {
            if (!googleUrl) e.preventDefault();
          }}
        >
          <CalendarPlus size={16} strokeWidth={2} aria-hidden="true" />
          Googleカレンダーに追加
        </a>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={downloadIcs}
          disabled={!date}
        >
          <Download size={16} strokeWidth={2} aria-hidden="true" />
          .icsをダウンロード（Apple/Outlook）
        </button>
      </div>

      <p className={styles.note}>
        更新日はこのサイトに一切保存されません。あなたのカレンダーに追加されるだけです。
      </p>
    </section>
  );
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  // toISOString()はUTC変換されるため、JST等UTC+の環境ではローカル日付が
  // 1日ズレる（例: 2026-08-16 00:00 JST → toISOString()は2026-08-15に丸まる）。
  // ローカルの年月日を直接組み立てて回避する。
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function icsStamp() {
  return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
