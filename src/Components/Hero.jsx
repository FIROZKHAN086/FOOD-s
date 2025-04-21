import React from "react";
import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="w-full bg-gradient-to-br from-[#fff8f0] via-[#fdf6ee] to-[#ffe9e0] px-6 lg:px-20 py-16 lg:py-24 font-poppins">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 max-w-7xl mx-auto">
        {/* Left Section */}
        <motion.div
          className="flex-1 space-y-6 text-center lg:text-left"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-lg font-semibold text-[#e36414]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Fresh & Halal Delivered Fast 🚚
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#1a1a1a]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Taste the <span className="text-green-600">Freshness</span> <br />
            At Your Doorstep!
          </motion.h1>

          <motion.p
            className="text-gray-700 text-base md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Discover seasonal fruits, fresh food, and halal goods in a single tap.
            Get them delivered fast, fresh, and hassle-free!
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
            <motion.button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Order Now
            </motion.button>

            <motion.button
              className="bg-white text-green-700 border border-green-500 hover:bg-green-600 hover:text-white flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-md"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Explore More <FaArrowDown />
            </motion.button>
          </div>

          {/* Avatars & Testimonial */}
          <motion.div
            className="flex items-center gap-4 pt-6 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex -space-x-2 overflow-hidden">
              {[1, 2, 3].map((img, idx) => (
                <motion.img
                  key={idx}
                  src={`https://i.pravatar.cc/40?img=${img}`}
                  alt="Customer"
                  className="w-10 h-10 rounded-full border-2 border-white"
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-800">
              1000+ Satisfied Customers <br />
              <span className="text-green-600 font-medium">Across the Globe</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          className="flex-1 w-full flex justify-center"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="w-full max-w-md lg:max-w-lg bg-green-100 rounded-3xl overflow-hidden shadow-xl">
            <motion.img
              src="https://img.freepik.com/premium-photo/3d-illustration-old-farmer-his-vegetable-garden_1057-127543.jpg?w=740"
              alt="Hero Grocery"
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
