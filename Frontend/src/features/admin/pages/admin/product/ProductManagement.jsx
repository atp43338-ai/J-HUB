import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  getProducts,
  deleteProduct,
} from "../../../services/adminProductService";
import toast from "react-hot-toast";

const ProductManagement = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [deleteProductId, setDeleteProductId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const productsPerPage = 5;

  // Fetch products
  useEffect(() => {
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

    fetchProducts();
  }, [currentPage]);

  // Delete product
  const handleDelete = async () => {
    try {
      await deleteProduct(deleteProductId);

      toast.success("Product deleted successfully");

      setDeleteProductId(null);

      // Refresh current page
      const data = await getProducts(
        currentPage,
        productsPerPage
      );

      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalProducts(data.totalProducts);

      // If current page becomes empty,
      // go back to previous page
      if (data.products.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Delete product error:", error);

      toast.error(error.message || "Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">
            <span className="text-black">Product </span>
            <span className="text-[#d90416]">Management</span>
          </h1>

          <p className="!text-black-500 mt-1">
            Manage your products
          </p>

        </div>

        <button
          onClick={() => navigate("/admin/products/add")}
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

                  {/* Actions */}
                  <td className="px-6 py-4">

                    <div className="flex items-center justify-center gap-3">

                      {/* Edit */}
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/products/edit/${product._id}`
                          )
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                      >
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          setDeleteProductId(product._id)
                        }
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
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

      {/* Delete Confirmation Modal */}
      {deleteProductId && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">

            <h2 className="text-xl font-bold !text-black">
              Delete Product
            </h2>

            <p className="text-gray-600 mt-3">
              Are you sure you want to delete this product?
            </p>

            <div className="flex justify-end gap-3 mt-6">

              {/* Cancel */}
              <button
                onClick={() => setDeleteProductId(null)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              {/* Confirm Delete */}
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 bg-[#d90416] text-white rounded-lg font-medium hover:bg-[#b90312] transition"
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