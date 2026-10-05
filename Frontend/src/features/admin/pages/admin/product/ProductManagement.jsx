import { useEffect, useState } from "react";

import {
  getProducts,
  updateProductStatus,
  deleteProduct,
} from "../../../services/adminProductService";

import toast from "react-hot-toast";

// import AdminMenu from "../../../components/AdminMenu";

import AddProductModal from "../../../components/AddProductModal";
import EditProductModal from "../../../components/EditProductModal";
import VariantManagementModal from "../../../components/VariantManagementModal";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);

  const [editProductId, setEditProductId] = useState(null);

  const [variantProductId, setVariantProductId] = useState(null);

  // Permanent delete popup
  const [deleteProductData, setDeleteProductData] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0);

  const productsPerPage = 5;

  // Fetch products
  const fetchProducts = async () => {
    try {
      const data = await getProducts(
        currentPage,
        productsPerPage
      );

      setProducts(data.products);

      setTotalPages(data.totalPages);

      setTotalProducts(data.totalProducts);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // Change product active/inactive status
  const handleStatusChange = async (product) => {
    try {
      const newStatus = !product.isListed;

      await updateProductStatus(
        product._id,
        newStatus
      );

      toast.success(
        newStatus
          ? "Product activated successfully"
          : "Product deactivated successfully"
      );

      fetchProducts();
    } catch (error) {
      console.error("Status update error:", error);

      toast.error(
        error.message || "Failed to update product status"
      );
    }
  };

  // Open permanent delete popup
  const handleDeleteClick = (product) => {
    setDeleteProductData(product);
  };

  // Close permanent delete popup
  const handleDeleteCancel = () => {
    setDeleteProductData(null);
  };

  // Permanently delete product
  const handlePermanentDelete = async () => {
    if (!deleteProductData) return;

    try {
      await deleteProduct(deleteProductData._id);

      toast.success("Product permanently deleted");

      // Close popup
      setDeleteProductData(null);

      // Refresh products
      fetchProducts();
    } catch (error) {
      console.error("Permanent delete error:", error);

      toast.error(
        error.message || "Failed to permanently delete product"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* <AdminMenu /> */}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">
            <span className="text-black">
              Product{" "}
            </span>

            <span className="text-[#d90416]">
              Management
            </span>
          </h1>

          <p className="text-black mt-1">
            Manage your products
          </p>
        </div>

        {/* Add Product */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#d90416] hover:bg-[#b90312] text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          + Add Product
        </button>

      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b bg-gray-50">

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Image
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Product
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Brand
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Collection
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Price
                </th>

                {/* Status */}
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">
                  Status
                </th>

                {/* Actions */}
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {products.map((product) => (

                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50"
                >

                  {/* Image */}
                  <td className="px-6 py-4">

                    <img
                      src={`http://localhost:5000${product.images?.[0]}`}
                      alt={product.name}
                      className="w-16 h-16 object-contain rounded-lg bg-gray-100"
                    />

                  </td>

                  {/* Product */}
                  <td className="px-6 py-4">

                    <p className="font-semibold text-black">
                      {product.name}
                    </p>

                  </td>

                  {/* Brand */}
                  <td className="px-6 py-4 text-gray-600">
                    {product.brand}
                  </td>

                  {/* Collection */}
                  <td className="px-6 py-4">

                    <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                      {product.collection || "N/A"}
                    </span>

                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 font-semibold text-black">
                    ₹{product.price}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.isListed
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {product.isListed
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">

                    <div className="grid grid-cols-2 gap-2 w-[190px] mx-auto">

                      {/* Variant */}
                      <button
                        onClick={() =>
                          setVariantProductId(product._id)
                        }
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                      >
                        Variant
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() =>
                          setEditProductId(product._id)
                        }
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                      >
                        Edit
                      </button>

                      {/* Active / Inactive */}
                      <button
                        onClick={() =>
                          handleStatusChange(product)
                        }
                        className={`w-full px-2 py-2 rounded-lg text-sm font-medium transition ${
                          product.isListed
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {product.isListed
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      {/* Permanent Delete */}
                      <button
                        onClick={() =>
                          handleDeleteClick(product)
                        }
                        className="w-full px-2 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">

        {/* Product count */}
        <p className="text-sm text-gray-500">
          Showing {products.length} of {totalProducts} products
        </p>

        {/* Pagination buttons */}
        <div className="flex items-center gap-2">

          {/* Previous */}
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
            className={`px-4 py-2 border border-gray-300 rounded-lg text-sm transition ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (

            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg text-sm ${
                currentPage === page
                  ? "bg-[#d90416] text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>

          ))}

          {/* Next */}
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
            className={`px-4 py-2 border border-gray-300 rounded-lg text-sm transition ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Next
          </button>

        </div>

      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            setShowAddModal(false);
            fetchProducts();
          }}
        />
      )}

      {/* Edit Product Modal */}
      {editProductId && (
        <EditProductModal
          productId={editProductId}
          onClose={() => setEditProductId(null)}
          onUpdated={() => {
            setEditProductId(null);
            fetchProducts();
          }}
        />
      )}

      {/* Variant Modal */}
      {variantProductId && (
        <VariantManagementModal
          productId={variantProductId}
          onClose={() => setVariantProductId(null)}
        />
      )}

      {/* ================================================= */}
      {/* PERMANENT DELETE CONFIRMATION POPUP */}
      {/* ================================================= */}

      {deleteProductData && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">

            {/* Popup Header */}
            <div className="flex items-center gap-4 mb-5">

              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14"
                  />
                </svg>

              </div>

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Delete Product
                </h2>

                <p className="text-sm text-gray-500">
                  Permanent action
                </p>

              </div>

            </div>

            {/* Popup Message */}
            <div className="mb-6">

              <p className="text-gray-700 leading-6">
                Are you sure you want to permanently delete
                {" "}
                <span className="font-semibold text-black">
                  "{deleteProductData.name}"
                </span>
                ?
              </p>

              <p className="text-sm text-red-600 mt-3">
                This action cannot be undone. The product will be
                permanently removed from the database.
              </p>

            </div>

            {/* Popup Buttons */}
            <div className="flex justify-end gap-3">

              {/* Cancel */}
              <button
                type="button"
                onClick={handleDeleteCancel}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              {/* Confirm Delete */}
              <button
                type="button"
                onClick={handlePermanentDelete}
                className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default ProductManagement;