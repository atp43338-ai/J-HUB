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

  const getStatusBadge = (stock) => {
    const qty = Number(stock) || 0;
    if (qty > 5) {
      return (
        <span className="inline-flex items-center bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
          In Stock
        </span>
      );
    }
    if (qty > 0) {
      return (
        <span className="inline-flex items-center bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-semibold">
          Low Stock
        </span>
      );
    }
    return (
      <span className="inline-flex items-center bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold">
        Out of Stock
      </span>
    );
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
            className="text-2xl text-gray-500 hover:text-[#d90416] transition cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Add Variant Button */}
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={() => setShowAddVariant(true)}
            className="px-5 py-3 bg-[#d90416] hover:bg-[#b90312] text-white rounded-lg font-semibold transition cursor-pointer"
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
            <div className="overflow-x-auto">
              <div className="min-w-[480px]">
                {/* Table Header */}
                <div className="grid grid-cols-4 bg-gray-100 px-4 py-3 font-semibold text-black items-center">
                  <span>Size</span>
                  <span>Stock</span>
                  <span>Status</span>
                  <span className="text-center">Actions</span>
                </div>

                {/* Variants */}
                {variants.map((variant) => (
                  <div
                    key={variant._id}
                    className="grid grid-cols-4 px-4 py-4 border-t border-gray-200 items-center"
                  >
                    <span className="font-medium text-black">
                      {variant.size}
                    </span>

                    <span className="text-gray-700 font-medium">
                      {variant.stock}
                    </span>

                    <div>
                      {getStatusBadge(variant.stock)}
                    </div>

                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditVariant(variant)}
                        className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition cursor-pointer text-sm"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteVariantItem(variant)}
                        className="px-3 py-2 rounded-lg bg-[#d90416] text-white hover:bg-[#b90312] transition cursor-pointer text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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