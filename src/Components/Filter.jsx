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
    <section
      className="w-full px-4 sm:px-6 lg:px-20 py-16 bg-gradient-to-br from-[#fff8f0] via-[#fefae0] to-[#f5f5f5]"
      data-aos="fade-up"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-12">
        Explore by Category
      </h2>

      <div className="flex overflow-x-auto gap-8 pb-4 scroll-smooth snap-x snap-mandatory custom-scroll">
        {dishes.map((dish) => (
          <button
            key={dish.id}
            onClick={() => setComeCategory(dish.category)}
            className={`min-w-[260px] sm:min-w-[280px] md:min-w-[300px] h-[340px] bg-white rounded-3xl overflow-hidden shadow-md relative group transition-all duration-500 snap-start hover:shadow-2xl hover:scale-[1.03]
              ${comeCategory === dish.category ? "ring-4 ring-yellow-400" : ""}
            `}
            data-aos="zoom-in-up"
          >
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            {/* Overlay Info */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 text-white backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition duration-500">
                {dish.name}
              </h3>
              <div className="flex justify-between items-center text-sm text-gray-200">
                <p>{dish.category}</p>
                <p className="text-yellow-400 font-semibold">{dish.price}</p>
              </div>
              <div className="mt-4 text-sm text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit self-end shadow">
                View Details
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Filter;
