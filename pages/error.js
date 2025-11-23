// pages/error.js
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ErrorPage() {
  const router = useRouter();
  // Lấy thông báo lỗi từ URL query
  const { message } = router.query; 

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#2f3136',
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      <Head>
        <title>Verification Failed | Synapse Pass</title>
      </Head>
      <img 
        src="https://img.icons8.com/color/96/000000/cancel--v1.png" 
        alt="Error X Mark" 
        style={{ width: '80px', height: '80px', marginBottom: '20px' }}
      />
      <h1 style={{ color: '#ff7777' }}>❌ Verification Failed!</h1>
      <p style={{ fontSize: '1.2em', marginBottom: '30px' }}>
        An error occurred during the verification process.
      </p>
      {message && (
        <div style={{ 
          backgroundColor: '#36393f', 
          padding: '15px', 
          borderRadius: '5px', 
          maxWidth: '500px', 
          margin: '0 auto', 
          wordBreak: 'break-word' 
        }}>
          <strong>Details:</strong> {decodeURIComponent(message)}
        </div>
      )}
      <p style={{ marginTop: '20px' }}>
        If this persists, please contact the server administrator.
      </p>
    </div>
  );
}