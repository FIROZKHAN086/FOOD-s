import { useFoodContext } from '../Context/Context';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect } from 'react';

const FoodMenu = ({ setItem }) => {
  const {
    filteredItems,
    setComeCategory,
    loading,
    error,
    addToCart,
    removeFromCart,
    cart,
  } = useFoodContext();

  const categories = ['pizza', 'burger', 'sushi', 'thali'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        <p className="ml-4 text-white text-xl font-poppins animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <p className="text-red-500 text-xl font-poppins">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-12 font-poppins">
      <div className="max-w-[1600px] mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-teal-300 mb-12 font-pacifico">
          Explore Our Menu
        </h1>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {['All', ...categories].map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setComeCategory(cat)}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-pink-300/30 transition-transform hover:scale-105"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Desktop Cards */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden hover:shadow-purple-400 transition-all duration-500 group"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-[280px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">{item.name}</h2>
                    <span className="text-xl font-semibold text-rose-300">${item.price}</span>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2">{item.description}</p>
                  <div className="flex flex-col gap-3">
                            <button
                              onClick={() => setItem(item._id)}
                              className="py-2 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 transition-transform duration-300"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => addToCart(item)}
                              disabled={!item.isAvailable}
                              className={`py-2 rounded-xl font-semibold transition-all ${
                                item.isAvailable
                                  ? 'bg-teal-500 hover:bg-teal-600 text-white'
                                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                              }`}
                            >
                              {cart[item.id] > 0
                                ? 'Remove from Cart'
                                : item.isAvailable
                                ? 'Add to Cart'
                                : 'Out of Stock'}
                            </button>
                          </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-200">No items found.</div>
          )}
        </div>

        {/* Mobile Swiper */}
        <div className="md:hidden mt-16">
          {categories.map((category) => (
            <div key={category} className="mb-20">
              <h2 className="text-3xl font-bold text-center text-purple-300 mb-6 capitalize font-pacifico">
                {category}
              </h2>
              <Swiper
                modules={[EffectCoverflow, Pagination, Autoplay]}
                effect="coverflow"
                grabCursor
                centeredSlides
                slidesPerView="auto"
                loop
                autoplay={{ delay: 7000 }}
                pagination={{ clickable: true }}
                coverflowEffect={{
                  rotate: 30,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                  slideShadows: true,
                }}
                className="mySwiper"
              >
                {filteredItems
                  .filter((item) => item.category.toLowerCase() === category.toLowerCase())
                  .map((item) => (
                    <SwiperSlide key={item.id} className="w-[80%] max-w-sm">
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-[250px] w-full object-cover"
                        />
                        <div className="p-5 space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                            <span className="text-pink-400 font-bold">${item.price}</span>
                          </div>
                          <p className="text-gray-300 text-sm line-clamp-3">{item.description}</p>
                          <div className="flex flex-col gap-3">
                            <button
                              onClick={() => setItem(item._id)}
                              className="py-2 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 transition-transform duration-300"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => addToCart(item)}
                              disabled={!item.isAvailable}
                              className={`py-2 rounded-xl font-semibold transition-all ${
                                item.isAvailable
                                  ? 'bg-teal-500 hover:bg-teal-600 text-white'
                                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                              }`}
                            >
                              {cart[item.id] > 0
                                ? 'Remove from Cart'
                                : item.isAvailable
                                ? 'Add to Cart'
                                : 'Out of Stock'}
                            </button>
                          </div>
                        </div>
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
