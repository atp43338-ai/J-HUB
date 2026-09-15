import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import {
  getCategories,
  deleteCategory,
} from "../../../services/adminCategoryService";

function CategoryManagement() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);

  const categoriesPerPage = 5;

  // Get Categories
  const fetchCategories = async () => {
    try {
      const data = await getCategories(
        currentPage,
        categoriesPerPage,
        search
      );

      setCategories(data.categories);
      setTotalPages(data.totalPages);
      setTotalCategories(data.totalCategories);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, search]);

  // Search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Delete
  const handleDelete = async () => {
    try {
      await deleteCategory(deleteCategoryId);

      toast.success("Category deleted successfully");

      setDeleteCategoryId(null);

      if (categories.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <span className="text-black">Category </span>
            <span className="text-[#d90416]">Management</span>
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your product categories
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/categories/add")}
          className="bg-[#d90416] hover:bg-[#b90312] text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          + Add Category
        </button>

      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

        <div className="relative max-w-md">

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search category"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 outline-none focus:border-[#d90416]"
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>
          )}

        </div>

      </div>

      {/* Category Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b bg-gray-50">

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Category Name
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Created At
                </th>

                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr
                    key={category._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      <p className="font-semibold text-black">
                        {category.name}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(category.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex items-center justify-center gap-3">

                        <button
                          onClick={() =>
                            navigate(
                              `/admin/categories/edit/${category._id}`
                            )
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            setDeleteCategoryId(category._id)
                          }
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No categories found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">

        <p className="text-sm text-gray-500">
          Showing {categories.length} of {totalCategories} categories
        </p>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

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

          <button
            type="button"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteCategoryId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">

            <h2 className="text-xl font-bold text-black">
              Delete Category
            </h2>

            <p className="text-gray-600 mt-3">
              Are you sure you want to delete this category?
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={() => setDeleteCategoryId(null)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="button"
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
}

export default CategoryManagement;