import React, { useState } from "react";
import { useFoodContext } from "../Context/Context";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { toast } from "react-hot-toast";

const CheckoutPage = () => {
  const { cart, clearCart, getCartTotal, url } = useFoodContext();
  const auth = getAuth();
  const user = auth.currentUser;

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        image: item.image || "https://via.placeholder.com/150" // Fallback image if none provided
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
    <div className="min-h-screen bg-gradient-to-br from-[#1f1c2c] to-[#928dab] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">Checkout</h2>

        <div className="space-y-4 mb-8">
          <div className="text-lg">
            <strong>Name:</strong> {user?.displayName || "Guest"}
          </div>
          <div className="text-lg">
            <strong>Email:</strong> {user?.email || "No Email"}
          </div>

          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">Your Items</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {cart.map(item => (
                <div
                  key={item._id}
                  className="flex justify-between items-center bg-white/20 p-3 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-white/70">
                        ${item.price} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <h3 className="text-2xl font-bold">Total:</h3>
            <h3 className="text-2xl font-bold">${getCartTotal().toFixed(2)}</h3>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
          </select>
        </div>

        <button
          onClick={handleOrderSubmit}
          disabled={isSubmitting}
          className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-pink-400/30 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
