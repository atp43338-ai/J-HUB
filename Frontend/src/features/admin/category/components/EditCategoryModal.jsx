import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getCategoryById,
  updateCategory,
} from "../services/adminCategoryService";

function EditCategoryModal({
  categoryId,
  onClose,
  onUpdated,
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  // Get Category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);

        const category = await getCategoryById(
          categoryId
        );

        setName(category.name || "");
      } catch (error) {
        toast.error(error.message);
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, onClose]);

  // Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter category name");
      return;
    }

    try {
      await updateCategory(categoryId, {
        name: name.trim(),
      });

      toast.success(
        "Category updated successfully"
      );

      onUpdated();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

        <div className="bg-white rounded-xl p-8 shadow-xl">

          <p className="text-gray-600">
            Loading category...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold">

            <span className="text-black">
              Edit{" "}
            </span>

            <span className="text-[#d90416]">
              Category
            </span>

          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-[#d90416] transition"
          >
            ×
          </button>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Category Name */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter category name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[#d90416] hover:bg-[#b90312] text-white font-semibold transition"
            >
              Update Category
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditCategoryModal;
