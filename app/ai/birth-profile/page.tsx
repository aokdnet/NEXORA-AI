'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function BirthProfilePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  
  // Form State
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [gender, setGender] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate, birthTime, birthPlace, gender })
      });

      const data = await response.json();

      if (!response.ok || !data.summary) {
        // Fallback mock if no API key or quota exceeded
        setResult({
          powerRating: 4,
          workRating: 5,
          financeRating: 4,
          travelRating: 3,
          relationRating: 4,
          summary: '⚠️ (ระบบจำลองเนื่องจาก AI จริงขัดข้อง): จากข้อมูลวันเกิด ระบบพบว่าช่วงเช้าเหมาะกับกิจกรรมที่ต้องใช้การตัดสินใจ ส่วนการเจรจาสำคัญสามารถนำยามประจำวันมาประกอบการเลือกเวลาเพิ่มเติมได้'
        });
      } else {
        setResult(data);
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? styles.starFilled : styles.starEmpty}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ai" className={styles.backButton}>← กลับ</Link>
        <h1 className="text-gold-gradient">AI Birth Profile</h1>
        <p className={styles.subtitle}>ผูกดวงชะตาวิเคราะห์ฤกษ์ประจำตัว</p>
      </header>

      {!result ? (
        <form className={`glass-panel ${styles.formCard}`} onSubmit={handleAnalyze}>
          <div className={styles.formGroup}>
            <label>📅 วัน/เดือน/ปีเกิด</label>
            <input 
              type="date" 
              className={styles.inputField}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label>⏰ เวลาเกิด (ถ้าทราบ)</label>
            <input 
              type="time" 
              className={styles.inputField}
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>📍 สถานที่เกิด (จังหวัด)</label>
            <input 
              type="text" 
              placeholder="เช่น ขอนแก่น, กรุงเทพฯ"
              className={styles.inputField}
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>👤 เพศ (ไม่บังคับ)</label>
            <select 
              className={styles.inputField}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">เลือกเพศ...</option>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>

          <button 
            type="submit" 
            className={styles.analyzeButton} 
            disabled={isAnalyzing || !birthDate}
          >
            {isAnalyzing ? (
              <span className={styles.loadingText}>✨ กำลังผูกดวงด้วย AI...</span>
            ) : (
              '🔮 สร้าง Birth Profile'
            )}
          </button>
        </form>
      ) : (
        <section className={styles.resultSection}>
          <div className={`glass-panel ${styles.profileCard}`}>
            <h2>สรุปพื้นดวงของคุณ</h2>
            
            <div className={styles.ratingList}>
              <div className={styles.ratingItem}>
                <span className={styles.ratingLabel}>พลังประจำวันเกิด</span>
                {renderStars(result.powerRating)}
              </div>
              <div className={styles.ratingItem}>
                <span className={styles.ratingLabel}>💼 งาน / ธุรกิจ</span>
                {renderStars(result.workRating)}
              </div>
              <div className={styles.ratingItem}>
                <span className={styles.ratingLabel}>💰 การเงิน</span>
                {renderStars(result.financeRating)}
              </div>
              <div className={styles.ratingItem}>
                <span className={styles.ratingLabel}>🚗 การเดินทาง</span>
                {renderStars(result.travelRating)}
              </div>
              <div className={styles.ratingItem}>
                <span className={styles.ratingLabel}>❤️ ความสัมพันธ์</span>
                {renderStars(result.relationRating)}
              </div>
            </div>

            <div className={styles.aiSummaryBox}>
              <h3>🤖 บทวิเคราะห์จาก AI</h3>
              <p>{result.summary}</p>
            </div>
            
            <button className={styles.resetButton} onClick={() => setResult(null)}>
              คำนวณใหม่
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
