import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFoodContext } from "../../Context/Context";
import {
  FaCheck,
  FaTimes,
  FaSpinner,
  FaMoneyBillWave,
  FaCreditCard,
  FaMobileAlt,
} from "react-icons/fa";
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
      setLoading(true);
      let endpoint = `${url}/api/orders`;
      if (selectedStatus !== "all" || selectedPaymentStatus !== "all") {
        endpoint += `?status=${selectedStatus}&paymentStatus=${selectedPaymentStatus}`;
      }
      const response = await axios.get(endpoint);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentStatusUpdate = async (orderId, newStatus) => {
    if (!orderId || !newStatus) return toast.error("Invalid order or status");
    setUpdatingStatus(true);
    try {
      const res = await axios.put(`${url}/api/orders/${orderId}/payment-status`, { status: newStatus });
      if (res.data.success) {
        toast.success("Payment status updated");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, paymentStatus: newStatus } : o))
        );
        setShowPaymentModal(false);
      }
    } catch (err) {
      toast.error("Failed to update payment status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    if (!orderId || !newStatus) return toast.error("Invalid order or status");
    setUpdatingStatus(true);
    try {
      const res = await axios.put(`${url}/api/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(res.data.message || "Order status updated");
        await fetchOrders();
        setShowOrderModal(false);
      } else {
        toast.error(res.data.message || "Failed to update");
      }
    } catch (err) {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-200 text-yellow-900";
      case "completed":
        return "bg-green-200 text-green-900";
      case "failed":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-200 text-gray-900";
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
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
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl my-10 mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-indigo-600">🧾 Manage Orders</h1>
        <div className="flex gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="all">All Payment</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-400">Order #{order._id?.slice(-6)?.toUpperCase()}</p>
                <p className="text-xs text-gray-500">{format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus?.toUpperCase()}
              </span>
            </div>

            <div className="mb-4 space-y-2">
              {order.products?.map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                {getPaymentMethodIcon(order.paymentMethod)}
                <span>{order.paymentMethod?.toUpperCase()}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus?.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-indigo-600">${order.totalAmount?.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowPaymentModal(true);
                }}
                className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition"
                disabled={updatingStatus}
              >
                {updatingStatus ? <FaSpinner className="animate-spin" /> : "Update Payment"}
              </button>
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowOrderModal(true);
                }}
                className="px-4 py-2 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition"
                disabled={updatingStatus}
              >
                {updatingStatus ? <FaSpinner className="animate-spin" /> : "Update Order"}
              </button>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">No orders found</div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Update Payment Status</h3>
            <select
              value={selectedOrder.paymentStatus}
              onChange={(e) =>
                setSelectedOrder({ ...selectedOrder, paymentStatus: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg mb-4"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handlePaymentStatusUpdate(selectedOrder._id, selectedOrder.paymentStatus)
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Update Order Status</h3>
            <select
              value={selectedOrder.orderStatus}
              onChange={(e) =>
                setSelectedOrder({ ...selectedOrder, orderStatus: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg mb-4"
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
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleOrderStatusUpdate(selectedOrder._id, selectedOrder.orderStatus)
                }
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
