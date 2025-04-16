 import React from "react";


 const Hero = () => {
  return (
    <div className="top-8 left-0 w-full h-full bg-white relative py-12 px-6 lg:px-20 flex flex-col lg:flex-row items-center justify-between ">
      {/* Left Text Section */}
      <div className="max-w-xl space-y-6 text-center lg:text-left">
        <p className="text-sm text-yellow-600 font-medium">
          Halal Products <span className="text-red-600">Online Delivery Shop</span>
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
          Make Healthy <br /> Life With{" "}
          <span className="text-green-700">Fresh</span> Grocery
        </h1>
        <p className="text-gray-600">
          This year, our new summer collection will shelter you harsh elements
          of a world that .
        </p>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded font-semibold">
          Shop Now
        </button>

        {/* Bottom Avatars Section */}
        <div className="flex items-center gap-4 pt-4">
          <div className="flex -space-x-2 overflow-hidden">
            <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=1" />
            <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=2" />
            <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=3" />
          </div>
          <p className="text-sm text-gray-800">
            PioMart – <span className="text-green-700 font-semibold">Satisfied Around the Worldwide</span>
          </p>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="relative mt-10 lg:mt-0">
        <div className="bg-green-800 w-full lg:w-[420px] h-[400px] rounded-lg overflow-hidden relative">
          <img
            src="https://img.freepik.com/premium-photo/3d-illustration-old-farmer-his-vegetable-garden_1057-127543.jpg?w=740"
            alt="Grocery Hero"
            className="w-full h-full object-cover"
          />
          
        </div>
      </div>
    </div>
  );
};

export default Hero;
