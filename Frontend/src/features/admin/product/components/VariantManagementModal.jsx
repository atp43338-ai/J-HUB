import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddVariantModal from "./AddVariantModal";
import { getVariants, deleteVariant } from "../services/adminProductService";
import EditVariantModal from "./EditVariantModal";
import DeleteVariantModal from "../../components/DeleteVariantModal";

function VariantManagementModal({ productId, onClose }) {
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editVariant, setEditVariant] = useState(null);
  const [deleteVariantItem, setDeleteVariantItem] = useState(null);

  const fetchVariants = async () => {
    try {
      setLoading(true);

      const data = await getVariants(productId);

      setVariants(data.variants || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

 const handleDeleteVariant = async (variantId) => {
  try {
    await deleteVariant(productId, variantId);

    toast.success("Variant deleted successfully");

    setDeleteVariantItem(null);

    fetchVariants();
  } catch (error) {
    toast.error(error.message);
  }
};

  useEffect(() => {
    fetchVariants();
  }, [productId]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            <span className="text-black">Product </span>
            <span className="text-[#d90416]">Variants</span>
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-[#d90416] transition"
          >
            ×
          </button>
        </div>

        {/* Add Variant Button */}
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={() => setShowAddVariant(true)}
            className="px-5 py-3 bg-[#d90416] hover:bg-[#b90312] text-white rounded-lg font-semibold transition"
          >
            + Add Variant
          </button>
        </div>

        {/* Variants */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">

          {loading ? (
            <p className="p-6 text-center text-gray-500">
              Loading variants...
            </p>
          ) : variants.length === 0 ? (
            <p className="p-6 text-center text-gray-500">
              No variants added yet.
            </p>
          ) : (
            <div>
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-gray-100 px-4 py-3 font-semibold text-black">
                <span>Size</span>
                <span>Stock</span>
                <span className="text-center">Actions</span>
              </div>

              {/* Variants */}
              {variants.map((variant) => (
                <div
                  key={variant._id}
                  className="grid grid-cols-3 px-4 py-4 border-t border-gray-200 items-center"
                >
                  <span className="font-medium text-black">
                    {variant.size}
                  </span>

                  <span className="text-gray-700">
                    {variant.stock}
                  </span>

                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditVariant(variant)}
                      className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteVariantItem(variant)}
                      className="px-3 py-2 rounded-lg bg-[#d90416] text-white hover:bg-[#b90312] transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Add Variant Modal */}
      {showAddVariant && (
        <AddVariantModal
          productId={productId}
          onClose={() => setShowAddVariant(false)}
          onAdded={() => {
            setShowAddVariant(false);
            fetchVariants();
          }}
        />
      )}

      {editVariant && (
  <EditVariantModal
    productId={productId}
    variant={editVariant}
    onClose={() => setEditVariant(null)}
    onUpdated={() => {
      setEditVariant(null);
      fetchVariants();
    }}
  />
)}


{deleteVariantItem && (
  <DeleteVariantModal
    variant={deleteVariantItem}
    onClose={() => setDeleteVariantItem(null)}
    onConfirm={() => handleDeleteVariant(deleteVariantItem._id)}
  />
)}
    </div>
  );
}

export default VariantManagementModal;