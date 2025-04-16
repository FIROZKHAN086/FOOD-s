import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUtensils } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <FaUtensils className="text-3xl text-pink-400" />
              <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                FoodieHub
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Experience culinary excellence with our handcrafted dishes, bringing global flavors right to your table.
            </p>
          </div>

          {/* Quick Links */}
          <div className="transform hover:translate-x-2 transition-transform duration-300">
            <h4 className="text-white font-bold text-xl mb-6 flex items-center space-x-2">
              <span className="w-8 h-[2px] bg-gradient-to-r from-pink-400 to-purple-400"></span>
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-4 text-gray-300">
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors duration-300 flex items-center space-x-2">
                  <span>→</span>
                  <span>Our Menu</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors duration-300 flex items-center space-x-2">
                  <span>→</span>
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors duration-300 flex items-center space-x-2">
                  <span>→</span>
                  <span>Contact</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors duration-300 flex items-center space-x-2">
                  <span>→</span>
                  <span>Careers</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-xl mb-6 flex items-center space-x-2">
              <span className="w-8 h-[2px] bg-gradient-to-r from-pink-400 to-purple-400"></span>
              <span>Contact Us</span>
            </h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-pink-400" />
                <span>123 Food Street, Cuisine City</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-pink-400" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-pink-400" />
                <span>info@foodiehub.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-xl mb-6 flex items-center space-x-2">
              <span className="w-8 h-[2px] bg-gradient-to-r from-pink-400 to-purple-400"></span>
              <span>Newsletter</span>
            </h4>
            <div className="space-y-4">
              <p className="text-gray-300">Stay updated with our latest offers and dishes!</p>
              <div className="flex flex-col space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="bg-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
                />
                <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-pink-500/25">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              © 2024 FoodieHub. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-400 transition-colors duration-300">
                <FaFacebookF className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-400 transition-colors duration-300">
                <FaTwitter className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-400 transition-colors duration-300">
                <FaInstagram className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-400 transition-colors duration-300">
                <FaLinkedinIn className="text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
