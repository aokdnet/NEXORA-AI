'use client';

import { useState, useEffect } from 'react';
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

  const [events, setEvents] = useState<Record<number, Array<{id: string, title: string, location: string, time: string}>>>({
    21: [{ id: '1', title: 'พบลูกค้าสำคัญ', location: 'ห้องประชุม ชั้น 12', time: '14:00' }]
  });
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '09:00', location: '' });

  const [syncSuccess, setSyncSuccess] = useState(false);

  // Load events from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nexora_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nexora_events', JSON.stringify(events));
  }, [events]);

  const getDayClass = (day: number) => {
    if (day === selectedDate) return styles.selectedDay;
    const type = mockDayData[day]?.type;
    if (type === 'good') return styles.goodDay;
    if (type === 'bad') return styles.badDay;
    if (type === 'neutral') return styles.neutralDay;
    return styles.normalDay;
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !newEvent.title) return;
    
    setEvents(prev => {
      const dayEvents = prev[selectedDate] || [];
      return {
        ...prev,
        [selectedDate]: [...dayEvents, { ...newEvent, id: Date.now().toString() }]
      };
    });
    
    setShowModal(false);
    setNewEvent({ title: '', time: '09:00', location: '' });
  };

  const handleSync = () => {
    // Generate .ics file content
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//NEXORA AI//TH\n';
    
    const year = 2026;
    const month = '08'; // August
    
    const formatDate = (day: number, timeStr: string) => {
      const d = day.toString().padStart(2, '0');
      const time = timeStr.replace(':', '') + '00';
      return `${year}${month}${d}T${time}`;
    };

    Object.entries(events).forEach(([day, dayEvents]) => {
      dayEvents.forEach(evt => {
        icsContent += 'BEGIN:VEVENT\n';
        icsContent += `DTSTART;TZID=Asia/Bangkok:${formatDate(parseInt(day), evt.time)}\n`;
        const endHour = (parseInt(evt.time.split(':')[0]) + 1).toString().padStart(2, '0');
        const endMin = evt.time.split(':')[1];
        icsContent += `DTEND;TZID=Asia/Bangkok:${formatDate(parseInt(day), endHour + ':' + endMin)}\n`;
        icsContent += `SUMMARY:${evt.title}\n`;
        if (evt.location) icsContent += `LOCATION:${evt.location}\n`;
        icsContent += 'END:VEVENT\n';
      });
    });
    
    icsContent += 'END:VCALENDAR';
    
    // Create and download blob
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'nexora-calendar.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success toast
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3000);
  };

  const currentEvents = selectedDate ? (events[selectedDate] || []) : [];

  return (
    <div className={styles.page}>
      {syncSuccess && (
        <div className={styles.toastOverlay}>
          <div className={styles.toastMessage}>
            ✅ ซิงก์ปฏิทินสำเร็จแล้ว!
          </div>
        </div>
      )}
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
              {(mockDayData[day] || events[day]) && <span className={styles.dot}></span>}
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
        {selectedDate && currentEvents.length > 0 ? (
          <div className={styles.eventList}>
            <h3 className={styles.eventDateTitle}>{selectedDate} สิงหาคม 2569</h3>
            
            {currentEvents.map(evt => (
              <div key={evt.id} className={`glass-panel ${styles.eventCard}`}>
                <div className={styles.eventTime}>{evt.time}</div>
                <div className={styles.eventDetails}>
                  <h4>{evt.title}</h4>
                  <p>{evt.location || 'ไม่มีสถานที่'}</p>
                </div>
                <button className={styles.chevron}>›</button>
              </div>
            ))}
            
            <div className={styles.aiAdvice}>
              <span className={styles.aiIcon}>✨</span>
              <div className={styles.aiAdviceText}>
                <strong>AI แนะนำ</strong>
                <p>ช่วง 13:13-15:36 เหมาะสำหรับการเจรจาและการเริ่มต้นใหม่</p>
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
              <button className={styles.addEventBtn} onClick={() => setShowModal(true)}>+ เพิ่มกิจกรรม</button>
              <button className={styles.syncBtn} onClick={handleSync}>📅 ซิงก์ ปฏิทิน</button>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>ยังไม่มีกิจกรรมในวันที่ {selectedDate}</p>
            <button className={styles.addEventBtn} onClick={() => setShowModal(true)}>+ เพิ่มกิจกรรมใหม่</button>
            <button className={styles.syncBtn} onClick={handleSync} style={{marginTop: '12px'}}>📅 ซิงก์ ปฏิทิน</button>
          </div>
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={`glass-panel ${styles.modalContent}`}>
            <h3>เพิ่มกิจกรรมใหม่</h3>
            <form onSubmit={handleAddEvent} className={styles.modalForm}>
              <input 
                type="text" 
                placeholder="ชื่องาน/กิจกรรม" 
                value={newEvent.title}
                onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                required
                className={styles.modalInput}
              />
              <input 
                type="time" 
                value={newEvent.time}
                onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                required
                className={styles.modalInput}
              />
              <input 
                type="text" 
                placeholder="สถานที่ (ตัวเลือก)" 
                value={newEvent.location}
                onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                className={styles.modalInput}
              />
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>ยกเลิก</button>
                <button type="submit" className={styles.saveBtn}>บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
