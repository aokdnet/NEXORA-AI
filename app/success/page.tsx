'use client';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
      <h1 className="text-gold-gradient" style={{ marginBottom: '16px' }}>ขอบคุณที่ไว้วางใจ NEXORA!</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px', maxWidth: '400px' }}>
        การชำระเงินของคุณสำเร็จแล้ว บัญชีของคุณได้รับการอัปเกรดเรียบร้อย ขอให้ทุกช่วงเวลาของคุณเป็นฤกษ์ที่ดีที่สุดครับ
      </p>
      <Link href="/" style={{
        background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold))',
        color: 'var(--color-bg-navy)',
        padding: '12px 32px',
        borderRadius: '30px',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'inline-block'
      }}>
        กลับสู่หน้าหลัก
      </Link>
    </div>
  );
}
