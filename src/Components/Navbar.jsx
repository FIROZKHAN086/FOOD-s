import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaCog,
  FaHome,
  FaStore,
  FaPhoneAlt,
  FaBell,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useFoodContext } from "../Context/Context";
import { useEffect, useState } from "react";
import { getAuth, signOut ,onAuthStateChanged } from "firebase/auth";
import { toast } from "react-hot-toast";

const Navbar = ({ setAuth, IsAdmin }) => {
  const { cart } = useFoodContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      setIsDropdownOpen(false);
      window.location.reload();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };


  const navLinks = [
    { label: "Home", to: "/", icon: <FaHome /> },
    { label: "Shop", to: "/", icon: <FaStore /> },
    { label: "About", to: "/aboutPage", icon: <FaClipboardList /> },
    { label: "Contact", to: "/contact", icon: <FaPhoneAlt /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 text-white shadow-lg px-4 py-3 animate-fadeIn">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl flex font-bold tracking-wider hover:text-yellow-200 transition-all duration-300"
        >
          <span className="hidden md:block">🍔</span> FoodieHub
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-2xl focus:outline-none"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 text-lg font-medium">
          {navLinks.map((link) => (
            <li key={link.label} className="relative group cursor-pointer">
              <Link
                to={link.to}
                className="hover:text-yellow-200 transition-all duration-300 flex items-center gap-1"
              >
                {link.label}
              </Link>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </li>
          ))}
        </ul>

        {/* Icons & User */}
        <div className="flex items-center gap-4 text-xl">
          <Link to="/cart" className="relative hover:text-yellow-200 transition">
            <FaShoppingCart className="animate-pulse" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-red-500 text-xs font-bold px-1 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          <Link to="/notification" className="hover:text-yellow-200">
            <FaBell className="animate-bounce" />
          </Link>

          {IsAdmin && (
            <Link to="/admin">
              <button className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-lg hover:bg-yellow-500 transition-all duration-300">
                Admin
              </button>
            </Link>
          )}

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onMouseEnter={()=>setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white text-black px-3 py-1 rounded-full flex items-center gap-2 hover:shadow-lg transition"
            >
              <FaUser />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-lg shadow-xl py-2 z-50 animate-fadeIn">
                {user ? (
                  <>
                    <Link
                      to="/myorders"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                    >
                      <FaClipboardList /> My Orders
                    </Link>
                    <Link
                    onClick={() => setIsDropdownOpen(false)}
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                    >
                      <FaCog /> Manage Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 transition"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setAuth(true)}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 transition"
                  >
                    <FaUser className="text-purple-600" /> Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <ul className="md:hidden mt-4 bg-white/20 backdrop-blur-md p-4 rounded-lg space-y-3 text-white font-semibold">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className="block hover:text-yellow-200 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
