import React from 'react';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

const AppDownload = () => {
  return (
    <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 py-20 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get the FoodieHub App
            </h2>
            <p className="text-gray-100 text-lg mb-8 max-w-lg">
              Order your favorite meals, track delivery in real-time, and earn rewards with our mobile app. Available now on iOS and Android.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {/* App Store Button */}
              <button className="flex items-center justify-center space-x-3 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-black/30">
                <FaApple className="text-3xl" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-xl font-semibold">App Store</div>
                </div>
              </button>

              {/* Play Store Button */}
              <button className="flex items-center justify-center space-x-3 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-black/30">
                <FaGooglePlay className="text-3xl" />
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-xl font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="flex-1 relative">
            <div className="relative w-[280px] h-[580px] mx-auto">
              <div className="absolute inset-0 bg-black rounded-[3rem] shadow-2xl"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-[2.8rem] overflow-hidden">
                <img 
                  src="https://placehold.co/280x580/667EEA/ffffff?text=App+Screenshot"
                  alt="FoodieHub App Screenshot"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-2xl"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AppDownload;
