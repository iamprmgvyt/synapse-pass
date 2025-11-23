import Head from 'next/head';
import { useState } from 'react';

// Your Client ID
const CLIENT_ID = "1441620923923824681"; 
// Bot Invite Link (Manage Roles permission is required: 268435456)
const INVITE_BOT_LINK = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=268435456&scope=bot%20applications.commands`;
// Your Support Server Link
const SUPPORT_SERVER_LINK = "https://discord.gg/AmpNdNmMvD";

// --- STYLES (Consistent Dark Mode UI) ---

const baseStyles = { 
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#2f3136', // Discord Dark Mode Background
  color: '#ffffff',
  minHeight: '100vh',
  padding: '50px 20px',
  boxSizing: 'border-box',
  lineHeight: '1.6',
};

const contentContainerStyles = {
  maxWidth: '800px',
  margin: '0 auto',
  textAlign: 'left',
  backgroundColor: '#36393f', // Discord Card Background
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
};

const h1Style = { color: '#5865F2', borderBottom: '2px solid #5865F2', paddingBottom: '10px', marginBottom: '20px' };
const h2Style = { color: '#43b581', marginTop: '30px', marginBottom: '15px' };
const strongStyle = { color: '#ffffff', fontWeight: 'bold' };
const linkStyle = { color: '#5865F2', textDecoration: 'underline' };
const codeStyle = { backgroundColor: '#4f545c', padding: '2px 4px', borderRadius: '3px' };

// --- COMPONENTS ---

// 1. Landing Page Component
const LandingPage = ({ setView }) => (
  <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
    <h1 style={{ fontSize: '3em', color: '#5865F2', marginBottom: '10px' }}>
      🔑 Synapse Pass
    </h1>
    
    <h2 style={{ fontSize: '1.5em', fontWeight: 'normal', color: '#B9BBBE' }}>
      Secure Verification Gateway
    </h2>

    <p style={{ marginTop: '30px', marginBottom: '30px', lineHeight: '1.6' }}>
      Synapse Pass provides a <strong>free, robust, and scalable OAuth2 verification solution</strong> for Discord. 
      It protects your community against <strong>raids and bot spam</strong> and ensures all members are verified through a <strong>seamless, secure process</strong>, powered by <strong>Vercel</strong> and <strong>MongoDB</strong>.
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
          display: 'inline-block',
          transition: 'background-color 0.3s ease'
        }}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4752c4'} // Darker Blurple on hover
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5865F2'}
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
          display: 'inline-block',
          transition: 'border-color 0.3s ease, color 0.3s ease'
        }}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5865F2'; e.currentTarget.style.color = '#5865F2'; }} // Blurple border/text on hover
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#B9BBBE'; e.currentTarget.style.color = '#B9BBBE'; }}
      >
        🤝 Support Server
      </a>
    </div>

    {/* Footer for Home page has links to switch views */}
    <footer style={{ marginTop: '80px', fontSize: '0.8em', color: '#72767D' }}>
      &copy; {new Date().getFullYear()} Synapse Pass. All rights reserved.
      <p style={{ marginTop: '5px' }}>
          <a href="#" onClick={() => setView('privacy')} style={{ color: '#72767D', textDecoration: 'underline', margin: '0 10px' }}>Privacy Policy</a> | 
          <a href="#" onClick={() => setView('tos')} style={{ color: '#72767D', textDecoration: 'underline', margin: '0 10px' }}>Terms of Service</a>
      </p>
    </footer>
  </div>
);

// 2. Privacy Policy Component
const PrivacyContent = ({ setView }) => (
  <div style={contentContainerStyles}>
    <h1 style={h1Style}>Privacy Policy for Synapse Pass</h1>
    <p style={{ color: '#B9BBBE', fontSize: '0.9em' }}>
      **Last updated:** November 23, 2025
    </p>

    <p>
      Synapse Pass is committed to protecting the privacy of its users. This policy describes how we collect, use, and process your personal information through our Verification Bot and Auth Gate service.
    </p>

    <h2 style={h2Style}>1. Information Collected</h2>
    <p>
      Synapse Pass operates as a <strong style={strongStyle}>Secure Authentication Gate</strong> and only collects the minimal information necessary to operate and maintain your server's configuration.
    </p>

    <h3>A. Information Collected via Discord API (OAuth2)</h3>
    <p>
      When a user completes the verification process via Discord OAuth2, we access and temporarily store the following information:
    </p>
    <ul>
      <li><strong style={strongStyle}>Discord User ID:</strong> The unique identifier of the Discord user. Used to identify the member and assign the role upon successful verification.</li>
      <li><strong style={strongStyle}>Discord Guild ID (Server ID):</strong> The unique identifier of the Discord server. Used to store configuration settings specific to that server.</li>
    </ul>

    <h3>B. Information Collected via Slash Commands</h3>
    <p>
      When an Administrator sets up the bot using the <strong style={strongStyle}>/setup-auth</strong> command, we store:
    </p>
    <ul>
      <li><strong style={strongStyle}>Role ID:</strong> The identifier of the role that will be assigned to the user after successful verification.</li>
    </ul>

    <h2 style={h2Style}>2. Purpose of Information Use</h2>
    <p>
      We use the collected information solely for the following purposes:
    </p>
    <ol>
      <li><strong style={strongStyle}>Authentication and Role Assignment (Core Functionality):</strong> Using the User ID, Guild ID, and Role ID to perform the bot's core function: verifying the user and assigning the configured role.</li>
      <li><strong style={strongStyle}>Configuration Storage:</strong> Using the Guild ID and Role ID to securely store the server's security configuration in a MongoDB database.</li>
    </ol>

    <p><strong style={strongStyle}>We DO NOT:</strong></p>
    <ul>
      <li><strong style={strongStyle}>Do not</strong> store passwords, IP addresses, email addresses, or any other personally identifiable information (PII) not required for role assignment.</li>
      <li><strong style={strongStyle}>Do not</strong> share, sell, or rent your user data to any third party.</li>
    </ul>

    <h2 style={h2Style}>3. Data Storage and Security</h2>
    <ul>
      <li><strong style={strongStyle}>Storage:</strong> Server configuration data is securely stored in <strong style={strongStyle}>MongoDB Atlas</strong>, a reliable cloud database service.</li>
      <li><strong style={strongStyle}>Security:</strong> We employ industry-standard security measures (e.g., HTTPS protocol, Discord Interactions signature verification) to protect data from unauthorized access, disclosure, alteration, or destruction.</li>
    </ul>

    <h2 style={h2Style}>4. User Rights</h2>
    <p>
      Due to the nature of the service (only processing Discord IDs), your rights include:
    </p>
    <ul>
      <li><strong style={strongStyle}>Access:</strong> Users may request information about the Guild ID or User ID data that we store.</li>
      <li><strong style={strongStyle}>Erasure:</strong> If the bot is expelled from your server, all related configuration (Guild ID and Role ID) will be deleted from our database upon request.</li>
    </ul>

    <h2 style={h2Style}>5. Contact</h2>
    <p>
      If you have any questions or concerns about this Privacy Policy, please contact us through the following support channels:
    </p>
    <p>
      - <strong style={strongStyle}>Support Server:</strong> <a href={SUPPORT_SERVER_LINK} target="_blank" rel="noopener noreferrer" style={linkStyle}>{SUPPORT_SERVER_LINK}</a><br />
      - <strong style={strongStyle}>Email:</strong> thuvien040281@gmail.com / prmgvyt@gmail.com
    </p>
    <p style={{ marginTop: '30px', textAlign: 'center' }}>
      <a href="#" onClick={() => setView('home')} style={{ ...linkStyle, textDecoration: 'none' }}>
        ← Back to Home
      </a>
    </p>
  </div>
);

// 3. Terms of Service Component
const TOSContent = ({ setView }) => (
  <div style={contentContainerStyles}>
    <h1 style={h1Style}>Terms of Service (TOS) for Synapse Pass</h1>
    <p style={{ color: '#B9BBBE', fontSize: '0.9em' }}>
      **Last updated:** November 23, 2025
    </p>

    <p>
      By inviting and using the Synapse Pass (Bot) service, you agree to these Terms of Service.
    </p>

    <h2 style={h2Style}>1. Agreement to Terms</h2>
    <p>
      You agree that you have read, understood, and agree to be bound by all of these <strong style={strongStyle}>Terms of Service</strong>. If you do not agree with all of these Terms of Service, you are expressly prohibited from using the Bot and must remove it from your server immediately.
    </p>

    <h2 style={h2Style}>2. Use of Service</h2>

    <h3>A. Availability</h3>
    <p>
      Synapse Pass is provided <strong style={strongStyle}>"as-is"</strong> and <strong style={strongStyle}>"as-available"</strong>. We do not guarantee that the service will be uninterrupted, error-free, data-loss-free, or free of viruses at all times. We reserve the right to modify, suspend, or discontinue the service at any time without notice.
    </p>

    <h3>B. Requirements for Operation</h3>
    <p>
      For the Bot to function correctly:
    </p>
    <ol>
      <li>The Bot must have <strong style={strongStyle}>Manage Roles Permission</strong>.</li>
      <li>The Bot's role must be placed <strong style={strongStyle}>HIGHER</strong> than the role it is assigned to grant.</li>
      <li>You must only use the Bot's setup commands (<code style={codeStyle}>/setup-auth</code>) as a Server <strong style={strongStyle}>Administrator</strong>.</li>
    </ol>

    <h3>C. Usage Limits</h3>
    <p>
      You agree not to use the Bot for any activity that is <strong style={strongStyle}>illegal, abusive</strong>, or <strong style={strongStyle}>violates Discord's Terms of Service</strong>.
    </p>

    <h2 style={h2Style}>3. Limitation of Liability</h2>
    <p>
      To the maximum extent permitted by law, in no event shall the developers of Synapse Pass be liable for any <strong style={strongStyle}>indirect, incidental, special</strong>, or <strong style={strongStyle}>punitive damages</strong>, including but not limited to loss of profits, loss of revenue, loss of data, or damages arising from the use or inability to use the service.
    </p>

    <h2 style={h2Style}>4. Indemnification</h2>
    <p>
      You agree to defend, indemnify, and hold the developers of Synapse Pass harmless from any loss, damage, liability, claim, or demand, including reasonable attorneys' fees, due to or arising out of your use of the Bot.
    </p>

    <h2 style={h2Style}>5. Contact</h2>
    <p>
      If you have any questions or concerns about these Terms of Service, please contact us through the following support channels:
    </p>
    <p>
      - <strong style={strongStyle}>Support Server:</strong> <a href={SUPPORT_SERVER_LINK} target="_blank" rel="noopener noreferrer" style={linkStyle}>{SUPPORT_SERVER_LINK}</a><br />
      - <strong style={strongStyle}>Email:</strong> thuvien040281@gmail.com / prmgvyt@gmail.com
    </p>
    <p style={{ marginTop: '30px', textAlign: 'center' }}>
      <a href="#" onClick={() => setView('home')} style={{ ...linkStyle, textDecoration: 'none' }}>
        ← Back to Home
      </a>
    </p>
  </div>
);


// 4. Main App Component
export default function App() {
  // State to track the current view: 'home', 'privacy', or 'tos'
  const [currentView, setCurrentView] = useState('home');

  const renderContent = () => {
    switch (currentView) {
      case 'privacy':
        return <PrivacyContent setView={setCurrentView} />;
      case 'tos':
        return <TOSContent setView={setCurrentView} />;
      case 'home':
      default:
        return <LandingPage setView={setCurrentView} />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'privacy':
        return 'Synapse Pass - Privacy Policy';
      case 'tos':
        return 'Synapse Pass - Terms of Service';
      case 'home':
      default:
        return 'Synapse Pass - Secure Verification Gateway';
    }
  };

  return (
    <div style={baseStyles}>
      <Head>
        <title>{getTitle()}</title>
      </Head>
      {renderContent()}
    </div>
  );
}
