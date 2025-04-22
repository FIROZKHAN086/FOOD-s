import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelopeOpenText } from 'react-icons/fa';
import { GiForkKnifeSpoon, GiHotMeal, GiChefToque } from 'react-icons/gi';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-[#fff9f0] text-[#2e2e2e] font-poppins relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <GiHotMeal className="text-4xl text-orange-500" />
            <h3 className="text-3xl font-bold text-green-700">FoodieHub</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Delivering fresh, delicious meals right to your doorstep. Taste the love in every bite 🍴
          </p>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
            <GiForkKnifeSpoon /> Quick Links
          </h4>
          <ul className="space-y-3 text-gray-700">
            {[{titel:"Home",link:'/'}, {titel:"Menu",link:'/menu'},{titel:"Contact",link:'/contact'},{titel:"About",link:'/about'},{titel:"Blog",link:'/'},].map((item, index) => (
              <li key={index}>
                <Link to={item.link} className="hover:text-orange-500 transition-colors duration-200">
                  → {item.titel}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
            <GiChefToque /> Contact Us
          </h4>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-orange-400" />
              99 Gourmet Ave, Foodville
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-orange-400" />
              +1 (800) 123-FOOD
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelopeOpenText className="text-orange-400" />
              firozkhan192006@gmail.com
            </li>
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h4 className="text-lg font-semibold text-green-700 mb-4">🍽️ Join Our Newsletter</h4>
          <p className="text-gray-600 mb-3">Get weekly food tips and hot offers delivered to your inbox!</p>
          <div className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => window.location.href = `mailto:firozkhan192006@gmail.com ${encodeURIComponent('Subject: FoodieHub Newsletter')}`}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-all duration-300"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Bottom */}
      <div className="border-t mx-2  border-gray-200 py-6 mt-8 text-sm text-gray-500 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2025 FoodieHub. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://facebook.com" className="hover:text-blue-600"><FaFacebookF /></a>
            <a href="https://twitter.com" className="hover:text-sky-500"><FaTwitter /></a>
            <a href="https://instagram.com" className="hover:text-pink-500"><FaInstagram /></a>
            <a href="https://linkedin.com" className="hover:text-blue-800"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
