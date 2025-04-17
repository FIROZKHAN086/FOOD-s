import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useFoodContext } from "../Context/Context";
import { format } from "date-fns";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";

const MyOrders = () => {
  const { url } = useFoodContext();
  const auth = getAuth();
  const user = auth.currentUser;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${url}/api/orders/user/${user.uid}`);
        setOrders(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, url]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1f1c2c] to-[#928dab] py-10 px-4 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to view your orders</h2>
          <p className="text-white/70">You need to be logged in to see your order history.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1f1c2c] to-[#928dab] py-10 px-4 text-white flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1f1c2c] to-[#928dab] py-10 px-4 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
          <p className="text-white/70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f1c2c] to-[#928dab] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">My Orders</h2>

        {orders.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
            <p className="text-white/70 text-lg">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm text-white/60">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <p className="text-sm text-white/60">
                      {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                      order.status
                    )} text-white`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mb-4">
                  {order.products.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "https://via.placeholder.com/150"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                        <div>
                          <h3 className="text-white font-medium">{item.name}</h3>
                          <p className="text-sm text-white/60">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-white font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <div className="text-sm text-white/60">
                    Payment: {order.paymentMethod} ({order.paymentStatus})
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60">Total Amount</p>
                    <p className="text-xl font-bold text-white">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
