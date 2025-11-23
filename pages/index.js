import Head from 'next/head';

// --- Contact Information ---
const SUPPORT_EMAILS = ["thuvien040281@gmail.com", "prmgvyt@gmail.com"];

const PolicySection = ({ title, children, id, className = '' }) => (
  // Updated styles: darker background for contrast, rounded corners, and shadow
  <section 
    id={id} 
    className={`py-16 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 ${className} rounded-xl shadow-2xl`}
  >
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-8 border-b border-indigo-300 dark:border-indigo-700 pb-3">
        {title}
      </h2>
      <div className="space-y-6 text-lg">
        {children}
      </div>
    </div>
  </section>
);

// SVG for the wavy divider effect
const WavyDivider = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 1440 320" 
    className="block dark:hidden"
    style={{ display: 'block' }}
  >
    <path 
      fill="#f9fafb" 
      fillOpacity="1" 
      d="M0,224L60,213.3C120,203,240,181,360,192C480,203,600,245,720,245.3C840,245,960,203,1080,186.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
    ></path>
  </svg>
);

const Home = () => {
  // NOTE: You must replace `[YOUR_CLIENT_ID]` in the Invite Bot link below with your actual Discord Bot Client ID.
  const inviteBotUrl = "https://discord.com/api/oauth2/authorize?client_id=1441620923923824681&permissions=268435456&scope=bot%20applications.commands";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans">
      <Head>
        <title>Synapse Pass - Secure Discord Verification</title>
        <meta name="description" content="Secure OAuth2 verification gate for Discord servers." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation (Sticky Header) */}
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 shadow-lg backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <h1 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-wider">SYNAPSE PASS</h1>
            <div className="space-x-4 flex items-center">
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition duration-300 font-medium">About</a>
              <a href="#tos" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition duration-300 font-medium">Terms</a>
              <a href="#privacy" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition duration-300 font-medium">Privacy</a>
              <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition duration-300 font-medium">Contact</a>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section with Gradient */}
        <section id="about" className="relative text-center py-32 sm:py-40 px-4 sm:px-6 lg:px-8 
                                        bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 
                                        text-white shadow-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-black/50 pointer-events-none"></div> {/* Subtle overlay for depth */}
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-6xl font-extrabold tracking-tight leading-tight">
              Secure Your Community, Effortlessly.
            </h2>
            <p className="mt-6 text-2xl font-light text-indigo-100">
              Synapse Pass is the definitive OAuth2 verification system, designed to eliminate spam and verify every member with Discord's official security flow.
            </p>
            <div className="mt-12 flex justify-center space-x-6">
              <a 
                href={inviteBotUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full shadow-xl 
                           text-indigo-800 bg-white hover:bg-gray-100 transition duration-300 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1m3-4h14" /></svg>
                Invite Bot Now
              </a>
            </div>
          </div>
        </section>
        
        {/* Wavy Divider */}
        <WavyDivider />

        {/* Content Sections Wrapper */}
        <div className="max-w-7xl mx-auto -mt-16 relative z-10 px-4 sm:px-6 lg:px-8 space-y-12 pb-16">

          {/* Terms of Service */}
          <PolicySection id="tos" title="Terms of Service (ToS)" className="mt-0">
            <p>
              **Last Updated: November 23, 2025**
            </p>
            <p>
              Welcome to Synapse Pass, an authentication service provided by Synapse Pass Team. By accessing or using our service, you agree to be bound by these Terms of Service.
            </p>

            <h3 className="text-2xl font-semibold mt-6 text-gray-700 dark:text-gray-100">1. Service Description</h3>
            <p>
              Synapse Pass provides a gateway for Discord server administrators to enforce an OAuth2 verification process on new members. The service's primary function is to authenticate a Discord user's identity and, upon success, assign a pre-configured role in the user's server.
            </p>

            <h3 className="text-2xl font-semibold mt-6 text-gray-700 dark:text-gray-100">2. User Conduct</h3>
            <p>
              You agree not to use the service to:
              <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Circumvent security measures or gain unauthorized access to any Discord account or server.</li>
                  <li>Transmit any harmful or illegal content.</li>
                  <li>Attempt to overload or disrupt the service infrastructure.</li>
              </ul>
            </p>

            <h3 className="text-2xl font-semibold mt-6 text-gray-700 dark:text-gray-100">3. Disclaimer of Warranties</h3>
            <p>
              The service is provided "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee the service will be uninterrupted or error-free.
            </p>

            <h3 className="text-2xl font-semibold mt-6 text-gray-700 dark:text-gray-100">4. Limitation of Liability</h3>
            <p>
              In no event shall the service provider be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability.
            </p>
          </PolicySection>

          {/* Privacy Policy */}
          <PolicySection id="privacy" title="Privacy Policy">
            <p>
              **Last Updated: November 23, 2025**
            </p>
            <p>
              Your privacy is critically important to us. This policy outlines how Synapse Pass collects, uses, and protects your information.
            </p>

            <h3 className="text-2xl font-semibold mt-6 text-gray-700 dark:text-gray-100">1. Information We Collect</h3>
            <p>
              When you use the Synapse Pass OAuth2 verification process, we only collect the minimum information necessary to provide the service:
              <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>**Discord User ID (ID):** Used to identify the member for role assignment.</li>
                  <li>**Discord Guild ID (State):** Used to identify which server configuration and role to apply.</li>
                  <li>**Access Token (Temporary):** Used only during the verification process to fetch your User ID and assign the role, and is immediately discarded.</li>
              </ul>
            </p>

            <h3 className="text-2xl font-semibold mt-6 text-gray-700 dark:text-gray-100">2. How We Use Information</h3>
            <p>
              We use the collected information exclusively for the following purposes:
              <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>To **Assign the Role** as configured by the server administrator.</li>
                  <li>To **Store Server Configuration** (Guild ID and Target Role ID) in our database (MongoDB) for the bot's functionality.</li>
              </ul>
              We **do not** store passwords, private messages, IP addresses, or permanent, personally identifiable information (PII) other than your Discord User ID.
            </p>

            <h3 className="text-2xl font-semibold mt-6 text-gray-700 dark:text-gray-100">3. Data Security</h3>
            <p>
              We implement industry-standard security measures, including HTTPS encryption and secure database practices (MongoDB Atlas), to protect the limited data we collect against unauthorized access or disclosure.
            </p>

            <h3 className="text-2xl font-semibold mt-6 text-gray-700 dark:text-gray-100">4. Data Retention</h3>
            <p>
              We retain server configuration data (Guild ID and Role ID) for as long as the Synapse Pass bot is in your server or until an Administrator manually removes the configuration. **We do not retain Discord Access Tokens** beyond the immediate verification session.
            </p>
          </PolicySection>
        </div>

        {/* Contact Section (Full width, dark background for contrast) */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-black text-white shadow-inner">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold text-white mb-6">Need Support?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Our dedicated team is ready to assist you with setup, bugs, or policy inquiries.
            </p>
            <div className="space-y-4">
              {SUPPORT_EMAILS.map(email => (
                <p key={email} className="text-2xl font-bold text-indigo-400">
                  <span className="text-gray-400">Email:</span> <a href={`mailto:${email}`} className="hover:text-indigo-300 transition duration-300">{email}</a>
                </p>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-gray-400 text-center py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm">&copy; {new Date().getFullYear()} Synapse Pass. All rights reserved.</p>
            <div className="mt-2 text-xs space-x-4">
                <a href="#tos" className="hover:text-white">Terms of Service</a>
                <a href="#privacy" className="hover:text-white">Privacy Policy</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
