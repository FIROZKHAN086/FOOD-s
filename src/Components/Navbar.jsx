import { FaShoppingCart, FaUser, FaSignOutAlt, FaClipboardList, FaCog, FaHome, FaStore, FaPhoneAlt, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useFoodContext } from "../Context/Context";
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";

const Navbar = ({ setAuth, IsAdmin }) => {
  const { cart } = useFoodContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const auth = getAuth();


  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      setIsDropdownOpen(false);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error('Error signing out');
    }
  };

  return (
    <nav className="fixed top-0 font-open-sans left-0 right-0 z-10 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 shadow-lg px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-white tracking-wider hover:text-pink-300 transition-all duration-300">
          FoodieHub
        </Link>

        {/* Center Nav Links */}
        <ul className="hidden md:flex gap-8 text-white font-medium">
          <li className="relative group cursor-pointer">
            <Link to="/" className="hover:text-[#0f184b] transition-all duration-300">
              Home
            </Link>
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#0f184b] group-hover:w-full transition-all duration-300"></span>
           
          </li>
          <li className="relative group cursor-pointer">
            <Link to="/" className="hover:text-[#0f184b] transition-all duration-300">
              Shop
            </Link>
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#0f184b] group-hover:w-full transition-all duration-300"></span>
            
          </li>
          <li className="relative group cursor-pointer">
            <Link to="/about" className="hover:text-[#0f184b] transition-all duration-300">
              About
            </Link>
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#0f184b] group-hover:w-full transition-all duration-300"></span>
            
          </li>
          <li className="relative group cursor-pointer">
            <Link to="/contact" className="hover:text-[#0f184b] transition-all duration-300">
              Contact
            </Link>
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#0f184b] group-hover:w-full transition-all duration-300"></span>
            
          </li>
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-4 text-white text-xl">
          <div className="relative flex items-center gap-2">
          <Link to="/cart" className="hover:text-pink-400 sm:ml-2 flex items-center gap-1 cursor-pointer transition-all duration-300">
            <FaShoppingCart />
            <span className="text-lg font-medium">{cart.length}</span>
          </Link>
          
          <Link to="/notification" className="hover:text-pink-400 flex items-center gap-1 cursor-pointer transition-all duration-300">
            <FaBell/>
            
          </Link>
          </div>
          {IsAdmin && (
            <Link to="/admin">
              <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-all duration-300 shadow-lg transform hover:scale-105">
                Admin
              </button>
            </Link>
          )}

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`${auth.currentUser ? 'hover:text-purple-500 cursor-pointer transition-all duration-300 flex items-center gap-2 bg-[#0f184b] text-white px-4 py-2 rounded-lg hover:shadow-lg' : 'hover:text-pink-400 cursor-pointer transition-all duration-300 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:shadow-lg'} `}
            >
              <FaUser className="text-xl" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gradient-to-r from-teal-400 to-blue-500 backdrop-blur-lg rounded-lg shadow-xl py-2 border border-white/20"
                onClick={() => setIsDropdownOpen(false)}
              >
                {auth.currentUser ? (
                  <>
                    <Link
                      to="/myorders"
                      className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 transition-all duration-300"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaClipboardList className="text-teal-400" />
                      My Orders
                    </Link>
                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 transition-all duration-300"
                    >
                      <FaCog className="text-blue-300" />
                      Manage Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-white/20 transition-all duration-300"
                    >
                      <FaSignOutAlt className="text-pink-600" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setAuth(true)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <FaUser className="text-purple-600" />
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
