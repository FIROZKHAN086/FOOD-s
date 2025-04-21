import React, { useState ,useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData("")
    
    
  };

  return (
    <div className="min-h-screen my-10 bg-gradient-to-br from-orange-100 via-red-100 to-pink-200 p-6 flex items-center justify-center font-poppins">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <h2 className="text-4xl font-bold text-pink-600 mb-4">Contact Us 🍔</h2>
        <p className="text-gray-600 mb-8">We’d love to hear from you! Reach out with any questions or feedback.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            ></textarea>
            <button
              type="submit"
              href="mailto:firozkhan192006@gmail"
              className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-orange-500 transition-all duration-300"
            >
              Send Message ✉️
            </button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col space-y-6 text-gray-700">
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-pink-500 text-xl" />
              <span>123 Flavor Street, Foodville</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaPhoneAlt className="text-pink-500 text-xl" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-pink-500 text-xl" />
              <span>firozkhan192006@gmail.com</span>
            </div>

            <div className="mt-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
                alt="Contact Illustration"
                className="w-32 h-32 opacity-80"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
