import { useFoodContext } from '../Context/Context';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FoodMenu = () => {
    const { 
        filteredItems, 
        setComeCategory, 
        loading, 
        error, 
        addToCart, 
        removeFromCart,
        cart 
    } = useFoodContext();
    
    const categories = ['pizza', 'burger', 'sushi', 'thali'];

   

    // const handleCartAction = (item) => {
    //     if (isInCart(item.id)) {
    //         removeFromCart(item.id);
    //     } else {
    //         addToCart(item);
    //     }
    // };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 flex items-center justify-center">
                <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                <div className="ml-4 text-white text-2xl font-medium animate-pulse">Loading<span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 flex items-center justify-center">
                <div className="text-red-500 text-2xl">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
            <div className="max-w-[2000px] mx-auto px-4">
                <h1 className="text-6xl font-bold text-center mb-10 text-white">
                    Our Food Menu
                </h1>

                <div className="flex justify-center gap-4 mb-12">
                    <button 
                        onClick={() => setComeCategory("All")}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 
                                rounded-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 
                                transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
                    >
                        All Menu
                    </button>
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-3 gap-8 mb-12">
                    {filteredItems.length > 0 ? filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden 
                                    hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2
                                    hover:shadow-2xl hover:shadow-purple-500/20"
                        >
                            <div className="aspect-w-16 aspect-h-9">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-[300px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 
                                        group-hover:opacity-100 transition-opacity duration-300"/>

                            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 
                                        group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-2xl font-bold text-white group-hover:text-purple-400">{item.name}</h2>
                                    <span className="text-xl font-bold text-purple-400">${item.price}</span>
                                </div>
                                <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                                <button 
                                    onClick={() => addToCart(item)}
                                                
                                    
                                    className={`w-full py-3 rounded-xl font-medium transition-all duration-300
                                            ${item.isAvailable ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
                                >
                                        {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>

                            {!item.isAvailable && (
                                <div className="absolute top-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-full">
                                    Out of Stock
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="col-span-3 text-center text-white text-xl">
                            No items available in this category.
                        </div>
                    )}
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                    {categories.map((category) => (
                        <div key={category} className="mb-12">
                            <h2 className="text-3xl font-bold text-white mb-6 capitalize">{category}</h2>
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                pagination={{ clickable: true }}
                                Navigation={true}
                                spaceBetween={20}
                                slidesPerView={1}
                                className="food-swiper-mobile"
                            >
                                {filteredItems
                                    .filter(item => item.category.toLowerCase() === category.toLowerCase())
                                    .map((item) => (
                                        <SwiperSlide key={item.id}>
                                            <div className="group relative bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden 
                                                        hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2
                                                        hover:shadow-2xl hover:shadow-purple-500/20">
                                                <div className="aspect-w-16 aspect-h-9">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-[300px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 
                                                            group-hover:opacity-100 transition-opacity duration-300"/>

                                                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 
                                                            group-hover:translate-y-0 transition-transform duration-300">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h2 className="text-2xl font-bold text-white group-hover:text-purple-400">{item.name}</h2>
                                                        <span className="text-xl font-bold text-purple-400">${item.price}</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                                                    <button 
                                                         onClick={() => addToCart(item)}
                                                        className={`w-full py-3 rounded-xl font-medium transition-all duration-300
                                                                ${item.isAvailable 
                                                                    ? cart[item.id] > 0
                                                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                                                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                                                                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
                                                        disabled={!item.isAvailable}
                                                    >
                                                        {cart[item.id] > 0 ? 'Remove from Cart' : (item.isAvailable ? 'Add to Cart' : 'Out of Stock')}
                                                    </button>
                                                </div>

                                                {!item.isAvailable && (
                                                    <div className="absolute top-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-full">
                                                        Out of Stock
                                                    </div>
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                            </Swiper>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FoodMenu;