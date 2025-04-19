import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFoodContext } from "../../Context/Context";
import { FaCheck, FaTimes, FaSpinner, FaMoneyBillWave, FaCreditCard, FaMobileAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

const ManageOrders = () => {
  const { url } = useFoodContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, selectedPaymentStatus]);

  const fetchOrders = async () => {
    try {
      let endpoint = `${url}/api/orders`;
      if (selectedStatus !== "all" || selectedPaymentStatus !== "all") {
        endpoint += `?status=${selectedStatus}&paymentStatus=${selectedPaymentStatus}`;
      }
      const response = await axios.get(endpoint);
      console.log("Orders response:", response.data[12].paymentStatus
      );
      setOrders(response.data || response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      setLoading(false);
    }
  };

  const handlePaymentStatusUpdate = async (orderId, newStatus) => {
    if (!orderId || !newStatus) {
      toast.error("Invalid order or status");
      return;
    }
  
    setUpdatingStatus(true);
    try {
      const response = await axios.put(`${url}/api/orders/${orderId}/status`, {
        status: newStatus,
        transactionId: `txn-${Date.now()}`,
        notes: `Payment status updated to ${newStatus}`,
      });
  
      if (response.data) {
        toast.success("Payment status updated successfully");
        fetchOrders();
        setShowPaymentModal(false);
      } else {
        toast.error(response.data.message || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      const errorMessage = error.response?.data?.message || "Failed to update payment status";
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    if (!orderId || !newStatus) {
      toast.error("Invalid order or status");
      return;
    }

    setUpdatingStatus(true);
    try {
      const response = await axios.put(`${url}/api/orders/${orderId}/status`, {
        status: newStatus
      });

      if (response.data) {
        toast.success("Order status updated successfully");
        fetchOrders();  // Fetch updated orders list
        setShowOrderModal(false);
      } else {
        toast.error(response.data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      const errorMessage = error.response?.data?.message || "Failed to update order status";
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus(false);
    }
  };


  const getStatusColor = (status) => {
    if (!status || typeof status !== "string") return "bg-gray-400 text-gray-900";
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

  const getPaymentStatusColor = (status) => {
    if (!status || typeof status !== "string") return "bg-gray-400 text-gray-900";
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-400 text-yellow-900";
      case "processing":
        return "bg-blue-400 text-blue-900";
      case "completed":
        return "bg-green-400 text-green-900";
      case "failed":
        return "bg-red-400 text-red-900";
      case "refunded":
        return "bg-purple-400 text-purple-900";
      default:
        return "bg-gray-400 text-gray-900";
    }
  };

  const getPaymentMethodIcon = (method) => {
    if (!method || typeof method !== "string") return null;
    switch (method.toLowerCase()) {
      case "cash":
        return <FaMoneyBillWave className="text-green-500" />;
      case "card":
        return <FaCreditCard className="text-blue-500" />;
      case "upi":
        return <FaMobileAlt className="text-purple-500" />;
      default:
        return null;
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-3xl font-bold text-slate-800">Manage Orders</h2>
          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-white border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All Order Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="px-4 py-2 bg-white border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All Payment Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
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
                    Order #{order._id?.slice(-6)?.toUpperCase() || 'N/A'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {order.createdAt ? format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a") : 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status
                      || 'N/A'}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaCheck />
                  </button>
                </div>
              </div>

              <div className="mb-4 space-y-3">
                {order.products?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-white rounded-md px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || "https://via.placeholder.com/150"}
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
                <div className="flex items-center gap-2">
                  {getPaymentMethodIcon(order.paymentMethod)}
                  <span className="text-sm text-slate-500">
                    {order.paymentMethod?.toUpperCase() || 'N/A'}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus || 'N/A'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-xl font-bold text-slate-800">
                    ${order.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowPaymentModal(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  disabled={updatingStatus}
                >
                  {updatingStatus ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Update Payment"
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderModal(true);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  disabled={updatingStatus}
                >
                  {updatingStatus ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Update Order"
                  )}
                </button>
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

      {/* Payment Status Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Update Payment Status</h3>
            <div className="space-y-4">
              <select
                value={selectedOrder.paymentStatus}
                onChange={(e) => {
                  setSelectedOrder({
                    ...selectedOrder,
                    paymentStatus: e.target.value
                  });
                }}
                className="w-full px-4 py-2 border rounded-lg"
                disabled={updatingStatus}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  disabled={updatingStatus}
                >
                  Cancel
                </button>
                <button
                  onClick={() =>  handlePaymentStatusUpdate(
                    selectedOrder._id,
                    selectedOrder.paymentStatus
                  )}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={updatingStatus}
                >
                  {updatingStatus ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Status Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Update Order Status</h3>
            <div className="space-y-4">
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => {
                  setSelectedOrder({
                    ...selectedOrder,
                    orderStatus: e.target.value
                  });
                }}
                className="w-full px-4 py-2 border rounded-lg"
                disabled={updatingStatus}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  disabled={updatingStatus}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleOrderStatusUpdate(selectedOrder._id, selectedOrder.orderStatus)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  disabled={updatingStatus}
                >
                  {updatingStatus ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
