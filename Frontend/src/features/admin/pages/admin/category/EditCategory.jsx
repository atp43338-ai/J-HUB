import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

import {
  getCategoryById,
  updateCategory,
} from "../../../services/adminCategoryService";

function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");

  // Get Category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const category = await getCategoryById(id);

        setName(category.name);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchCategory();
  }, [id]);

  // Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter category name");
      return;
    }

    try {
      await updateCategory(id, {
        name: name.trim(),
      });

      toast.success("Category updated successfully");

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
          <span className="text-black">Edit </span>
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

          {/* Update Category */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#d90416] hover:bg-[#b90312] text-white font-semibold transition"
          >
            Update Category
          </button>

        </form>

      </div>

    </div>
  );
}

export default EditCategory;