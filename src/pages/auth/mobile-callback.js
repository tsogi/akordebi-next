import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function MobileCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('მიმდინარეობს გადამისამართება...');

  useEffect(() => {
    // Get the hash fragment from the URL (Supabase puts tokens there)
    const hash = window.location.hash;
    
    if (hash) {
      // Redirect to mobile app with the tokens
      const appUrl = `akordebi://auth/callback${hash}`;
      
      console.log('Redirecting to:', appUrl);
      
      // Try to open the app
      window.location.href = appUrl;
      
      // After a short delay, show success message
      setTimeout(() => {
        setStatus('ავტორიზაცია წარმატებით დასრულდა! შეგიძლიათ დაბრუნდეთ აპლიკაციაში.');
      }, 1000);
    } else {
      setStatus('შეცდომა: ტოკენები ვერ მოიძებნა');
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px',
      textAlign: 'center',
    }}>
      <h1 style={{ marginBottom: '20px' }}>აკორდები</h1>
      <p>{status}</p>
      <p style={{ marginTop: '30px', color: '#9ca3af', fontSize: '14px' }}>
        თუ აპლიკაცია ავტომატურად არ გაიხსნა, დახურეთ ეს ფანჯარა და დაბრუნდით აპლიკაციაში.
      </p>
    </div>
  );
}
