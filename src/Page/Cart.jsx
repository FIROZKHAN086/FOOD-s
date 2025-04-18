import React, { useEffect } from 'react';
import { FaShoppingCart, FaTrash, FaCreditCard } from 'react-icons/fa';
import { useFoodContext } from '../Context/Context';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useFoodContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-10 flex items-center gap-3">
          <FaShoppingCart className="text-purple-600" />
          Your Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl shadow-md p-10 text-center border">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="Empty Cart"
              className="w-48 mx-auto mb-6"
            />
            <p className="text-xl font-semibold text-gray-700">Your cart is empty</p>
            <Link to="/" className="text-purple-600 hover:underline mt-2 inline-block">
              Add some delicious items to your cart!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border rounded-xl shadow-md p-6 flex items-start gap-6 hover:shadow-lg transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <p className="text-gray-500 mt-1">{item.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 border rounded-md px-3 py-1">
                        <button
                          className="text-lg font-bold text-purple-600 disabled:opacity-40"
                          onClick={() =>
                            item.quantity > 1 && updateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                        >
                          -
                        </button>
                        <span className="text-gray-700 text-md">{item.quantity}</span>
                        <button
                          className="text-lg font-bold text-purple-600"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xl font-bold text-gray-800">₹{item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border rounded-xl shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹30.00</span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-800">
                      <span>Total</span>
                      <span>
                        ₹{(cart.reduce((acc, item) => acc + item.price * item.quantity, 0) + 30).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link to="/checkout" className="block mt-6">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-md">
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
