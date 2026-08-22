'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: React.ReactNode;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'สวัสดีครับ ✨ ผมคือ AI ประจำ NEXORA ยามอุบากอง วันนี้มีเรื่องฤกษ์ยาม การเดินทาง หรืองานสำคัญอะไรให้ผมช่วยแนะนำไหมครับ?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages
            .filter(m => m.id !== 'welcome')
            .map(m => ({ role: m.role, content: m.content }))
            .concat([{ role: 'user', content: currentInput }])
        })
      });

      const data = await response.json();

      let aiContent: React.ReactNode = data.content;

      // Check if API key is missing
      if (response.status === 500 && data.error?.includes('API Key')) {
        aiContent = `⚠️ ข้อผิดพลาด: ยังไม่ได้ตั้งค่า OpenAI API Key ในระบบ (กรุณาเพิ่มในไฟล์ .env.local)\n\nแต่ถ้านี่เป็นระบบจำลอง (Mock) จะให้คำแนะนำดังนี้ครับ: จากข้อมูลที่คุณให้มา ผมได้วิเคราะห์ร่วมกับตำราอุบากองและพื้นดวงของคุณแล้ว ถือว่าเป็นช่วงเวลาที่เหมาะสมครับ`;
      }

      // Easter egg for mockup match (keep for presentation purposes)
      if (currentInput.includes('โคราช')) {
        aiContent = (
          <div className={styles.mockRecommendation}>
            <p>จากการวิเคราะห์ยามอุบากอง AI แนะนำเวลาออกเดินทางที่เหมาะสมที่สุดครับ (ระบบจำลอง)</p>
            <div className={styles.recommendationCard}>
              <div className={styles.recommendationHeader}>
                <strong>ออกเดินทาง</strong>
                <span className={styles.recommendationTime}>06:20 - 07:50 น.</span>
              </div>
              <p className={styles.recommendationDesc}>ยามดี เดินทางราบรื่น ปลอดภัย</p>
              <div className={styles.confidenceBar}>
                <div className={styles.confidenceFill} style={{ width: '89%' }}></div>
              </div>
              <div className={styles.confidenceText}>ความมั่นใจ 89/100</div>
            </div>
            <p>เป็นช่วงเวลาที่พลังงานเกื้อหนุน การเดินทางราบรื่น ปลอดภัย และถึงจุดหมายปลายทางตามแผน</p>
            <div className={styles.actionButtons}>
              <button className={styles.actionBtn}>📅 เพิ่มลงปฏิทิน</button>
              <button className={styles.actionBtnOutline}>🔔 ตั้งเตือน</button>
            </div>
          </div>
        );
      }

      const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: aiContent };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'ขออภัยครับ ไม่สามารถเชื่อมต่อกับ AI ได้ในขณะนี้' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ai" className={styles.backButton}>← กลับ</Link>
        <h1 className="text-gold-gradient">AI Assistant</h1>
        <button className={styles.historyButton}>⏱️</button>
      </header>

      <div className={styles.chatContainer}>
        <div className={styles.messageList}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.wrapperUser : styles.wrapperAssistant}`}>
              {msg.role === 'assistant' && (
                <div className={styles.avatar}>
                  <div className={styles.avatarLogo}>N</div>
                </div>
              )}
              <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className={`${styles.messageWrapper} ${styles.wrapperAssistant}`}>
               <div className={styles.avatar}>
                  <div className={styles.avatarLogo}>N</div>
                </div>
                <div className={`${styles.messageBubble} ${styles.bubbleAssistant}`}>
                  <span className={styles.typingDot}>.</span>
                  <span className={styles.typingDot}>.</span>
                  <span className={styles.typingDot}>.</span>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.suggestionsWrapper}>
          <p className={styles.suggestionTitle}>คุณอาจสนใจ</p>
          <div className={styles.suggestions}>
            <button className={styles.suggestionBadge}>💼 เริ่มงาน</button>
            <button className={styles.suggestionBadge}>🤝 พบลูกค้า</button>
            <button className={styles.suggestionBadge}>✈️ เดินทาง</button>
          </div>
        </div>

        <form className={styles.inputArea} onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="พิมพ์คำถามของคุณ..." 
            className={styles.textInput}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="button" className={styles.micButton}>🎙️</button>
          <button type="submit" className={styles.sendButton} disabled={!input.trim()}>➤</button>
        </form>
      </div>
    </div>
  );
}
