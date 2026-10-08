import { useEffect, useState } from "react";
import {
  getInventoryProducts,
  updateInventoryStock,
} from "../services/adminInventoryService";

function InventoryManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Stock modal states
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockValue, setStockValue] = useState("");
  const [updatingStock, setUpdatingStock] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInventoryProducts();

      // Handles common API response formats
      const productData = data.products || data.data || data;

      setProducts(Array.isArray(productData) ? productData : []);
    } catch (error) {
      console.error("Inventory fetch error:", error);
      setError(error.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        text: "Out of Stock",
        className: "bg-red-100 text-red-700",
      };
    }

    if (stock <= 5) {
      return {
        text: "Low Stock",
        className: "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      text: "In Stock",
      className: "bg-green-100 text-green-700",
    };
  };

  // Open stock modal
  const handleEditStock = (item) => {
    setSelectedItem(item);
    setStockValue(item.stock);
    setShowStockModal(true);
    setError("");
  };

  // Close stock modal
  const handleCloseStockModal = () => {
    setShowStockModal(false);
    setSelectedItem(null);
    setStockValue("");
  };

  // Update stock
  const handleUpdateStock = async () => {
    if (stockValue === "" || Number(stockValue) < 0) {
      setError("Stock cannot be negative");
      return;
    }

    try {
      setUpdatingStock(true);
      setError("");

      await updateInventoryStock(
        selectedItem.productId,
        selectedItem.size,
        Number(stockValue)
      );

      handleCloseStockModal();

      await fetchInventory();
    } catch (error) {
      console.error("Stock update error:", error);
      setError(error.message || "Failed to update stock");
    } finally {
      setUpdatingStock(false);
    }
  };

  // Convert products into individual variants
  const inventoryItems = products.flatMap((product) =>
    (product.variants || []).map((variant) => ({
      productId: product._id,
      name: product.name,
      brand: product.brand,
      size: variant.size,
      stock: variant.stock,
    }))
  );

  const lowStockCount = inventoryItems.filter(
    (item) => item.stock > 0 && item.stock <= 5
  ).length;

  const outOfStockCount = inventoryItems.filter(
    (item) => item.stock === 0
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Inventory Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage product stock and inventory
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        {/* Total Products */}
        <div className="bg-white border border-red-100 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Variants
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            {inventoryItems.length}
          </h2>
        </div>

        {/* Low Stock */}
        <div className="bg-white border border-red-100 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Low Stock
          </p>

          <h2 className="text-2xl font-bold text-yellow-600 mt-2">
            {lowStockCount}
          </h2>
        </div>

        {/* Out of Stock */}
        <div className="bg-white border border-red-100 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Out of Stock
          </p>

          <h2 className="text-2xl font-bold text-red-600 mt-2">
            {outOfStockCount}
          </h2>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-red-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Product Inventory
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              Loading inventory...
            </p>
          </div>
        ) : inventoryItems.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No inventory found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">

              <thead className="bg-red-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Brand
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Size
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {inventoryItems.map((item, index) => {
                  const status = getStockStatus(item.stock);

                  return (
                    <tr
                      key={`${item.productId}-${item.size}-${index}`}
                      className="hover:bg-red-50/40 transition"
                    >
                      {/* Product */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {item.name}
                        </p>
                      </td>

                      {/* Brand */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {item.brand}
                      </td>

                      {/* Size */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {item.size}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-900">
                          {item.stock}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex px-3 py-1 rounded-full
                            text-xs font-semibold
                            ${status.className}
                          `}
                        >
                          {status.text}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleEditStock(item)}
                          className="
                            px-4 py-2
                            rounded-lg
                            bg-[#d90416]
                            text-white
                            text-sm
                            font-medium
                            hover:bg-[#b90312]
                            transition
                          "
                        >
                          Edit Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Stock Modal */}
      {showStockModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">

            {/* Modal Header */}
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Update Stock
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Update stock for {selectedItem.name}
              </p>
            </div>

            {/* Product */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product
              </label>

              <input
                type="text"
                value={selectedItem.name}
                disabled
                className="
                  w-full px-4 py-3
                  border border-gray-200
                  rounded-lg
                  bg-gray-100
                  text-gray-500
                "
              />
            </div>

            {/* Size */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>

              <input
                type="text"
                value={selectedItem.size}
                disabled
                className="
                  w-full px-4 py-3
                  border border-gray-200
                  rounded-lg
                  bg-gray-100
                  text-gray-500
                "
              />
            </div>

            {/* Stock */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>

              <input
                type="number"
                min="0"
                value={stockValue}
                onChange={(e) => setStockValue(e.target.value)}
                className="
                  w-full px-4 py-3
                  border border-gray-200
                  rounded-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-red-200
                  focus:border-[#d90416]
                "
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={handleCloseStockModal}
                disabled={updatingStock}
                className="
                  px-4 py-2
                  rounded-lg
                  border border-gray-200
                  text-gray-600
                  hover:bg-gray-50
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateStock}
                disabled={updatingStock}
                className="
                  px-4 py-2
                  rounded-lg
                  bg-[#d90416]
                  text-white
                  hover:bg-[#b90312]
                  disabled:opacity-50
                "
              >
                {updatingStock ? "Updating..." : "Update Stock"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default InventoryManagement;