import { useState } from "react";
import toast from "react-hot-toast";
import { updateVariant } from "../services/adminProductService";

function EditVariantModal({
  productId,
  variant,
  onClose,
  onUpdated,
}) {
  const [size, setSize] = useState(variant.size || "");
  const [stock, setStock] = useState(variant.stock ?? "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!size) {
      toast.error("Please select a size");
      return;
    }

    if (stock === "") {
      toast.error("Please enter stock");
      return;
    }

    if (Number(stock) < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    try {
      await updateVariant(productId, variant._id, {
        size,
        stock: Number(stock),
      });

      toast.success("Variant updated successfully");

      onUpdated();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            <span className="text-black">Edit </span>
            <span className="text-[#d90416]">Variant</span>
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

          {/* Size */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>

            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            >
              <option value="">Select Size</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          {/* Stock */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock
            </label>

            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter stock"
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
              Update Variant
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditVariantModal;