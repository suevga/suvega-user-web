import { Helmet } from 'react-helmet-async';

const AboutUsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>Suvega | About Us</title>
        <meta name="description" content="Learn about Suvega - The quick-commerce platform delivering everything under 15 minutes." />
        <link rel="canonical" href="https://suveganow.com/about-us" />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-center">About Suvega</h1>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="mb-4">
          At Suvega, our mission is to redefine convenience by delivering everything you need
          right to your doorstep in under 15 minutes. We believe your time is valuable, and our
          goal is to give you more of it by eliminating the need to go to multiple stores for your
          daily essentials.
        </p>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
        <p className="mb-4">
          Suvega was founded in 2025 with a simple observation: people spend too much time running
          errands and waiting for deliveries. We saw an opportunity to create a platform that could
          deliver groceries, food, electronics, cosmetics, and other essentials quickly and reliably.
        </p>
        <p className="mb-4">
          Starting with just one dark stores in Lakwa,
          across India. Our success is built on our commitment to reliability, speed, and customer satisfaction.
        </p>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">What Makes Us Different</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">15-Minute Delivery</h3>
            <p>
              Our strategically located dark stores and efficient logistics enable us to deliver
              your orders in under 15 minutes, setting a new standard for quick commerce.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Wide Selection</h3>
            <p>
              From groceries and meals to electronics and personal care products, we offer
              thousands of items to meet all your daily needs in one place.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
            <p>
              We work directly with trusted suppliers to ensure that all products meet our
              high standards of quality and freshness.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Passionate Team</h3>
            <p>
              Our diverse team of riders, packers, technologists, and customer service professionals
              work together to make your Suvega experience seamless and delightful.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Our Values</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><span className="font-semibold">Speed:</span> We value your time and strive to deliver with unmatched quickness.</li>
          <li><span className="font-semibold">Reliability:</span> We build trust through consistent, dependable service.</li>
          <li><span className="font-semibold">Accessibility:</span> We aim to make essential products available to everyone, everywhere.</li>
          <li><span className="font-semibold">Innovation:</span> We continuously improve our technology and operations to serve you better.</li>
          <li><span className="font-semibold">Sustainability:</span> We're committed to reducing our environmental impact through eco-friendly practices.</li>
        </ul>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
        <p className="mb-4">
          As we continue to grow, we're always looking for talented individuals who share our vision
          and values. Whether you're a delivery partner, a tech expert, or a customer service professional,
          there's a place for you in our team.
        </p>
        <p className="mb-4">
          We're also constantly expanding to new locations. If Suvega isn't available in your area yet,
          stay tuned — we might be coming to your neighborhood soon!
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
        <p className="mb-4">
          Have questions, suggestions, or feedback? We'd love to hear from you! Visit our{' '}
          <a href="/contact-us" className="text-blue-600 hover:underline">Contact Us</a> page to reach out.
        </p>
      </section>
    </div>
  );
};

export default AboutUsPage; 