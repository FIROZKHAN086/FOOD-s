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
      toast.error("Failed to fetch foods");
      setLoading(false);
    }
  };

  const handleAddFood = async () => {
    try {
      await axios.post(`${url}/api/foods`, formData);
      toast.success("Food added successfully");
      fetchFoods();
    } catch (error) {
      toast.error("Failed to add food");
    }
  };

  const handleEditFood = async () => {
    try {
      await axios.put(`${url}/api/foods/${editingFood._id}`, formData);
      toast.success("Food updated successfully");
      fetchFoods();
    } catch (error) {
      toast.error("Failed to update food");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingFood) {
      await handleEditFood();
    } else {
      await handleAddFood();
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
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData({ ...food });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        await axios.delete(`${url}/api/foods/${id}`);
        toast.success("Food deleted successfully");
        fetchFoods();
      } catch (error) {
        toast.error("Failed to delete food");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gray-100 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-purple-700">Manage Foods</h2>
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
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus />
            Add Food
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left border">
            <thead className="bg-purple-100 text-purple-800">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id} className="border-t hover:bg-purple-50">
                  <td className="p-3">
                    <img src={food.image} alt={food.name} className="w-12 h-12 rounded" />
                  </td>
                  <td className="p-3">{food.name}</td>
                  <td className="p-3">{food.category}</td>
                  <td className="p-3">${food.price}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        food.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {food.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(food)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(food._id)}
                      className="text-red-600 hover:text-red-800"
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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              {editingFood ? "Edit Food" : "Add Food"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Food Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
              ></textarea>
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                />
                Available
              </label>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {editingFood ? "Update" : "Add"} Food
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
