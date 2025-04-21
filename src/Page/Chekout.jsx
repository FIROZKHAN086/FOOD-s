import React, { useEffect, useState } from "react";
import { useFoodContext } from "../Context/Context";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaAppleAlt, FaLemon, } from "react-icons/fa"; // Fruit-themed icons

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

useEffect(()=>{
  window.scroll(0,0);
},[]);

const CheckoutPage = () => {
  const { cart, clearCart, getCartTotal, url } = useFoodContext();
  const auth = getAuth();
  const user = auth.currentUser;

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    card: {
      cardHolderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: ""
    },
    upi: {
      upiId: "",
      transactionId: ""
    }
  });
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePaymentDetailsChange = (e, method, field) => {
    setPaymentDetails(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: e.target.value
      }
    }));
  };

  const handleAddressChange = (e) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleOrderSubmit = async () => {
    if (!user) {
      toast.error("Please log in to place an order.");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zipCode) {
      toast.error("Please fill in all delivery address fields.");
      return;
    }

    if (paymentMethod === "card" && (!paymentDetails.card.cardHolderName || !paymentDetails.card.cardNumber || !paymentDetails.card.expiryDate || !paymentDetails.card.cvv)) {
      toast.error("Please fill in all card details.");
      return;
    }

    if (paymentMethod === "upi" && (!paymentDetails.upi.upiId || !paymentDetails.upi.transactionId)) {
      toast.error("Please fill in all UPI details.");
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
        image: item.image || "https://via.placeholder.com/150",
      })),
      totalAmount: getCartTotal(),
      paymentMethod,
      paymentDetails: paymentMethod !== "cash" ? paymentDetails : undefined,
      deliveryAddress,
      paymentStatus: "pending",
      orderStatus: "pending"
    };

    try {
      const response = await axios.post(`${url}/api/orders`, orderData);
      if (response.data) {
        toast.success("Order placed successfully!");
        navigate("/myorders");
        clearCart();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-200 via-pink-300 to-orange-300 px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          className="bg-white border rounded-xl shadow-xl p-6"
        >
          <div className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white p-6 rounded-t-xl text-center">
            <h2 className="text-4xl font-semibold">Checkout</h2>
          </div>

          <div className="space-y-6 p-6">
            {/* User Info */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-medium">{user?.displayName || "Guest"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium">{user?.email || "No Email"}</p>
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold">Delivery Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={deliveryAddress.street}
                  onChange={handleAddressChange}
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={deliveryAddress.city}
                  onChange={handleAddressChange}
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={deliveryAddress.state}
                  onChange={handleAddressChange}
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={deliveryAddress.zipCode}
                  onChange={handleAddressChange}
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </motion.div>

            {/* Cart Items */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-2xl font-semibold mb-4">Your  Order</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="bg-white p-4 flex items-center gap-4 rounded-lg shadow-sm hover:shadow-md transition">
                    <img
                      src={item.image || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-medium">{item.name}</h4>
                      <div className="text-gray-500 text-sm">
                        ${item.price} × {item.quantity}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-pink-600">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <div className="p-6 bg-gray-50 border rounded-xl">
                <label className="block text-lg font-medium mb-4">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white border focus:ring-2 focus:ring-pink-500 mb-4"
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI Payment</option>
                </select>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Card Holder Name"
                      value={paymentDetails.card.cardHolderName}
                      onChange={(e) => handlePaymentDetailsChange(e, "card", "cardHolderName")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={paymentDetails.card.cardNumber}
                      onChange={(e) => handlePaymentDetailsChange(e, "card", "cardNumber")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Expiry Date (MM/YY)"
                        value={paymentDetails.card.expiryDate}
                        onChange={(e) => handlePaymentDetailsChange(e, "card", "expiryDate")}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={paymentDetails.card.cvv}
                        onChange={(e) => handlePaymentDetailsChange(e, "card", "cvv")}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="UPI ID"
                      value={paymentDetails.upi.upiId}
                      onChange={(e) => handlePaymentDetailsChange(e, "upi", "upiId")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="Transaction ID"
                      value={paymentDetails.upi.transactionId}
                      onChange={(e) => handlePaymentDetailsChange(e, "upi", "transactionId")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center p-6 bg-gray-50 border rounded-xl">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-2xl font-bold text-pink-600">${getCartTotal().toFixed(2)}</span>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={handleOrderSubmit}
                disabled={isSubmitting}
                className={`w-full text-center py-4 px-6 rounded-xl font-semibold text-lg tracking-wide bg-gradient-to-r from-pink-500 to-orange-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" className="opacity-25 stroke-white" strokeWidth="4" fill="none" />
                      <path d="M4 12a8 8 0 018-8" className="opacity-75 fill-white" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
