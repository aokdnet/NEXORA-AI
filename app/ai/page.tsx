import Link from 'next/link';
import styles from './page.module.css';

export default function AIHub() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="text-gold-gradient">AI ผู้ช่วยส่วนตัว</h1>
        <p className={styles.subtitle}>วิเคราะห์ดวงชะตาและฤกษ์ยามด้วย AI</p>
      </header>

      <div className={styles.menuGrid}>
        <Link href="/ai/palm-reading" className={`glass-panel ${styles.menuCard}`}>
          <div className={styles.iconWrapper}>✋</div>
          <h2>AI วิเคราะห์ลายมือ</h2>
          <p>ถ่ายรูปฝ่ามือเพื่อให้ AI อ่านเส้นชีวิต การงาน และการเงินของคุณ</p>
        </Link>

        <Link href="/ai/birth-profile" className={`glass-panel ${styles.menuCard}`}>
          <div className={styles.iconWrapper}>🧠</div>
          <h2>AI Birth Profile</h2>
          <p>กรอกวันเกิดเพื่อวิเคราะห์ศักยภาพและฤกษ์ที่เหมาะสมกับคุณ</p>
        </Link>

        <Link href="/ai/assistant" className={`glass-panel ${styles.menuCard}`}>
          <div className={styles.iconWrapper}>💬</div>
          <h2>AI แชทปรึกษาฤกษ์</h2>
          <p>พูดคุยกับ AI เพื่อขอคำแนะนำการเลือกวันเดินทางหรือทำงาน</p>
        </Link>
      </div>
    </div>
  );
}
