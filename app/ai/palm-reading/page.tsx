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
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Resize image to max 800x800 to save bandwidth and prevent Next.js 4MB payload limit
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 800;
          
          if (width > height && width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          } else if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Get compressed base64
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setImage(dataUrl);
          setResult(null);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
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

      if (!response.ok || !data.overallScore) {
        // Fallback mock if no API key or quota exceeded or any error
        setResult({
          lifeLine: '⚠️ (ระบบจำลองเนื่องจาก AI จริงขัดข้อง): เส้นชีวิตของคุณยาวและชัดเจน บ่งบอกถึงพลังชีวิตที่เปี่ยมล้น',
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
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
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
