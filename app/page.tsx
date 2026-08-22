'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from "./page.module.css";
import { getUbakongSlots, getCurrentSlot, getAuspiceIcon, getAuspiceDesc, TimeSlot } from "@/lib/ubakong";

export default function Home() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [currentSlot, setCurrentSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
    setSlots(getUbakongSlots(now, false)); // Default to day slots for now, can enhance to switch based on time
    setCurrentSlot(getCurrentSlot(now));
    
    // Update every minute
    const timer = setInterval(() => {
      const updatedNow = new Date();
      setCurrentDate(updatedNow);
      setCurrentSlot(getCurrentSlot(updatedNow));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!currentDate) return null; // Wait for client side hydration

  const thaiDateFormatter = new Intl.DateTimeFormat('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className="text-gold-gradient">NEXORA ยามอุบากอง AI</h1>
          <p className={styles.date}>{thaiDateFormatter.format(currentDate)} 📅</p>
          <div className={styles.moonPhase}>
            🌙 ข้อมูลจันทรคติวันนี้ (ระบบกำลังคำนวณ)
          </div>
          <div className={styles.time}>
            🕐 เวลาปัจจุบัน {timeFormatter.format(currentDate)} น.
          </div>
        </div>
      </header>

      {currentSlot && (
        <section className={styles.currentAuspice}>
          <h2>ยามขณะนี้</h2>
          <div className={`glass-panel ${styles.auspiceCard} ${styles[currentSlot.auspice]}`}>
            <div className={styles.auspiceStatus}>
              <span className={styles.statusIcon}>{getAuspiceIcon(currentSlot.auspice)}</span>
              <span className={styles.statusText} style={{ color: `var(--color-auspicious-${currentSlot.auspice})` }}>
                {currentSlot.label}
              </span>
            </div>
            <p className={styles.auspiceDesc}>
              {getAuspiceDesc(currentSlot.auspice)}
            </p>
          </div>
        </section>
      )}

      <section className={styles.timelineSection}>
        <h3>ช่วงยามวันนี้</h3>
        <div className={`glass-panel ${styles.timeline}`}>
          {slots.map((slot, index) => (
            <div key={index} className={styles.timelineItem}>
              <span className={styles.timeLabel}>{slot.startTime} - {slot.endTime}</span>
              <span className={styles.timeStatus} style={{ color: `var(--color-auspicious-${slot.auspice})` }}>
                {getAuspiceIcon(slot.auspice)} {slot.label}
              </span>
            </div>
          ))}
        </div>
      </section>
      
      <section className={styles.scoreSection}>
        <div className={`glass-panel ${styles.scoreCard}`}>
          <div className={styles.scoreCircle}>
            <span className={styles.scoreValue}>87</span>
            <span className={styles.scoreMax}>/100</span>
          </div>
          <div className={styles.scoreDetails}>
            <div className={styles.scoreItem}>✈️ เดินทาง 92%</div>
            <div className={styles.scoreItem}>💼 การงาน 88%</div>
            <div className={styles.scoreItem}>💰 การเงิน 81%</div>
            <div className={styles.scoreItem}>❤️ ความสัมพันธ์ 76%</div>
          </div>
        </div>
        <Link href="/ai/assistant" className={styles.askAiButton} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          ✨ ถาม AI ว่าวันนี้ทำอะไรดี
        </Link>
      </section>
    </div>
  );
}
