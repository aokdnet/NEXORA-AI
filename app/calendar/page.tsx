'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<number | null>(21);

  // Mock days for August 2026
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDayOfWeek = 6; // Aug 1, 2026 is Saturday
  
  const blanks = Array.from({ length: startDayOfWeek }, (_, i) => i);

  // Mock scores for specific days to show in the UI as examples
  const mockDayData: Record<number, { type: 'good' | 'neutral' | 'bad' }> = {
    9: { type: 'bad' },
    12: { type: 'good' },
    14: { type: 'neutral' },
    21: { type: 'good' },
    23: { type: 'bad' },
    24: { type: 'good' },
  };

  const getDayClass = (day: number) => {
    if (day === selectedDate) return styles.selectedDay;
    const type = mockDayData[day]?.type;
    if (type === 'good') return styles.goodDay;
    if (type === 'bad') return styles.badDay;
    if (type === 'neutral') return styles.neutralDay;
    return styles.normalDay;
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.iconButton}>☰</button>
          <h1 className="text-gold-gradient">ปฏิทินมงคล AI</h1>
          <button className={styles.iconButton}>⚙️</button>
        </div>
      </header>

      <div className={styles.calendarContainer}>
        <div className={styles.monthSelector}>
          <button>←</button>
          <h2>สิงหาคม 2569</h2>
          <button>→</button>
        </div>

        <div className={styles.weekdays}>
          <span>อา</span>
          <span>จ</span>
          <span>อ</span>
          <span>พ</span>
          <span>พฤ</span>
          <span>ศ</span>
          <span>ส</span>
        </div>

        <div className={styles.daysGrid}>
          {blanks.map(i => (
            <div key={`blank-${i}`} className={styles.dayCellEmpty}></div>
          ))}
          {daysInMonth.map(day => (
            <div 
              key={day} 
              className={`${styles.dayCell} ${getDayClass(day)}`}
              onClick={() => setSelectedDate(day)}
            >
              {day}
              {mockDayData[day] && <span className={styles.dot}></span>}
            </div>
          ))}
        </div>
        
        <div className={styles.legend}>
          <span><span className={styles.dotGood}></span> ดีมาก</span>
          <span><span className={styles.dotNeutral}></span> ควรระวัง</span>
          <span><span className={styles.dotBad}></span> ไม่ดี</span>
        </div>
      </div>

      <div className={styles.eventSection}>
        {selectedDate === 21 ? (
          <div className={styles.eventList}>
            <h3 className={styles.eventDateTitle}>21 สิงหาคม 2569</h3>
            <div className={`glass-panel ${styles.eventCard}`}>
              <div className={styles.eventTime}>14:00</div>
              <div className={styles.eventDetails}>
                <h4>พบลูกค้าสำคัญ</h4>
                <p>ห้องประชุม ชั้น 12</p>
              </div>
              <button className={styles.chevron}>›</button>
            </div>
            
            <div className={styles.aiAdvice}>
              <span className={styles.aiIcon}>✨</span>
              <div className={styles.aiAdviceText}>
                <strong>AI แนะนำ</strong>
                <p>ช่วง 13:13-15:36 เหมาะสำหรับการเจรจา</p>
              </div>
            </div>

            <div className={styles.eventActions}>
              <button className={`glass-panel ${styles.actionBtn}`}>
                <span className={styles.actionIcon}>🔔</span>
                <div className={styles.actionText}>
                  <strong>แจ้งเตือนล่วงหน้า</strong>
                  <span>30 นาที</span>
                </div>
              </button>
              <button className={`glass-panel ${styles.actionBtn}`}>
                <span className={styles.actionIcon}>📋</span>
                <div className={styles.actionText}>
                  <strong>เตือนก่อนเริ่มงาน</strong>
                  <span>15 นาที</span>
                </div>
              </button>
            </div>

            <div className={styles.mainActions}>
              <button className={styles.addEventBtn}>+ เพิ่มกิจกรรม</button>
              <button className={styles.syncBtn}>📅 ซิงก์ ปฏิทิน</button>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>ยังไม่มีกิจกรรมในวันนี้</p>
            <button className={styles.addEventBtn}>+ เพิ่มกิจกรรมใหม่</button>
          </div>
        )}
      </div>
    </div>
  );
}
