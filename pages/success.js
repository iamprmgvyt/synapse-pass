// pages/success.js
import Head from 'next/head';

export default function SuccessPage() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#2f3136', // Discord Dark Mode BG
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      <Head>
        <title>Verification Success | Synapse Pass</title>
      </Head>
      <img 
        src="https://img.icons8.com/color/96/000000/ok--v1.png" 
        alt="Success Checkmark" 
        style={{ width: '80px', height: '80px', marginBottom: '20px' }}
      />
      <h1>✅ Verification Complete!</h1>
      <p style={{ fontSize: '1.2em' }}>
        You have successfully verified your identity. You should now have the required role in your Discord server.
      </p>
      <p style={{ marginTop: '30px' }}>
        You can close this window now.
      </p>
      <a 
        href="https://discord.com/app" 
        style={{ color: '#7289da', textDecoration: 'none', fontWeight: 'bold' }}
      >
        Return to Discord
      </a>
    </div>
  );
}