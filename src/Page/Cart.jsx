import React from 'react';
import { FaShoppingCart, FaTrash, FaCreditCard } from 'react-icons/fa';
import { useFoodContext } from '../Context/Context';
import { Link } from 'react-router-dom';
const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useFoodContext();

  // const getCart = localStorage.getItem("cart");
  // const Cart = JSON.parse(getCart);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
          <FaShoppingCart className="text-purple-400" />
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-8 text-center border border-white/10">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO6vHXp9wrMbddDgd-ew4Bd6JF3aKkwyg7Aw&s
"
              alt="Empty Cart"
              className="w-64 object-cover h-64 mx-auto mb-6"
            />
            <p className="text-xl text-white">Your cart is empty</p>
            <Link to="/">
              <p className="text-gray-400 mt-2">Add some delicious items to your cart!</p>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-purple-500/20 border border-white/10"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-pink-400 hover:text-pink-300 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <p className="text-gray-400 mt-1">{item.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div className='flex items-center gap-4 bg-white/5 px-4 py-2 rounded-lg'>
                          <button className={` w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center text-lg font-bold shadow-lg hover:shadow-pink-500/25 ${item.quantity === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          
                          onClick={() =>
                            item.quantity > 1 && updateQuantity(item._id, item.quantity - 1)
                          } 
                          disabled={item.quantity === 1}
                          >-</button>
                          <span className='text-white text-lg font-medium min-w-[20px] text-center'>{item.quantity}</span>
                          <button className='w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center text-lg font-bold shadow-lg hover:shadow-pink-500/25' onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                        </div>
                        <p className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">₹{item.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl shadow-lg p-6 sticky top-4 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Delivery Fee</span>
                    <span>₹30.00</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total</span>
                      <span>₹{(cart.reduce((acc, item) => acc + item.price * item.quantity, 0) + 30).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link to="/checkout">
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/25 flex items-center justify-center gap-2">
                  <FaCreditCard />
                  Proceed to Checkout
                </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
