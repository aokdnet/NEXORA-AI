'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function PalmReadingPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setResult(null); // Reset result when new image is uploaded
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: image })
      });

      const data = await response.json();

      if (response.status === 500 && data.error?.includes('API Key')) {
        // Fallback mock if no API key
        setResult({
          lifeLine: '⚠️ ยังไม่ได้ตั้งค่า API Key (Mock): เส้นชีวิตของคุณยาวและชัดเจน บ่งบอกถึงพลังชีวิตที่เปี่ยมล้น',
          headLine: 'เส้นสมองมีความโค้งมนสวยงาม แสดงถึงความคิดสร้างสรรค์',
          heartLine: 'เส้นหัวใจลึกและตรง คุณเป็นคนที่มีความมั่นคงทางอารมณ์',
          fateLine: 'เส้นวาสนาชัดเจนตั้งแต่ฐานมือ',
          overallScore: 92,
          suggestion: 'ช่วงนี้เป็นจังหวะที่ดีในการเริ่มต้นสิ่งใหม่ๆ แนะนำให้ใช้ยามอุบากอง "ฤกษ์ดี" ประกอบการเจรจาธุรกิจ',
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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ai" className={styles.backButton}>← กลับ</Link>
        <h1 className="text-gold-gradient">AI วิเคราะห์ลายมือ</h1>
        <p className={styles.subtitle}>ถ่ายรูปหรืออัปโหลดรูปฝ่ามือของคุณ</p>
      </header>

      <section className={styles.uploadSection}>
        {!image ? (
          <label className={`glass-panel ${styles.uploadBox}`}>
            <span className={styles.uploadIcon}>📸</span>
            <span>แตะเพื่อถ่ายรูปหรือเลือกรูปภาพ</span>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className={styles.fileInput} 
              onChange={handleImageUpload} 
            />
          </label>
        ) : (
          <div className={`glass-panel ${styles.previewBox}`}>
            <img src={image} alt="Palm preview" className={styles.previewImage} />
            <button className={styles.reselectButton} onClick={() => setImage(null)}>
              เลือกรูปใหม่
            </button>
          </div>
        )}
      </section>

      {image && !result && (
        <button 
          className={styles.analyzeButton} 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <span className={styles.loadingText}>✨ AI กำลังวิเคราะห์ลายมือของคุณ...</span>
          ) : (
            '🔮 เริ่มวิเคราะห์'
          )}
        </button>
      )}

      {result && (
        <section className={styles.resultSection}>
          <h2>ผลการวิเคราะห์</h2>
          
          <div className={`glass-panel ${styles.scoreCard}`}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreValue}>{result.overallScore}</span>
              <span className={styles.scoreMax}>/100</span>
            </div>
            <div className={styles.scoreLabel}>คะแนนความมงคลรวม</div>
          </div>

          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <h3>❤️ เส้นชีวิต (Life Line)</h3>
              <p>{result.lifeLine}</p>
            </div>
            <div className={styles.detailItem}>
              <h3>🧠 เส้นสมอง (Head Line)</h3>
              <p>{result.headLine}</p>
            </div>
            <div className={styles.detailItem}>
              <h3>💖 เส้นหัวใจ (Heart Line)</h3>
              <p>{result.heartLine}</p>
            </div>
            <div className={styles.detailItem}>
              <h3>⭐ เส้นวาสนา (Fate Line)</h3>
              <p>{result.fateLine}</p>
            </div>
          </div>

          <div className={`glass-panel ${styles.suggestionBox}`}>
            <h3>💡 คำแนะนำจาก AI</h3>
            <p>{result.suggestion}</p>
          </div>
        </section>
      )}
    </div>
  );
}
