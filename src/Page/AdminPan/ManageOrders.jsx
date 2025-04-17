import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFoodContext } from "../../Context/Context";
import { FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

const ManageOrders = () => {
  const { url } = useFoodContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      const endpoint =
        selectedStatus === "all"
          ? `${url}/api/orders`
          : `${url}/api/orders/status/${selectedStatus}`;

      const response = await axios.get(endpoint);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`${url}/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-400 text-yellow-900";
      case "processing":
        return "bg-blue-400 text-blue-900";
      case "delivered":
        return "bg-green-400 text-green-900";
      case "cancelled":
        return "bg-red-400 text-red-900";
      default:
        return "bg-gray-400 text-gray-900";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-slate-100">
        <FaSpinner className="animate-spin text-5xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 mt-20 py-12 bg-gradient-to-br from-sky-100 to-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800">Manage Orders</h2>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-white border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-2xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-400">
                    {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  {order.status === "pending" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(order._id, "processing")
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaCheck />
                    </button>
                  )}
                  {order.status === "processing" && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, "delivered")}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaCheck />
                    </button>
                  )}
                  {(order.status === "pending" ||
                    order.status === "processing") && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, "cancelled")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4 space-y-3">
                {order.products.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-white rounded-md px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-slate-700">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Payment:{" "}
                  <span className="font-medium text-slate-700">
                    {order.paymentMethod}
                  </span>{" "}
                  ({order.paymentStatus})
                </p>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-xl font-bold text-slate-800">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-16 rounded-xl bg-white/70 backdrop-blur shadow-lg">
              <p className="text-xl font-medium text-gray-500">
                No orders found
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Orders will appear here once customers place them
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
