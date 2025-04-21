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
      setcomeReviews(response.data.data);
    } catch (error) {
      toast.error("Failed to load reviews");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) return toast.error("Please login to submit a review");
    if (!name.trim()) return toast.error("Please enter your name");
    if (rating === 0) return toast.error("Please select a rating");
    if (review.trim().length < 10) return toast.error("Review must be at least 10 characters");

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
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white px-4 sm:px-6 md:px-10 pt-20">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1e1e1e] rounded-3xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 via-indigo-700 to-blue-800 px-4 py-10 sm:px-8 sm:py-14 text-center rounded-t-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">User Reviews</h1>
          <p className="text-sm sm:text-base mt-2 text-white/70">Share your experience with us.</p>
        </div>
  
        {/* Review Form */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="text-white font-semibold text-sm">Your Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
  
              <div className="flex-1">
                <label className="text-white font-semibold text-sm">Rating</label>
                <div className="flex gap-2 items-center p-3 bg-[#2a2a2a] rounded-xl border border-gray-700">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <motion.label
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <input
                          type="radio"
                          className="hidden"
                          value={ratingValue}
                          onClick={() => setRating(ratingValue)}
                        />
                        <FaStar
                          size={24}
                          color={ratingValue <= (hover || rating) ? "#facc15" : "#444"}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(0)}
                          className="cursor-pointer"
                        />
                      </motion.label>
                    );
                  })}
                </div>
              </div>
            </div>
  
            <div>
              <label className="text-white font-semibold text-sm">Your Review</label>
              <textarea
                rows="4"
                className="w-full px-4 py-3 rounded-xl bg-[#2a2a2a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                placeholder="Write your feedback here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
  
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full bg-gradient-to-r from-purple-700 to-blue-600 text-white font-bold py-3 rounded-xl transition-all ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </motion.button>
          </form>
        </div>
  
        {/* Reviews Display */}
        <div className="p-4 sm:p-6 md:p-8 bg-[#181818] rounded-b-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">User Feedback</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {comereviews.map((review, index) => (
              <motion.div
                key={review._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#242424] p-5 sm:p-6 rounded-2xl border border-gray-700 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-purple-700 to-blue-600 p-3 rounded-full text-white">
                      <FaUser />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">{review.userName}</h3>
                      <div className="flex gap-1 text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <FaStar key={i} size={14} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 flex items-center">
                    <FaClock className="mr-1" />
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-300">{review.review}</p>
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
