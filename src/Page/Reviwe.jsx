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
  const [reviews, setReviews] = useState([]);
  const auth = getAuth();
  const { url } = useFoodContext();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${url}/api/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
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
      fetchReviews(); // Refresh reviews after submission
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 pt-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <h1 className="text-4xl font-bold text-center">Share Your Experience</h1>
            <p className="text-center mt-2 text-blue-100">Your feedback helps us improve</p>
          </div>

          {/* Review Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-2">Rating</label>
                  <div className="flex gap-2 items-center bg-gray-50 p-3 rounded-xl">
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
                            className="cursor-pointer"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Share your thoughts..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                ></textarea>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-medium text-lg
                  ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg transition-all duration-200'}`}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </motion.button>
            </form>
          </div>

          {/* Reviews Display Section */}
          <div className="bg-gray-50 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                        <FaUser className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{review.userName}</h3>
                        <div className="flex text-yellow-400 mt-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <FaStar key={i} size={14} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <FaClock className="mr-1" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.review}</p>
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

