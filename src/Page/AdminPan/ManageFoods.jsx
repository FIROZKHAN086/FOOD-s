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
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-200 to-blue-50 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-lg shadow-2xl rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">Manage Foods</h2>
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition"
          >
            <FaPlus />
            Add Food
          </button>
        </div>

        <div className="overflow-auto rounded-md shadow-md border border-slate-200">
          <table className="min-w-full text-sm text-slate-700">
            <thead className="bg-slate-100">
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
                <tr key={food._id} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{food.name}</td>
                  <td className="px-6 py-4 capitalize">{food.category}</td>
                  <td className="px-6 py-4">${food.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        food.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {food.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(food)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(food._id)}
                      className="text-red-500 hover:text-red-700"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">
              {editingFood ? "Edit Food" : "Add New Food"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Category</option>
                <option value="pizza">Pizza</option>
                <option value="burger">Burger</option>
                <option value="sushi">Sushi</option>
                <option value="thali">Thali</option>
              </select>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="3"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="url"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isAvailable: e.target.checked,
                    })
                  }
                />
                <span>Available</span>
              </label>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingFood ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFoods;
