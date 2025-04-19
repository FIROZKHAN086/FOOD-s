import React from "react";
import { motion } from "framer-motion";  // Import Framer Motion for animations
import { FaArrowDown } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="top-8 left-0 mt-12 w-screen h-screen bg-white  md:fixed mb-[75%]  md:mb-10 py-7 px-6 lg:px-20 flex flex-col lg:flex-row items-center justify-between">
      {/* Left Text Section */}
      <motion.div 
        className="max-w-xl font-poppins space-y-6 text-center lg:text-left"
        initial={{ opacity: 0, x: -100 }} // Initial state: hidden and slightly off-screen
        animate={{ opacity: 1, x: 0 }}  // Animate to fully visible and in position
        transition={{ duration: 1, type: "spring", stiffness: 120 }}
      >
        <motion.p 
          className="text-sm text-yellow-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Halal Products <span className="text-red-600">Online Delivery Shop</span>
        </motion.p>

        <motion.h1 
          className="text-4xl lg:text-5xl font-bold leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Make Healthy <br /> Life With{" "}
          <span className="text-green-700">Fresh</span> Grocery
        </motion.h1>

        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          This year, our new summer collection will shelter you from the harsh elements
          of a world that’s constantly changing.
        </motion.p>

        <motion.button
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded font-semibold"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}  // Hover effect to scale button slightly
          transition={{ type: "spring", stiffness: 300 }}
        >
          Shop Now
        </motion.button>
        <motion.button
          className="bg-[#fff] hover:bg-black hover:text-white   flex items-center gap-2 text-black px-6 py-3 rounded font-semibold"
          initial={{ scale: 1 }}
          animate={{ 
            scale: [1, 1.1, 1],
            transition: {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          Explore More <FaArrowDown/>
        </motion.button>

        {/* Bottom Avatars Section */}
        <motion.div 
          className="flex items-center gap-4 pt-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="flex -space-x-2 overflow-hidden">
            <motion.img 
              className="w-10 h-10 rounded-full border-2 border-white"
              src="https://i.pravatar.cc/40?img=1" 
              alt="User Avatar 1"
              whileHover={{ scale: 1.2 }} // Hover effect for avatar image
              transition={{ duration: 0.3 }}
            />
            <motion.img 
              className="w-10 h-10 rounded-full border-2 border-white"
              src="https://i.pravatar.cc/40?img=2" 
              alt="User Avatar 2"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
            <motion.img 
              className="w-10 h-10 rounded-full border-2 border-white"
              src="https://i.pravatar.cc/40?img=3" 
              alt="User Avatar 3"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-gray-800">
            PioMart – <span className="text-green-700 font-semibold">Satisfied Around the Worldwide</span>
          </p>
        </motion.div>
      </motion.div>

      {/* Right Image Section */}
      <motion.div
        className="relative mt-10 lg:mt-0"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="bg-green-800 w-full lg:w-[420px] h-[400px] rounded-lg overflow-hidden relative">
          <motion.img
            src="https://img.freepik.com/premium-photo/3d-illustration-old-farmer-his-vegetable-garden_1057-127543.jpg?w=740"
            alt="Grocery Hero"
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
