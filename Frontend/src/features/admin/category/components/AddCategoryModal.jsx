import { useState } from "react";
import toast from "react-hot-toast";

import { createCategory } from "../services/adminCategoryService";

function AddCategoryModal({ onClose, onAdded }) {
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

      onAdded();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold">
            <span className="text-black">Add </span>
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
              Add Category
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddCategoryModal;