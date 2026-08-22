'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function AuspiciousPage() {
  const [activeTab, setActiveTab] = useState<'travel' | 'work' | 'finance'>('travel');
  const [selectedDate, setSelectedDate] = useState('');
  const [result, setResult] = useState<any | null>(null);

  const handleSearch = () => {
    // Mock Result
    setResult({
      date: selectedDate || '25 สิงหาคม 2569',
      bestTime: '06:15 - 08:20',
      secondaryTime: '13:20 - 15:30',
      avoidTime: '08:25 - 10:48',
      topic: activeTab === 'travel' ? 'กรุงเทพฯ → เชียงใหม่' : activeTab === 'work' ? 'เริ่มงาน / เซ็นสัญญา' : 'การเจรจาการเงิน'
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="text-gold-gradient">ค้นหาฤกษ์มงคล</h1>
        <p className={styles.subtitle}>เลือกหมวดหมู่ที่ต้องการดูฤกษ์</p>
      </header>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'travel' ? styles.activeTab : ''}`}
          onClick={() => {setActiveTab('travel'); setResult(null);}}
        >
          🚗 เดินทาง
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'work' ? styles.activeTab : ''}`}
          onClick={() => {setActiveTab('work'); setResult(null);}}
        >
          💼 การงาน
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'finance' ? styles.activeTab : ''}`}
          onClick={() => {setActiveTab('finance'); setResult(null);}}
        >
          💰 การเงิน
        </button>
      </div>

      <div className={`glass-panel ${styles.searchCard}`}>
        <div className={styles.formGroup}>
          <label>📅 วันที่ต้องการ</label>
          <input 
            type="date" 
            className={styles.inputField} 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {activeTab === 'travel' && (
          <div className={styles.formGroup}>
            <label>📍 เส้นทาง (ตัวเลือก)</label>
            <input type="text" placeholder="เช่น กรุงเทพ - เชียงใหม่" className={styles.inputField} />
          </div>
        )}

        {activeTab === 'work' && (
          <div className={styles.formGroup}>
            <label>📌 กิจกรรม</label>
            <select className={styles.inputField}>
              <option>เปิดร้าน / เริ่มกิจการ</option>
              <option>เซ็นสัญญา</option>
              <option>สัมภาษณ์งาน</option>
            </select>
          </div>
        )}

        <button className={styles.searchButton} onClick={handleSearch}>
          🔍 ค้นหาฤกษ์ดี
        </button>
      </div>

      {result && (
        <div className={`glass-panel ${styles.resultCard}`}>
          <div className={styles.resultHeader}>
            <h3>{result.topic}</h3>
            <p>{result.date}</p>
          </div>

          <div className={styles.timeSlot}>
            <div className={styles.timeLabel}>
              <span className={styles.icon}>⭐</span>
              <span>เวลาแนะนำ (ดีที่สุด)</span>
            </div>
            <div className={styles.timeValueGood}>{result.bestTime}</div>
          </div>

          <div className={styles.timeSlot}>
            <div className={styles.timeLabel}>
              <span className={styles.icon}>🟡</span>
              <span>เวลารอง (เหมาะสม)</span>
            </div>
            <div className={styles.timeValueNeutral}>{result.secondaryTime}</div>
          </div>

          <div className={styles.timeSlot}>
            <div className={styles.timeLabel}>
              <span className={styles.icon}>🔴</span>
              <span>ควรหลีกเลี่ยง</span>
            </div>
            <div className={styles.timeValueBad}>{result.avoidTime}</div>
          </div>

          <button className={styles.calendarButton}>
            📅 เพิ่มลงปฏิทิน
          </button>
        </div>
      )}
    </div>
  );
}
