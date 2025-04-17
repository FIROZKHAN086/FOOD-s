import { FaShoppingCart, FaUser, FaSignOutAlt, FaClipboardList, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useFoodContext } from "../Context/Context";
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";

const Navbar = ({ setAuth }) => {
  const { cart } = useFoodContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-green-600 via-yellow-200 to-white shadow-md px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800">FoodieHub</div>

        {/* Center Nav Links */}
        <ul className="hidden md:flex gap-8 text-gray-600 font-medium">
          {["Home", "Shop", "About", "Contact"].map((item, idx) => (
            <li
              key={idx}
              className="group relative cursor-pointer transition text-gray-600 hover:text-green-600"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-6 text-gray-600 text-xl">
          <Link to="/cart" className="hover:text-green-600 flex items-center gap-2 cursor-pointer transition">
            <FaShoppingCart />
            <span className="text-gray-800 font-medium">{cart.length}</span>
          </Link>
          
          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              
              className={`${auth.currentUser ? 'hover:text-purple-500 cursor-pointer transition-all duration-300 flex items-center gap-2 bg-[#0d143d] text-white px-4 py-2 rounded-lg hover:shadow-lg' : 'hover:text-green-600 cursor-pointer transition-all duration-300 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:shadow-lg '} `}
            >
              <FaUser className="text-xl" />
              {/* {auth.currentUser && (
                <span className="text-sm font-medium">
                  {auth.currentUser.displayName || auth.currentUser.email}
                </span>
              )} */}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-lg rounded-lg shadow-xl py-2 border border-white/20">
                {auth.currentUser ? (
                  <>
                    <Link
                      to="/my-orders"
                      className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-white/20 transition-all duration-300"
                    >
                      <FaClipboardList className="text-purple-600" />
                      My Orders
                    </Link>
                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-white/20 transition-all duration-300"
                    >
                      <FaCog className="text-indigo-600" />
                      Manage Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-gray-800 hover:bg-white/20 transition-all duration-300"
                    >
                      <FaSignOutAlt className="text-pink-600" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setAuth(true)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-800 hover:bg-white/20 transition-all duration-300"
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
