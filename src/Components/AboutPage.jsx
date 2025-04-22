import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="min-h-screen my-10 bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800 p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6"
      >
        <h1 className="text-4xl font-bold text-blue-600 mb-4">🍔 About King's Food</h1>
        <p className="text-lg leading-relaxed mb-6">
          Welcome to <span className="font-semibold text-blue-500">King's Food</span>, your premier destination for delicious, fast, and convenient meals. Whether you're craving a juicy burger, a cheesy pizza, or a fresh salad, we've got you covered.
        </p>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">👨‍💻 About the Developer</h2>
          <p className="text-md">
            This website was crafted with passion by <span className="font-medium">Firoz Khan</span>. For inquiries or feedback, feel free to reach out at <a href="mailto:firozkhan192006@gmail.com" className="text-blue-600 underline">firozkhan192006@gmail.com</a>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">🎨 Design & Features</h2>
          <p className="text-md">
            King's Food boasts a sleek, user-friendly interface with a cool color scheme that enhances your browsing experience. Our platform is responsive, ensuring seamless access across all devices.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">🚀 Our Mission</h2>
          <p className="text-md">
            At King's Food, we aim to bring your favorite meals to your doorstep with just a few clicks. We prioritize quality, speed, and customer satisfaction in every order.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
