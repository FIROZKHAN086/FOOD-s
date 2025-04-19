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
    if (!orderId || !newStatus) {
      toast.error("Invalid order or status");
      return;
    }

    setUpdatingStatus(true);
    try {
      const response = await axios.put(
        `${url}/api/orders/${orderId}/payment-status`,
        { status: newStatus }
      );

      if (response.data.success) {
        toast.success("Payment status updated successfully");
        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId
              ? { ...order, paymentStatus: newStatus }
              : order
          )
        );
        setShowPaymentModal(false);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
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

      if (response.data.success) {
        toast.success(response.data.message || "Order status updated successfully");
        await fetchOrders();
        setShowOrderModal(false);
      } else {
        toast.error(response.data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-400 text-yellow-900";
      case "completed":
        return "bg-green-400 text-green-900";
      case "failed":
        return "bg-red-400 text-red-900";
      default:
        return "bg-gray-400 text-gray-900";
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
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <div className="flex gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
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
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  Order #{order._id?.slice(-6)?.toUpperCase()}
                </p>
                <p className="text-sm text-gray-400">
                  {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus?.toUpperCase() || "N/A"}
                </span>
              </div>
            </div>

            <div className="mb-4">
              {order.products?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-2">
                {getPaymentMethodIcon(order.paymentMethod)}
                <span className="text-sm text-gray-500">
                  {order.paymentMethod?.toUpperCase()}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus?.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold">
                  ${order.totalAmount?.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowPaymentModal(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
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
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Payment Status Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Update Payment Status</h3>
            <select
              value={selectedOrder.paymentStatus}
              onChange={(e) => {
                setSelectedOrder({
                  ...selectedOrder,
                  paymentStatus: e.target.value
                });
              }}
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
                  handlePaymentStatusUpdate(
                    selectedOrder._id,
                    selectedOrder.paymentStatus
                  )
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={updatingStatus}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Status Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Update Order Status</h3>
            <select
              value={selectedOrder.orderStatus}
              onChange={(e) => {
                setSelectedOrder({
                  ...selectedOrder,
                  orderStatus: e.target.value
                });
              }}
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
                  handleOrderStatusUpdate(
                    selectedOrder._id,
                    selectedOrder.orderStatus
                  )
                }
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                disabled={updatingStatus}
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
