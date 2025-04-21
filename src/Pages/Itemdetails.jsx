import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFoodContext } from '../Context/Context';
import { FaStar, FaShoppingCart, FaLeaf, FaFireAlt, FaHeart } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { motion } from 'framer-motion';

const ItemDetails = ({setItem}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, filteredItems } = useFoodContext();
  const [items , setItems] = useState(null)

  useEffect(() => { 
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const currentItem = filteredItems.find(item => item.id === id);
    setItems(currentItem);
  }, [id, filteredItems]);

  if (!items) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="animate-spin w-14 h-14 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={() => setItem(false)}
            className="absolute top-5 right-5 text-white text-2xl z-10 hover:text-pink-400 transition"
          >
            <IoMdClose />
          </button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative h-[350px] md:h-[500px]"
            >
              <img
                src={items.image}
                alt={items.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 md:p-10"
            >
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{items.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl md:text-3xl font-extrabold text-pink-400">${items.price}</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-lg" />
                  ))}
                </div>
              </div>

              <p className="text-zinc-300 mb-8 leading-relaxed">{items.description}</p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3">
                  <FaLeaf className="text-green-400 text-xl" />
                  <span className="text-sm text-zinc-200">Fresh & Organic</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3">
                  <FaFireAlt className="text-orange-400 text-xl" />
                  <span className="text-sm text-zinc-200">Hot & Delicious</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3">
                  <FaHeart className="text-pink-400 text-xl" />
                  <span className="text-sm text-zinc-200">Loved by Foodies</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(items)}
                disabled={!items.isAvailable}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3
                  ${items.isAvailable
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transform hover:scale-105'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  }`}
              >
                <FaShoppingCart />
                {items.isAvailable ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ItemDetails;
