import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Mail, Phone, MapPin, Send, 
  MessageSquare, HelpCircle, CheckCircle 
} from 'lucide-react';

export default function ContactSupport() {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit
const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus('sending');

  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://event-kqrm.onrender.com' 
      : 'http://localhost:5000';
    await axios.post(`${baseUrl}/api/support`, formData);
    
    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' }); 
  } catch (error) {
    console.error("Error sending message:", error);
    setStatus('error');
  }
};

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-gray-600 hover:text-black font-medium transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">How can we help?</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Have a question about an event? Need help with your booking? 
            Our team is here to assist you 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: Contact Info & FAQ */}
          <div className="space-y-6">
            
            {/* Contact Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-red-600" />
                Contact Info
              </h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 mr-3 text-gray-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Email Us</p>
                    <p>support@eventease.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-5 h-5 mr-3 text-gray-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Call Us</p>
                    <p>+91 98765 43210</p>
                    <p className="text-xs text-gray-400">Mon-Fri, 9am - 6pm</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Office</p>
                    <p>Tech Park, Trivandrum, Kerala</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQ Card */}
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-lg mb-4 flex items-center text-blue-800">
                <HelpCircle className="w-5 h-5 mr-2" />
                Common Questions
              </h3>
              <div className="space-y-3">
                <details className="group cursor-pointer">
                  <summary className="flex items-center font-medium text-blue-900 list-none">
                    <span className="mr-2 group-open:rotate-90 transition-transform">▸</span>
                    How do I cancel a booking?
                  </summary>
                  <p className="text-sm text-blue-800 mt-2 pl-5 leading-relaxed">
                    Go to "My Bookings" and click on the specific event. Cancellation policies vary by organizer.
                  </p>
                </details>
                <details className="group cursor-pointer">
                  <summary className="flex items-center font-medium text-blue-900 list-none">
                    <span className="mr-2 group-open:rotate-90 transition-transform">▸</span>
                    Where is my ticket?
                  </summary>
                  <p className="text-sm text-blue-800 mt-2 pl-5 leading-relaxed">
                    Tickets are emailed to you instantly and are also available in the "My Bookings" section.
                  </p>
                </details>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fadeIn">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                  <p className="text-gray-500 mt-2">We'll get back to you within 24 hours.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-red-600 font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                        placeholder="Regarding booking #1234..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        name="message"
                        required
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white resize-none"
                        placeholder="Tell us how we can help..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {status === 'sending' ? (
                        <span className="animate-pulse">Sending...</span>
                      ) : (
                        <>
                          Send Message <Send className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                    
                    {status === 'error' && (
                       <p className="text-red-500 text-center text-sm font-medium">
                         Something went wrong. Please try again.
                       </p>
                    )}
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}