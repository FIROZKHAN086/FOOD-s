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
      const endpoint = selectedStatus === "all" 
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
      await axios.put(`${url}/api/orders/${orderId}/status`, { status: newStatus });
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white relative  mt-20  rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Orders</h2>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm text-white ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
                {order.status === "pending" && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, "processing")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaCheck />
                  </button>
                )}
                {order.status === "processing" && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, "delivered")}
                    className="text-green-500 hover:text-green-700"
                  >
                    <FaCheck />
                  </button>
                )}
                {(order.status === "pending" || order.status === "processing") && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, "cancelled")}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              {order.products.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">
                  Payment: {order.paymentMethod} ({order.paymentStatus})
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-xl font-bold">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg font-medium">No orders found</p>
            <p className="text-gray-400 text-sm mt-2">Orders will appear here once customers place them</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders; 