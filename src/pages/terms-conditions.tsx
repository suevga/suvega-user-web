import { Helmet } from 'react-helmet-async';

const TermsConditionsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>Suvega | Terms and Conditions</title>
        <meta name="description" content="Terms and Conditions for using the Suvega platform." />
        <link rel="canonical" href="https://suveganow.com/terms-conditions" />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Introduction</h2>
        <p className='text-sm text-gray-600 mb-4'>Effective Date: 13.05.2025</p>
        <p className="mb-4">
          Welcome to Suvega. These Terms and Conditions ("Terms") govern your use of the Suvega mobile application (“App”) and all related services provided by DRLOVE (“we”, “our”, or “us”).

          By downloading, accessing, or using the Suvega app, you agree to be bound by these Terms. If you do not agree, please do not use the app.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Use of the App</h2>
        <p className="mb-4">
          You may use the app solely for your personal or commercial use to request or manage delivery services. You agree to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Be at least 18 years old</li>
          <li className="mb-2">Register for an account with accurate information</li>
          <li className="mb-2">Maintain the security of your account credentials</li>
          <li className="mb-2">Accept responsibility for all activities under your account</li>
        </ul>
      </section>


      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">User Accounts and Authentication</h2>
        <p className="mb-4">
          You must create an account and log in using our secure authentication provider (Clerk) to access certain features of the app. You are responsible for:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Maintaining the confidentiality of your credentials</li>
          <li className="mb-2">All activities that occur under your account</li>
        </ul>
        <p>We reserve the right to suspend or terminate accounts for any misuse or suspicious activity.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Data Collection and Privacy</h2>
        <p className="mb-4">
        Your privacy is important to us. By using Suvega, you consent to the collection and use of your information as described in our <a href="/privacy-policy" className='text-blue-600 hover:underline'>Privacy Policy</a>.
        </p>
        <p className='mb-4'>The app may collect:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Location data</li>
          <li className="mb-2">Device identifiers</li>
          <li className="mb-2">Usage statistics</li>
        </ul>
        <p className='mb-4'>We do not sell or misuse your personal data.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
        <p className="mb-4">
        All content, design, logos, text, and software associated with Suvega are the property of DRLOVE or its licensors and are protected by applicable intellectual property laws.
        </p>
        <br/>
        <p className='mb-4'>You may not copy, modify, distribute, or reproduce any part of the app without written permission.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Limitations of Liability</h2>
        <p className="mb-4">
          To the maximum extent permitted by law, Suvega and DRLOVE are not liable for:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Any indirect or consequential losses</li>
          <li className='mb-2'>Delivery delays or service disruptions</li>
          <li className='mb-2'>Data loss or unauthorized access due to factors beyond our control</li>
        </ul>
        <br/>
        <p className='mb-4'>The app is provided "as is" without any warranties of any kind, either express or implied.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4"> Third-Party Services</h2>
        <p className="mb-4">
        Suvega may integrate with third-party services (e.g., Google Maps, Clerk authentication, etc.). We are not responsible for the content, policies, or practices of those third-party services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Termination</h2>
        <p className="mb-4">
        We may suspend or terminate your access to Suvega at any time, without notice, for conduct that violates these Terms or is otherwise harmful to other users or us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Changes to These Terms</h2>
        <p className="mb-4">
        We reserve the right to update or modify these Terms at any time. We will notify users of significant changes through the app or by updating the "Effective Date" above.
        </p>
        <p className='mb-4'>Continued use of the app after changes indicates your acceptance of the updated Terms.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
        <p className="mb-4">
        These Terms are governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
        </p>
        <p className='mb-4'>Continued use of the app after changes indicates your acceptance of the updated Terms.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Orders and Payments</h2>
        <p className="mb-4">
          When placing an order through Suvega:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">You agree to pay all charges at the prices listed at the time of your order</li>
          <li className="mb-2">Prices and availability of products are subject to change without notice</li>
          <li className="mb-2">We reserve the right to refuse or cancel any order for any reason</li>
          <li className="mb-2">Delivery times are estimates and may vary based on factors outside our control</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Delivery Areas</h2>
        <p className="mb-4">
          Our services are available only in select locations. Deliverability is subject to our service area
          coverage, which may change from time to time without prior notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Product Information</h2>
        <p className="mb-4">
          We make every effort to display as accurately as possible the colors, features, specifications, and details
          of the products available on our platform. However, we cannot guarantee that your device's display of any
          color, texture, or detail of the product will be accurate, and we do not warrant that the service
          descriptions are accurate, complete, reliable, current, or error-free.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">User Conduct</h2>
        <p className="mb-4">
          You agree not to use our platform to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Violate any applicable laws or regulations</li>
          <li className="mb-2">Infringe upon the rights of others</li>
          <li className="mb-2">Submit false or misleading information</li>
          <li className="mb-2">Engage in any activity that interferes with or disrupts our services</li>
        </ul>
      </section>


      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify these Terms at any time. Your continued use of the platform after such
          changes constitutes your acceptance of the new Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at:
          <br />
          <a href="mailto:suvega.test@gmail.com" className="text-blue-600 hover:underline">suvega.test@gmail.com</a>
        </p>
      </section>

      <p className="text-sm text-gray-600">Last Updated: 13th May 2025</p>
    </div>
  );
};

export default TermsConditionsPage; 