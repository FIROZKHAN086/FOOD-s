import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useFoodContext } from "../Context/Context";
import { format } from "date-fns";
import { FaSpinner, FaUtensils } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { url } = useFoodContext();
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${url}/api/orders/user/${user.uid}`);
        if (res.data.success) {
          setOrders(res.data.data);
          setError(null);
        } else {
          setError(res.data.message || "Failed to fetch orders");
          toast.error(res.data.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.response?.data?.message || "Failed to fetch orders. Please try again later.");
        toast.error(error.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, url]);

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-300 text-gray-800";
    
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-400 text-yellow-800";
      case "processing":
        return "bg-blue-400 text-blue-800";
      case "delivered":
        return "bg-green-400 text-green-800";
      case "cancelled":
        return "bg-red-400 text-red-800";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 to-orange-500 flex items-center justify-center text-gray-800 px-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-white">Please login to view your orders</h2>
          <p className="text-gray-100">You need to be logged in to see your order history.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-r from-pink-100 to-yellow-200 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">My Orders <FaUtensils className="inline-block text-2xl text-yellow-600" /></h2>

        {orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow text-center">
            <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm text-gray-500">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-400">
                      {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}
                  >
                    {order.orderStatus || "N/A"}
                  </span>
                </div>

                <div className="mb-4">
                  {order.products.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "https://via.placeholder.com/150"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg border"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                        <div>
                          <h3 className="text-gray-800 font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-gray-800 font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Payment: {order.paymentMethod} ({order.paymentStatus || "N/A"})
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-blue-600">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
