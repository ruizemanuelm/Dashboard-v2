// ⚠️ PÁGINA DESHABILITADA EN MODO DEMO
// El login ha sido eliminado - la aplicación no requiere autenticación

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import '../globals.css';

export default function LoginPage() {
  const router = useRouter();
  
  // Redirigir automáticamente al dashboard
  useEffect(() => {
    router.push('/');
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #001a19 0%, #002725 60%, #003330 100%)',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '2.5rem 2rem',
        width: '100%',
        maxWidth: 360,
        textAlign: 'center',
        color: '#dfefee'
      }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Modo Demo</h1>
        <p>No se requiere autenticación. Redirigiendo al dashboard...</p>
      </div>
    </div>
  );
}
