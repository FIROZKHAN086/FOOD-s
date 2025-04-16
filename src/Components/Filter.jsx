import React from "react";
import { useFoodContext } from "../Context/Context";
import { dishes } from "../assets/Filter";

const Filter = () => {
   const {  filteredItems, comeCategory, setComeCategory} = useFoodContext();
    // console.log(comeCategory);
    // console.log(filteredItems);

    return (
        <div className="w-full px-4 py-12 bg-gradient-to-b from-white to-gray-50">
            <div className="flex overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex gap-6">
                    {dishes.map((dish) => (
                        <button
                            key={dish.id}
                            onClick={() => {  
                                setComeCategory(dish.category);
                                // console.log(dish.category);
                            }}
                           
                            className={`relative min-w-[280px] h-[320px] rounded-2xl overflow-hidden group
                                transition-all duration-500 ease-in-out
                                hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]
                                hover:-translate-y-3
                                before:content-[''] before:absolute before:inset-0 
                                before:bg-gradient-to-t before:from-black/80 before:to-transparent
                                before:opacity-0 before:group-hover:opacity-100 before:transition-opacity
                                before:duration-500 before:z-10
                                after:content-[''] after:absolute after:inset-0 
                                after:bg-gradient-to-b after:from-black/50 after:to-transparent
                                after:opacity-0 after:group-hover:opacity-100 after:transition-opacity
                                after:duration-500 after:z-10
                                 {category === dish.category ? 'ring-2 ring-blue-500' : ''}`}
                              // aria-label={`Filter by ${dish.name}`}
                        >
                            <img 
                                src={dish.image}
                                alt={dish.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                            />
                            <div className="absolute bottom-0 left-0 p-6 z-20 w-full transform translate-y-4 
                                group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-white text-2xl font-bold mb-2 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                    transform -translate-x-6 group-hover:translate-x-0">
                                    {dish.name}
                                </h3>
                                <div className="flex justify-between items-center 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                    transform translate-y-6 group-hover:translate-y-0">
                                    <p className="text-gray-200 text-sm">
                                        {dish.category}
                                    </p>
                                    <p className="text-yellow-400 font-bold">
                                        {dish.price}
                                    </p>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 z-20 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
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
