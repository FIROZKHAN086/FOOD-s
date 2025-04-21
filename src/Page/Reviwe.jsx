import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaUser, FaClock } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useFoodContext } from '../Context/Context';

const ReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [comereviews, setcomeReviews] = useState([]);
  const auth = getAuth();
  const { url } = useFoodContext();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${url}/api/reviews`);
      // console.log(response.data.data)
      setcomeReviews(response.data.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      toast.error("Failed to load reviews");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (review.trim().length < 10) {
      toast.error("Please write a review with at least 10 characters");
      return;
    }

    setLoading(true);

    try {
      const reviewData = {
        userId: auth.currentUser.uid,
        userName: name,
        rating,
        review,
        createdAt: new Date()
      };

      await axios.post(`${url}/api/reviews`, reviewData);
      toast.success("Review submitted successfully!");
      setRating(0);
      setReview('');
      setName('');
      fetchReviews();
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-10 text-white">
            <h1 className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">Share Your Experience</h1>
            <p className="text-center mt-3 text-blue-100 text-lg">Your feedback helps us serve you better</p>
          </div>

          {/* Review Form Section */}
          <div className="p-8 bg-white/40">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-2">Rating</label>
                  <div className="flex gap-2 items-center bg-white/80 p-4 rounded-xl shadow-inner">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <motion.label
                          key={index}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <input
                            type="radio"
                            name="rating"
                            className="hidden"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                          />
                          <FaStar
                            className="cursor-pointer transform transition-all duration-200"
                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                            size={32}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                          />
                        </motion.label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Your Review</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white/80"
                  rows="4"
                  placeholder="Share your thoughts..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                ></textarea>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white py-4 rounded-xl font-medium text-lg
                  ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl transition-all duration-300'}`}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </motion.button>
            </form>
          </div>

          {/* Reviews Display Section */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What Our Customers Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comereviews.map((review, index) => (
                <motion.div
                  key={review._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 p-3 rounded-full shadow-lg">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{review.userName}</h3>
                        <div className="flex text-yellow-400 mt-1 gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <FaStar key={i} size={16} className="drop-shadow" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm bg-gray-50 px-3 py-1 rounded-full">
                      <FaClock className="mr-1" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.review}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewPage;
