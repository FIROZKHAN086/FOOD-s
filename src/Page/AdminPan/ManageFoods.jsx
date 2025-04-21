import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFoodContext } from "../../Context/Context";
import { FaEdit, FaTrash, FaPlus, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";

const ManageFoods = () => {
  const { url } = useFoodContext();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
    isAvailable: true,
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${url}/api/foods`);
      setFoods(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching foods:", error);
      toast.error("Failed to fetch foods");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        await axios.put(`${url}/api/foods/${editingFood._id}`, formData);
        toast.success("Food updated successfully");
      } else {
        await axios.post(`${url}/api/foods`, formData);
        toast.success("Food added successfully");
      }
      setIsModalOpen(false);
      setEditingFood(null);
      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
        image: "",
        isAvailable: true,
      });
      fetchFoods();
    } catch (error) {
      console.error("Error saving food:", error);
      toast.error("Failed to save food");
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData({ ...food });
    setIsModalOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        await axios.delete(`${url}/api/foods/${id}`);
        toast.success("Food deleted successfully");
        fetchFoods();
      } catch (error) {
        console.error("Error deleting food:", error);
        toast.error("Failed to delete food");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-slate-100">
        <FaSpinner className="animate-spin text-5xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-indigo-100 via-purple-50 to-white px-4 py-10 font-sans">
  <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-6 transition-all duration-300">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <h2 className="text-4xl font-bold text-indigo-800 tracking-tight">
        🍽️ Manage Foods
      </h2>
      <button
        onClick={() => {
          setEditingFood(null);
          setFormData({
            name: "",
            price: "",
            category: "",
            description: "",
            image: "",
            isAvailable: true,
          });
          setIsModalOpen(true);
        }}
        className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-lg transition"
      >
        <FaPlus className="text-white" />
        <span className="text-sm font-semibold">Add Food</span>
      </button>
    </div>

    <div className="overflow-x-auto rounded-lg shadow-md border border-indigo-100">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-indigo-50 text-indigo-700">
          <tr>
            <th className="text-left px-6 py-3">Image</th>
            <th className="text-left px-6 py-3">Name</th>
            <th className="text-left px-6 py-3">Category</th>
            <th className="text-left px-6 py-3">Price</th>
            <th className="text-left px-6 py-3">Status</th>
            <th className="text-left px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {foods.map((food) => (
            <tr
              key={food._id}
              className="border-t border-gray-100 hover:bg-indigo-50/30 transition"
            >
              <td className="px-6 py-4">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-14 h-14 object-cover rounded-md shadow-sm"
                />
              </td>
              <td className="px-6 py-4 font-semibold text-indigo-800">
                {food.name}
              </td>
              <td className="px-6 py-4 capitalize text-indigo-700">
                {food.category}
              </td>
              <td className="px-6 py-4">${food.price}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    food.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {food.isAvailable ? "Available" : "Unavailable"}
                </span>
              </td>
              <td className="px-6 py-4 flex gap-4 items-center">
                <button
                  onClick={() => handleEdit(food)}
                  className="text-indigo-600 hover:text-indigo-800 transition"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(food._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

  );
};

export default ManageFoods;
