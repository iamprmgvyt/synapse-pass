import Head from 'next/head';

// --- Contact Information ---
const SUPPORT_EMAILS = ["thuvien040281@gmail.com", "prmgvyt@gmail.com"];

const PolicySection = ({ title, children, id }) => (
  // Using Tailwind dark mode styles for a professional look
  <section id={id} className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-indigo-600 mb-8 border-b border-indigo-300 pb-3">
        {title}
      </h2>
      <div className="space-y-6 text-lg">
        {children}
      </div>
    </div>
  </section>
);

const Home = () => {
  // NOTE: You must replace `[YOUR_CLIENT_ID]` in the Invite Bot link below with your actual Discord Bot Client ID.
  const inviteBotUrl = "https://discord.com/api/oauth2/authorize?client_id=1441620923923824681&permissions=268435456&scope=bot%20applications.commands";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Synapse Pass - Secure Discord Verification</title>
        <meta name="description" content="Secure OAuth2 verification gate for Discord servers." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation (Sticky Header) */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 shadow backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-indigo-600">Synapse Pass</h1>
            <div className="space-x-4">
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition duration-150">About</a>
              <a href="#tos" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition duration-150">Terms</a>
              <a href="#privacy" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition duration-150">Privacy</a>
              <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition duration-150">Contact</a>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section id="about" className="text-center py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-extrabold text-indigo-500 sm:text-6xl">
              Secure Your Community with Synapse Pass
            </h2>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
              The professional OAuth2 verification gate for Discord. Fast, secure, and fully compliant.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <a 
                href={inviteBotUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150"
              >
                Invite Bot
              </a>
              <a 
                href="#tos" 
                className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
              >
                Read Policies
              </a>
            </div>
          </div>
        </section>

        {/* Terms of Service */}
        <PolicySection id="tos" title="Terms of Service (ToS)">
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

        {/* Contact Section */}
        <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">Contact Us</h2>
            <p className="text-xl text-gray-300 mb-8">
              If you have any questions regarding these policies or the service, please contact our support team.
            </p>
            <div className="space-y-2">
              {SUPPORT_EMAILS.map(email => (
                <p key={email} className="text-lg font-medium text-indigo-400">
                  Support Email: <a href={`mailto:${email}`} className="hover:underline">{email}</a>
                </p>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-gray-400 text-center py-4">
        <p>&copy; {new Date().getFullYear()} Synapse Pass. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
