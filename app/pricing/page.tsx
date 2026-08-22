'use client';
import Link from 'next/link';
import styles from './page.module.css';
import { useState } from 'react';

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (packageId: string, price: number, name: string) => {
    setIsLoading(packageId);
    try {
      const res = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId, price, name }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error: ' + (data.error || 'Something went wrong'));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to payment gateway');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="text-gold-gradient">NEXORA Packages</h1>
        <p className={styles.subtitle}>เลือกแพ็กเกจที่เหมาะกับไลฟ์สไตล์มูเตรูของคุณ</p>
      </header>

      <div className={styles.pricingGrid}>
        
        {/* Basic Plan */}
        <div className={`glass-panel ${styles.pricingCard}`}>
          <div className={styles.tierName}>สายมูเริ่มต้น (Basic)</div>
          <div className={styles.price}>ฟรี</div>
          <p className={styles.tierDesc}>เหมาะสำหรับผู้เริ่มต้นดูฤกษ์ยามพื้นฐาน</p>
          
          <ul className={styles.featureList}>
            <li>✔️ ดูฤกษ์ประจำวัน (ยามอุบากอง)</li>
            <li>✔️ AI วิเคราะห์ลายมือ 1 ครั้ง / เดือน</li>
            <li>✔️ AI แชทถามเรื่องฤกษ์ 3 คำถาม / วัน</li>
          </ul>
          
          <button className={styles.selectButtonOutline}>เริ่มต้นใช้งาน</button>
        </div>

        {/* Premium Plan (Recommended) */}
        <div className={`glass-panel ${styles.pricingCard} ${styles.recommendedCard}`}>
          <div className={styles.recommendedBadge}>ยอดนิยม (Best Value)</div>
          <div className={styles.tierName}>สายมูพรีเมียม (Premium)</div>
          <div className={styles.price}>
            <span className={styles.currency}>฿</span>
            59
            <span className={styles.period}>/ เดือน</span>
          </div>
          <p className={styles.tierDesc}>เข้าถึงข้อมูลเจาะลึกและผู้ช่วย AI ส่วนตัว</p>
          
          <ul className={styles.featureList}>
            <li>⭐ <strong>ดูฤกษ์เจาะลึก</strong> (การงาน, การเงิน, ความรัก)</li>
            <li>⭐ <strong>AI วิเคราะห์ลายมือ</strong> ไม่จำกัดจำนวนครั้ง</li>
            <li>⭐ <strong>AI Birth Profile</strong> เชิงลึกส่วนบุคคล</li>
            <li>⭐ <strong>AI แชทส่วนตัว</strong> ถามตอบไม่จำกัด</li>
            <li>⭐ <strong>แจ้งเตือนฤกษ์</strong> ผ่านแอปพลิเคชัน</li>
          </ul>
          
          <button 
            className={styles.selectButtonPrimary}
            onClick={() => handleSubscribe('premium', 59, 'Premium')}
            disabled={isLoading === 'premium'}
          >
            {isLoading === 'premium' ? 'กำลังดำเนินการ...' : 'สมัครแพ็กเกจพรีเมียม'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className={`glass-panel ${styles.pricingCard}`}>
          <div className={styles.tierName}>สายมูครอบครัว (Pro)</div>
          <div className={styles.price}>
            <span className={styles.currency}>฿</span>
            159
            <span className={styles.period}>/ เดือน</span>
          </div>
          <p className={styles.tierDesc}>สำหรับธุรกิจขนาดเล็ก และการดูแลทุกคนในครอบครัว</p>
          
          <ul className={styles.featureList}>
            <li>👑 <strong>ได้รับสิทธิ์ทุกอย่างใน Premium</strong></li>
            <li>👑 <strong>ผูกดวงชะตาได้ 5 คน</strong> (ครอบครัว/หุ้นส่วน)</li>
            <li>👑 <strong>AI วิเคราะห์ความเข้ากันได้</strong> ระหว่างบุคคล</li>
            <li>👑 <strong>แจ้งเตือนฤกษ์ส่วนตัว</strong> ผ่าน LINE OA</li>
          </ul>
          
          <button 
            className={styles.selectButtonOutline}
            onClick={() => handleSubscribe('pro', 159, 'PRO')}
            disabled={isLoading === 'pro'}
          >
            {isLoading === 'pro' ? 'กำลังดำเนินการ...' : 'อัปเกรดเป็นระดับ PRO'}
          </button>
        </div>

      </div>
    </div>
  );
}
