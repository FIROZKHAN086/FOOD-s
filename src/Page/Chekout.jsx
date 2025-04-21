import React, { useEffect, useState } from "react";
import { useFoodContext } from "../Context/Context";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const CheckoutPage = () => {
  const { cart, clearCart, getCartTotal, url } = useFoodContext();
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

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

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

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

  const handleApplyCoupon = () => {
    const validCoupons = {
      SAVE10: 10,
      SAVE20: 20,
      SAVE30: 30,
    };
    const enteredCode = couponCode.toUpperCase();
    if (validCoupons[enteredCode]) {
      setDiscount(validCoupons[enteredCode]);
      toast.success(`Coupon Applied: ${validCoupons[enteredCode]}% off`);
    } else {
      setDiscount(0);
      toast.error("Invalid Coupon Code");
    }
  };

  const totalAmount = getCartTotal();
  const discountedTotal = totalAmount - (totalAmount * discount) / 100;

  const handleOrderSubmit = async () => {
    if (!user) return toast.error("Please log in to place an order.");
    if (cart.length === 0) return toast.error("Your cart is empty.");
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zipCode)
      return toast.error("Please fill in all delivery address fields.");
    if (paymentMethod === "card" && (!paymentDetails.card.cardHolderName || !paymentDetails.card.cardNumber || !paymentDetails.card.expiryDate || !paymentDetails.card.cvv))
      return toast.error("Please fill in all card details.");
    if (paymentMethod === "upi" && (!paymentDetails.upi.upiId || !paymentDetails.upi.transactionId))
      return toast.error("Please fill in all UPI details.");

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
      totalAmount: discountedTotal,
      paymentMethod,
      paymentDetails: paymentMethod !== "cash" ? paymentDetails : undefined,
      deliveryAddress,
      paymentStatus: "pending",
      orderStatus: "pending",
      couponCode,
      discount
    };

    try {
      const response = await axios.post(`${url}/api/orders`, orderData);
      if (response.data) {
        toast.success("Order placed successfully!");
        clearCart();
        navigate("/myorders");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-medium">{user?.displayName || "Guest"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium">{user?.email || "No Email"}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Delivery Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="street" placeholder="Street Address" value={deliveryAddress.street} onChange={handleAddressChange} className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500" />
                <input type="text" name="city" placeholder="City" value={deliveryAddress.city} onChange={handleAddressChange} className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500" />
                <input type="text" name="state" placeholder="State" value={deliveryAddress.state} onChange={handleAddressChange} className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500" />
                <input type="text" name="zipCode" placeholder="ZIP Code" value={deliveryAddress.zipCode} onChange={handleAddressChange} className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500" />
              </div>
            </div>

            {/* Cart Items */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Your Order</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="bg-white p-4 flex items-center gap-4 rounded-lg shadow-sm">
                    <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} className="w-16 h-16 object-cover rounded-lg border" />
                    <div className="flex-1">
                      <h4 className="text-lg font-medium">{item.name}</h4>
                      <div className="text-gray-500 text-sm">${item.price} × {item.quantity}</div>
                    </div>
                    <div className="text-lg font-bold text-pink-600">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <label className="block text-lg font-medium mb-2">Apply Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Copuen Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <p className="mt-2 text-green-600 font-medium">Coupon applied: {discount}% off</p>
              )}
            </div>

            {/* Payment Section */}
            <div className="p-6 bg-gray-50 border rounded-xl space-y-6">
              <label className="block text-lg font-medium">Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white border focus:ring-2 focus:ring-pink-500">
                <option value="cash">Cash on Delivery</option>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI Payment</option>
              </select>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <input type="text" placeholder="Card Holder Name" value={paymentDetails.card.cardHolderName} onChange={(e) => handlePaymentDetailsChange(e, "card", "cardHolderName")} className="w-full px-4 py-3 border rounded-lg" />
                  <input type="text" placeholder="Card Number" value={paymentDetails.card.cardNumber} onChange={(e) => handlePaymentDetailsChange(e, "card", "cardNumber")} className="w-full px-4 py-3 border rounded-lg" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Expiry Date" value={paymentDetails.card.expiryDate} onChange={(e) => handlePaymentDetailsChange(e, "card", "expiryDate")} className="px-4 py-3 border rounded-lg" />
                    <input type="text" placeholder="CVV" value={paymentDetails.card.cvv} onChange={(e) => handlePaymentDetailsChange(e, "card", "cvv")} className="px-4 py-3 border rounded-lg" />
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="space-y-4">
                  <input type="text" placeholder="UPI ID" value={paymentDetails.upi.upiId} onChange={(e) => handlePaymentDetailsChange(e, "upi", "upiId")} className="w-full px-4 py-3 border rounded-lg" />
                  <input type="text" placeholder="Transaction ID" value={paymentDetails.upi.transactionId} onChange={(e) => handlePaymentDetailsChange(e, "upi", "transactionId")} className="w-full px-4 py-3 border rounded-lg" />
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center p-6 bg-gray-50 border rounded-xl">
              <span className="text-xl font-semibold">Total</span>
              <span className="text-2xl font-bold text-pink-600">${discountedTotal.toFixed(2)}</span>
            </div>

            {/* Submit Button */}
            <div>
              <button
                onClick={handleOrderSubmit}
                disabled={isSubmitting}
                className={`w-full text-center py-4 px-6 rounded-xl font-semibold text-lg tracking-wide bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:scale-105 transition-all ${isSubmitting && "opacity-50 cursor-not-allowed"}`}
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
