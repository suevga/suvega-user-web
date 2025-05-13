import { Helmet } from 'react-helmet-async';

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>Suvega | Privacy Policy</title>
        <meta name="description" content="Privacy Policy for Suvega - Learn how we protect your personal information." />
        <link rel="canonical" href="https://suveganow.com/privacy-policy" />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Introduction</h2>
        <p className='text-sm text-gray-600 mb-4'>Effective Date: 13.05.2025</p>
        <p className="mb-4">
          Thank you for using Suvega, we respect your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application ("Suvega") and associated services.
        </p>
        <p className="mb-4">
          Please read this Privacy Policy carefully. If you do not agree with the terms of this 
          Privacy Policy, please do not access the platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
        <p className="mb-4">We may collect the following types of data to operate and improve the app:</p>
        <ul className="list-disc pl-6 mb-4">
          <h2 className='text-lg font-bold mb-2 underline'>Device Information</h2>
          <div>
            <li>Device model</li>
            <li>Operating system</li>
            <li>Device or other identifiers (e.g. Android ID, BSSID)</li>
          </div>
          <h2 className='text-lg font-bold my-2 underline'>Location Data</h2>
          <div>
            <li>GPS and network-based location data (with your permission)</li>
            <li>Used to enable delivery tracking and map functionality</li>
          </div>
          <h2 className='text-lg font-bold my-2 underline'>Usage Data</h2>
          <div>
            <li>Interactions within the app</li>
            <li>Timestamps and logs</li>
            <li>Error or crash data</li>
          </div>
          <h2 className='text-lg font-bold my-2 underline'>Authentication Data</h2>
          <div>
            <li>User ID and session token via Clerk authentication service</li>
          </div>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
        <p className="mb-4">We use the collected information for the following purposes:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">To provide and operate our delivery services</li>
          <li className="mb-2">To authenticate and manage user sessions</li>
          <li className="mb-2">To analyze app usage for internal insights</li>
          <li className="mb-2">Provide customer support</li>
          <li className="mb-2">Improve our services and develop new features</li>
          <li className="mb-2">Send you updates, promotions, and marketing communications</li>
          <li className="mb-2">Maintain the security of our platform</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Data Sharing and Disclosure</h2>
        <p className="mb-4">
          We do not sell or share your personal information with third parties for advertising or marketing. Your data is only shared:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">With third-party services we use (e.g., Clerk for authentication, Expo platform for app infrastructure)</li>
          <li className="mb-2">As required by law or legal process</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
        <p className="mb-4">
          We retain collected data only as long as necessary to fulfill the purposes outlined in this policy, or as required by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Data Security</h2>
        <p className="mb-4">
          We implement reasonable administrative, technical, and physical security measures to protect your data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">User Rights and Control</h2>
        <p className='mb-4'>You have the right to:</p>
        <ul className="mb-4">
          <li>Request access to your data</li>
          <li>Request correction or deletion of your data</li>
          <li>Withdraw consent by uninstalling the app or contacting us directly</li>
        </ul>
        <p>To make a request, email us at <a href="mailto:suvega.test@gmail.com" className="text-blue-600 hover:underline">suvega.test@gmail.com</a>.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Children’s Privacy</h2>
        <p className='mb-4'>Suvega is not intended for use by children under the age of 13. We do not knowingly collect data from children.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Changes will be posted on this page with a new effective date.
          by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
          <br />
          <a href="mailto:suvega.test@gmail.com" className="text-blue-600 hover:underline">suvega.test@gmail.com</a>
        </p>
      </section>

      <p className="text-sm text-gray-600">Last Updated: 13th May 2025</p>
    </div>
  );
};

export default PrivacyPolicyPage; 