import React, { useEffect } from "react";
import { useFoodContext } from "../Context/Context";
import { dishes } from "../assets/Filter";
import AOS from "aos";
import "aos/dist/aos.css";

const Filter = () => {
  const { filteredItems, comeCategory, setComeCategory } = useFoodContext();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div
      className="w-full relative md:mt-[70%] mt-20 my-10 z-20 h-full px-4 py-12 bg-gradient-to-b from-[#f0f9ff] via-white to-[#e2e8f0]"
      data-aos="fade-up"
    >
      <div className="flex overflow-x-auto pb-4 custom-scroll">
        <div className="flex gap-6">
          {dishes.map((dish) => (
            <button
              key={dish.id}
              onClick={() => setComeCategory(dish.category)}
              className={`relative min-w-[280px] h-[320px] rounded-2xl overflow-hidden group
                  transition-all duration-500 ease-in-out
                  hover:shadow-2xl hover:-translate-y-3
                  before:content-[''] before:absolute before:inset-0 
                  before:bg-gradient-to-t before:from-black/80 before:to-transparent
                  before:opacity-0 before:group-hover:opacity-100 before:transition-opacity
                  before:duration-500 before:z-10
                  after:content-[''] after:absolute after:inset-0 
                  after:bg-gradient-to-b after:from-black/50 after:to-transparent
                  after:opacity-0 after:group-hover:opacity-100 after:transition-opacity
                  after:duration-500 after:z-10
                  ${comeCategory === dish.category ? 'ring-2 ring-purple-500 scale-105' : ''}
              `}
              data-aos="zoom-in-up"
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white text-2xl font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-6 group-hover:translate-x-0">
                  {dish.name}
                </h3>
                <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-6 group-hover:translate-y-0">
                  <p className="text-gray-200 text-sm">{dish.category}</p>
                  <p className="text-yellow-400 font-bold">{dish.price}</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm shadow">
                  View Details
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
