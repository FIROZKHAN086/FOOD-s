import { FaShoppingCart, FaUser } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-br from-green-500 via-yellow-100 to-white shadow-md px-6 py-4">
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
          <FaShoppingCart className="hover:text-green-600 cursor-pointer transition" />
          <FaUser className="hover:text-green-600 cursor-pointer transition" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
