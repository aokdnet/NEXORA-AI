'use client';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="app-container" style={{ padding: '20px', textAlign: 'center' }}>กำลังโหลด...</div>;
  }

  return (
    <div className="app-container" style={{ padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '24px' }}>โปรไฟล์ของฉัน</h1>

      {session ? (
        <>
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-gold), #8B6508)',
              margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', overflow: 'hidden'
            }}>
              {session.user?.image ? (
                <img src={session.user.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                "👤"
              )}
            </div>
            <h2 style={{ color: 'var(--color-gold-light)', marginBottom: '8px' }}>{session.user?.name}</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>สถานะ: <strong style={{ color: 'white' }}>NEXORA Basic</strong></p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-gold)', marginBottom: '12px' }}>อัปเกรดบัญชี (NEXORA PRO)</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '16px', color: 'var(--color-text-muted)' }}>
              ปลดล็อกฟีเจอร์ AI แบบไม่จำกัด และรับสิทธิพิเศษมากมาย
            </p>
            <Link href="/pricing" style={{
              display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold))',
              color: 'var(--color-bg-navy)', padding: '12px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none'
            }}>
              ดูแพ็กเกจทั้งหมด 💎
            </Link>
          </div>

          <button onClick={() => signOut()} style={{
            background: 'rgba(255, 60, 60, 0.2)', border: '1px solid rgba(255, 60, 60, 0.5)', color: '#ff6b6b',
            padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', cursor: 'pointer'
          }}>
            ออกจากระบบ
          </button>
        </>
      ) : (
        <div className="glass-panel" style={{ padding: '30px 20px', textAlign: 'center', marginTop: '20px' }}>
          <h2 style={{ color: 'white', marginBottom: '16px' }}>เข้าสู่ระบบเพื่อบันทึกข้อมูลดวงชะตา</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
            เมื่อเข้าสู่ระบบ คุณจะไม่ต้องกรอกวันเกิดซ้ำ และสามารถซิงค์สถานะ Premium ของคุณได้
          </p>
          <button onClick={() => signIn('credentials', { callbackUrl: '/profile' })} style={{
            background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold))',
            color: 'var(--color-bg-navy)', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', border: 'none', cursor: 'pointer'
          }}>
            เข้าสู่ระบบจำลอง (Mock Login)
          </button>
        </div>
      )}

      <footer style={{ marginTop: 'auto', padding: '20px 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0, 0, 0, 0.3)',
          padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Developed by</span>
          <img 
            src="/developer.png" 
            alt="Narong Preedarat" 
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-gold)' }} 
          />
          <strong style={{ fontSize: '0.9rem', color: 'var(--color-gold-light)' }}>Narong Preedarat</strong>
        </div>
      </footer>
    </div>
  );
}
