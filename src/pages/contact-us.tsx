import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { envConfig } from '../utilits/envConfig';

const ContactUsPage = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
     
      const response = await fetch(envConfig.formspreeApiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
        setFormState({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      setSubmitError('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>Suvega | Contact Us</title>
        <meta name="description" content="Get in touch with Suvega - We'd love to hear from you!" />
        <link rel="canonical" href="https://suveganow.com/contact-us" />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
          <p className="mb-6">
            We'd love to hear from you! Whether you have a question about our services, 
            need help with an order, or want to provide feedback, our team is ready to assist you.
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
            <p className="mb-2">
              <span className="font-medium">Email:</span>{' '}
              <a href="mailto:support@suveganow.com" className="text-blue-600 hover:underline">
              suvega.test@gmail.com
              </a>
            </p>
            <p className="mb-2">
              <span className="font-medium">Customer Service:</span>{' '}
              <a href="tel:+919876543210" className="text-blue-600 hover:underline">
                curently unavailable
              </a>
            </p>
            <p className="mb-2">
              <span className="font-medium">Hours:</span> 7:00 AM - 11:00 PM, 7 days a week
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Our Office</h3>
            <p className="mb-1">Suvega Headquarters</p>
            <p className="mb-1">Lakwa, Rajgarh Road, Sivasagar</p>
            <p className="mb-1">Lakwa, Sivasagar (Assam)</p>
            <p>India</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
          
          {submitSuccess ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Thank you for your message! We'll get back to you as soon as possible.
            </div>
          ) : null}
          
          {submitError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {submitError}
            </div>
          ) : null}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                value={formState.subject}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a subject</option>
                <option value="order_inquiry">Order Inquiry</option>
                <option value="product_information">Product Information</option>
                <option value="delivery_issue">Delivery Issue</option>
                <option value="technical_support">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage; 