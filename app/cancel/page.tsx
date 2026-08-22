'use client';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>❌</div>
      <h1 style={{ color: 'white', marginBottom: '16px' }}>การชำระเงินถูกยกเลิก</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px', maxWidth: '400px' }}>
        คุณได้ยกเลิกการทำรายการชำระเงิน หากคุณเปลี่ยนใจหรือพบปัญหาใดๆ สามารถลองใหม่อีกครั้งได้เสมอครับ
      </p>
      <Link href="/pricing" style={{
        background: 'rgba(255,255,255,0.1)',
        color: 'white',
        padding: '12px 32px',
        borderRadius: '30px',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'inline-block',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        กลับไปหน้าแพ็กเกจ
      </Link>
    </div>
  );
}
