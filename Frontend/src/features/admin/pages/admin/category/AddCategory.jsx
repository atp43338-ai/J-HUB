import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { createCategory } from "../../../services/adminCategoryService";

function AddCategory() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter category name");
      return;
    }

    try {
      await createCategory({
        name: name.trim(),
      });

      toast.success("Category added successfully");

      setName("");

      navigate("/admin/categories");
    } catch (error) {
      toast.error(error.message);
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />

          </div>

          {/* Add Category */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#d90416] hover:bg-[#b90312] text-white font-semibold transition"
          >
            Add Category
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddCategory;