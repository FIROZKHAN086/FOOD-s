import React, { useState, useEffect } from "react";
import { useFoodContext } from "../Context/Context";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cart, clearCart, getCartTotal, url } = useFoodContext();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleOrderSubmit = async () => {
    if (!user) {
      toast.error("Please log in to place an order.");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      userId: user.uid,
      products: cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "https://via.placeholder.com/150"
      })),
      totalAmount: getCartTotal(),
      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
      status: "pending",
    };

    try {
      const response = await axios.post(`${url}/api/orders`, orderData);
      if (response.data) {
        toast.success("Order placed successfully!");
        navigate("/myorders");
        clearCart();
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-[#1e293b] to-[#334155] rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-6 py-8">
            <h2 className="text-4xl font-extrabold text-white text-center">
              Complete Your Order
            </h2>
          </div>

          <div className="p-6 md:p-8">
            {/* User Info */}
            <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">Name</label>
                  <p className="text-white text-lg font-medium">{user?.displayName || "Guest"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">Email</label>
                  <p className="text-white text-lg font-medium">{user?.email || "No Email"}</p>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700">
                {cart.map(item => (
                  <div key={item._id} 
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition duration-300">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg ring-2 ring-purple-500/30"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-lg">{item.name}</h4>
                        <div className="flex items-center gap-2 text-gray-400 mt-1">
                          <span>${item.price}</span>
                          <span>×</span>
                          <span>{item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Payment */}
            <div className="mt-8 space-y-6">
              <div className="flex justify-between items-center bg-white/5 p-6 rounded-xl">
                <span className="text-xl text-white font-semibold">Total Amount</span>
                <span className="text-2xl text-white font-bold">${getCartTotal().toFixed(2)}</span>
              </div>

              <div className="bg-white/5 p-6 rounded-xl space-y-4">
                <label className="text-white text-lg font-semibold">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-[#1e293b] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                onClick={handleOrderSubmit}
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                  text-white font-bold py-4 px-6 rounded-xl transform transition-all duration-300 
                  hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0f172a]
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:shadow-purple-500/20"}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Order...
                  </span>
                ) : "Complete Purchase"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
