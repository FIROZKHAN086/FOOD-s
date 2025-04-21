import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFoodContext } from '../Context/Context';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaTimes, FaSpinner, FaStar, FaHome } from 'react-icons/fa';

const NotificationPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const { url } = useFoodContext();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (!u) setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        toast.error("Please login to view notifications");
        return;
      }

      try {
        const res = await axios.get(`${url}/api/orders/user/${user.uid}`);
        if (res.data.success) {
          setOrders(res.data.data);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (err) {
        toast.error("Error fetching orders");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user, url]);

  const getStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return ['Pending confirmation', 'text-yellow-500', <FaSpinner className="animate-spin" />];
      case 'processing':
        return ['Order is being prepared', 'text-blue-500', <FaCheckCircle />];
      case 'delivered':
        return ['Delivered successfully', 'text-green-600', <FaCheckCircle />];
      case 'cancelled':
        return ['Order was cancelled', 'text-red-500', <FaTimes />];
      default:
        return ['Status unknown', 'text-gray-400', null];
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-700 bg-gray-50">
        <h2 className="text-2xl font-bold">Login Required</h2>
        <p className="text-sm text-gray-500 mb-4">Please login to view your notifications</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 pb-10 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order Notifications</h1>
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-blue-500"
          >
            <FaHome size={22} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <FaSpinner className="animate-spin text-blue-500 text-3xl mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">No notifications yet.</div>
        ) : (
          <motion.div className="space-y-4">
            {orders.map((order) => {
              const [msg, color, icon] = getStatus(order.orderStatus);
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 border rounded-xl shadow-sm bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-md font-semibold text-gray-800 mb-1">Order #{order._id.slice(-6)}</h2>
                      <p className={`text-sm ${color} flex items-center gap-2`}>
                        {icon} {msg}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Total: ${order.totalAmount?.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Payment: {order.paymentStatus}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${color} bg-opacity-10 border`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="mt-3 flex gap-4 flex-wrap">
                    {order.products.map((product, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <img src={product.image} alt="" className="w-10 h-10 object-cover rounded" />
                        <div className="text-sm text-gray-800">{product.name} x{product.quantity}</div>
                      </div>
                    ))}
                  </div>

                  {order.orderStatus?.toLowerCase() === 'delivered' && (
                    <button
                      onClick={() => navigate('/review')}
                      className="mt-4 inline-flex items-center gap-2 text-yellow-600 text-sm hover:underline"
                    >
                      <FaStar /> Write a review
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
