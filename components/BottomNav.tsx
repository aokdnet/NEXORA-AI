import Link from 'next/link';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      <Link href="/" className={styles.navItem}>
        <span className={styles.icon}>🏠</span>
        <span className={styles.label}>วันนี้</span>
      </Link>
      <Link href="/auspicious" className={styles.navItem}>
        <span className={styles.icon}>🔮</span>
        <span className={styles.label}>ฤกษ์</span>
      </Link>
      <Link href="/ai" className={`${styles.navItem} ${styles.aiButton}`}>
        <div className={styles.aiIconWrapper}>
          <span className={styles.icon}>✨</span>
        </div>
        <span className={styles.label}>AI</span>
      </Link>
      <Link href="/calendar" className={styles.navItem}>
        <span className={styles.icon}>📅</span>
        <span className={styles.label}>ปฏิทิน</span>
      </Link>
      <Link href="/profile" className={styles.navItem}>
        <span className={styles.icon}>👤</span>
        <span className={styles.label}>ฉัน</span>
      </Link>
    </nav>
  );
}
