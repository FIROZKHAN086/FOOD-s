import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { useFoodContext } from '../Context/Context';
import { toast } from 'react-hot-toast';
import { FaTimes, FaSpinner, FaCheckCircle, FaTruck, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();
  const {url} = useFoodContext()

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!auth.currentUser) {
          toast.error("Please login to view notifications");
          return;
        }

        const response = await axios.get(`${url}/api/orders/user/${auth.currentUser.uid}`);
        setOrders(response.data);
      } catch (error) {
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth.currentUser]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivering':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          message: 'Your order is pending confirmation',
          icon: <FaSpinner className="animate-spin text-yellow-600" />
        };
      case 'confirmed':
        return {
          message: 'Your order has been confirmed',
          icon: <FaCheckCircle className="text-blue-600" />
        };
      case 'delivering':
        return {
          message: 'Your order is out for delivery',
          icon: <FaTruck className="text-indigo-600" />
        };
      case 'delivered':
        return {
          message: 'Your order has been delivered',
          icon: <FaCheckCircle className="text-green-600" />
        };
      default:
        return {
          message: '',
          icon: null
        };
    }
  };

  return (
    <div className=" font-sans inset-0 my-10  bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl flex flex-col h-full"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 flex-shrink-0">
            <div className='flex justify-between items-center'> 
              <h1 className="text-3xl font-bold text-white">Notifications</h1>
              <button onClick={() => navigate('/')} className='text-white'><FaTimes/></button>
            </div>
            <p className="text-blue-100 mt-2">Track your order status and updates</p>
          </div>

          <div className="p-6 flex-grow overflow-auto">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">No notifications yet</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order._id.slice(-6)}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusMessage(order.status).icon}
                          <p className="text-sm italic">{getStatusMessage(order.status).message}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm text-gray-600">
                        <p>Total Amount: ${order.totalAmount}</p>
                        <p>Payment Method: {order.paymentMethod}</p>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        {order.products.map((product, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.status.toLowerCase() === 'delivered' && (
                        <button 
                          className="mt-4 flex items-center gap-2 bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition-all duration-300"
                          onClick={() => navigate('/review')}
                        >
                          <FaStar className="text-white" />
                          Write a Review
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationPage;
