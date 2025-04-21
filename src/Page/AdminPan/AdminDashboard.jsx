import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUtensils,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
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
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
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
    <div className="min-h-screen font-[Poppins] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#1e1f4a] shadow-lg text-white p-4 flex justify-between items-center z-50 md:hidden">
        <h2 className="text-xl font-[Orbitron] tracking-wide">Admin Panel</h2>
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#1e1f4a] shadow-xl transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isMobile ? "pt-16" : ""}`}
      >
        <div className="p-6">
          {!isMobile && (
            <h2 className="text-2xl font-[Orbitron] text-teal-300 mb-8">Admin Panel</h2>
          )}
          <nav className="space-y-2">
            {[
              { to: "/admin", icon: <FaHome />, label: "Dashboard", key: "dashboard" },
              { to: "/admin/foods", icon: <FaUtensils />, label: "Manage Foods", key: "foods" },
              { to: "/admin/orders", icon: <FaClipboardList />, label: "Manage Orders", key: "orders" },
              { to: "/admin/analytics", icon: <FaChartBar />, label: "Analytics", key: "analytics" },
              { to: "/admin/settings", icon: <FaCog />, label: "Settings", key: "settings" },
            ].map(({ to, icon, label, key }) => (
              <Link
                key={key}
                to={to}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${
                  activeTab === key
                    ? "bg-gradient-to-r from-purple-600 to-indigo-500 shadow-lg"
                    : "hover:bg-white/10"
                }`}
              >
                {icon}
                {label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 mt-4 rounded-xl text-left bg-red-600/80 hover:bg-red-700 transition-all shadow-md"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
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
