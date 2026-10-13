import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { createCategory } from "../services/adminCategoryService";

function AddCategory() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Please enter category name");
      return;
    }

    try {
      setLoading(true);
      await createCategory({
        name: trimmedName,
      });

      toast.success("Category added successfully");
      setName("");
      navigate("/admin/categories");
    } catch (error) {
      // Extract backend error message (handles Axios/fetch standard responses)
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "";

      // Check if the error indicates a duplicate/already existing category
      if (
        serverMessage.toLowerCase().includes("duplicate") ||
        serverMessage.toLowerCase().includes("already exist") ||
        error.response?.status === 409
      ) {
        toast.error("Category name already exists! Please use a unique name.");
      } else {
        toast.error(serverMessage || "Failed to add category");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">
          <span className="text-black">Add </span>
          <span className="text-[#d90416]">Category</span>
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Category Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416] disabled:bg-gray-100"
            />
          </div>

          {/* Add Category */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#d90416] hover:bg-[#b90312] text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCategory;