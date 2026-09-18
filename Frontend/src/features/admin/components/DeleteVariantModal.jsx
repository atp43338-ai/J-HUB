function DeleteVariantModal({ variant, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80] p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">
            <span className="text-black">Delete </span>
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

        {/* Message */}
        <p className="text-gray-600 mb-2">
          Are you sure you want to delete this variant?
        </p>

        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-black font-semibold">
            Size: {variant.size}
          </p>

          <p className="text-gray-600 mt-1">
            Stock: {variant.stock}
          </p>
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
            type="button"
            onClick={onConfirm}
            className="px-6 py-3 rounded-lg bg-[#d90416] hover:bg-[#b90312] text-white font-semibold transition"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}

export default DeleteVariantModal;