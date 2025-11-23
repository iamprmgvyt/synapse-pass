// pages/index.js
import Head from 'next/head';

export default function HomePage() {
  // Client ID của bạn đã được cập nhật
  const CLIENT_ID = "1441620923923824681"; 
  
  // Scope cần thiết: bot (để bot tham gia) và applications.commands (để dùng Slash Command)
  // Permissions: 268435456 (Quyền Manage Roles - Quan trọng nhất cho Auth Gate)
  const INVITE_BOT_LINK = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=268435456&scope=bot%20applications.commands`;
  
  // Link Support Server của bạn
  const SUPPORT_SERVER_LINK = "https://discord.gg/AmpNdNmMvD";

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px 20px', 
      fontFamily: 'Arial, sans-serif',
      // Màu nền: Discord Dark Mode
      backgroundColor: '#2f3136', 
      color: '#ffffff',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      <Head>
        <title>Synapse Pass - Secure Verification Gateway</title>
        <meta name="description" content="Synapse Pass is a free, secure, and scalable OAuth2 verification bot for Discord servers." />
      </Head>

      <h1 style={{ 
        fontSize: '3em', 
        color: '#5865F2', // Màu Blurple của Discord
        marginBottom: '10px' 
      }}>
        🔑 Synapse Pass
      </h1>
      
      <h2 style={{ fontSize: '1.5em', fontWeight: 'normal', color: '#B9BBBE' }}>
        Secure Verification Gateway
      </h2>

      <p style={{ marginTop: '30px', maxWidth: '600px', margin: '30px auto', lineHeight: '1.6' }}>
        Synapse Pass provides a free, robust, and scalable **OAuth2 verification solution** for Discord. 
        It protects your community against raids and ensures all members are verified through a seamless, secure process, powered by **Vercel** and **MongoDB**.
      </p>

      <div style={{ marginTop: '40px' }}>
        <a 
          href={INVITE_BOT_LINK} 
          style={{ 
            backgroundColor: '#5865F2', 
            color: 'white', 
            padding: '12px 25px', 
            borderRadius: '5px', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            margin: '0 10px',
            display: 'inline-block'
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          ➕ Invite Bot
        </a>
        
        <a 
          href={SUPPORT_SERVER_LINK} 
          style={{ 
            backgroundColor: 'transparent', 
            color: '#B9BBBE', 
            border: '2px solid #B9BBBE',
            padding: '10px 25px', 
            borderRadius: '5px', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            marginLeft: '10px',
            display: 'inline-block'
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          🤝 Support Server
        </a>
      </div>

      <footer style={{ marginTop: '80px', fontSize: '0.8em', color: '#72767D' }}>
        &copy; {new Date().getFullYear()} Synapse Pass. All rights reserved.
        <p style={{ marginTop: '5px' }}>
            <a href={SUPPORT_SERVER_LINK} style={{ color: '#72767D', textDecoration: 'underline' }}>Privacy Policy</a> | 
            <a href={SUPPORT_SERVER_LINK} style={{ color: '#72767D', textDecoration: 'underline' }}>Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}
