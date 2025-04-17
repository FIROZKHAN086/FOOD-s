import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUtensils, FaClipboardList, FaChartBar, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const path = location.pathname.split("/")[2] || "dashboard";
    setActiveTab(path);
  }, [location]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear user data from localStorage
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to logout");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#0d143d] text-white p-4 flex justify-between items-center z-50 md:hidden">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button onClick={toggleSidebar} className="text-white hover:bg-white/10 p-2 rounded-lg transition-all">
          <FaBars size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-[#0d143d] text-white transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isMobile ? "pt-16" : ""}`}
      >
        <div className="p-6">
          {!isMobile && <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>}
          <nav className="space-y-2">
            <Link
              to="/admin"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeTab === "dashboard" ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <FaHome />
              Dashboard
            </Link>
            <Link
              to="/admin/foods"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeTab === "foods" ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <FaUtensils />
              Manage Foods
            </Link>
            <Link
              to="/admin/orders"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeTab === "orders" ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <FaClipboardList />
              Manage Orders
            </Link>
            <Link
              to="/admin/analytics"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeTab === "analytics" ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <FaChartBar />
              Analytics
            </Link>
            <Link
              to="/admin/settings"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeTab === "settings" ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <FaCog />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all text-left"
            >
              <FaSignOutAlt/>
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        } ${isMobile ? "pt-16" : ""}`}
      >
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;