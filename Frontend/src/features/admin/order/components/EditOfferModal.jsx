import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateOffer } from "../../offer/services/adminOfferService";

function EditOfferModal({ offer, onClose, onUpdated }) {
  const [offerType, setOfferType] = useState(offer?.type || "Product");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: offer?.name || "",
    targetId: offer?.targetId?._id || offer?.targetId || "",
    discount: offer?.discount || "",
    startDate: offer?.startDate
      ? new Date(offer.startDate).toISOString().split("T")[0]
      : "",
    endDate: offer?.endDate
      ? new Date(offer.endDate).toISOString().split("T")[0]
      : "",
    status: offer?.status ?? true,
  });

  // FETCH PRODUCTS
  useEffect(() => {
    if (offerType !== "Product") return;

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        const response = await fetch(
          "http://localhost:5000/api/products?page=1&limit=100"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch products"
          );
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error("Fetch products error:", error);
        toast.error("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [offerType]);

  // FETCH CATEGORIES
  useEffect(() => {
    if (offerType !== "Category") return;

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const adminToken = localStorage.getItem("adminToken");

        const response = await fetch(
          "http://localhost:5000/api/admin/categories",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch categories"
          );
        }

        setCategories(data.categories || []);
      } catch (error) {
        console.error("Fetch categories error:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [offerType]);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // CHANGE OFFER TYPE
  const handleOfferTypeChange = (type) => {
    setOfferType(type);

    setFormData((prev) => ({
      ...prev,
      targetId: "",
    }));
  };

  // UPDATE OFFER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Offer name is required");
      return;
    }

    if (!formData.targetId) {
      toast.error(
        `Please select a ${offerType.toLowerCase()}`
      );
      return;
    }

    if (!formData.discount) {
      toast.error("Discount is required");
      return;
    }

    const discount = Number(formData.discount);

    if (
      !Number.isFinite(discount) ||
      discount < 1 ||
      discount > 100
    ) {
      toast.error("Discount must be between 1% and 100%");
      return;
    }

    if (!formData.startDate) {
      toast.error("Start date is required");
      return;
    }

    if (!formData.endDate) {
      toast.error("End date is required");
      return;
    }

    if (formData.endDate < formData.startDate) {
      toast.error("End date cannot be before start date");
      return;
    }

    try {
      setLoading(true);

      const offerData = {
        name: formData.name.trim(),
        type: offerType,
        targetId: formData.targetId,
        discount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      };

      await updateOffer(offer._id, offerData);

      toast.success("Offer updated successfully");

      onUpdated();
      onClose();
    } catch (error) {
      console.error("Update offer error:", error);

      toast.error(
        error.message || "Failed to update offer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[105] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="bg-white px-6 py-5 flex items-center justify-between shrink-0 border-b border-gray-100">

          <div>
            <h2 className="text-xl font-bold text-black">
              Edit Offer
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Update your product or category offer
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-black text-xl hover:bg-[#d90416] hover:text-white transition"
          >
            ×
          </button>

        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto">

          <form
            onSubmit={handleSubmit}
            className="p-6"
          >

            {/* OFFER NAME */}
            <div className="mb-5">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Offer Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Summer Jersey Sale"
                className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none focus:border-[#d90416] focus:ring-2 focus:ring-red-100 transition"
              />

            </div>

            {/* OFFER TYPE */}
            <div className="mb-5">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Offer Type
              </label>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    handleOfferTypeChange("Product")
                  }
                  className={`h-12 rounded-xl border font-semibold transition ${
                    offerType === "Product"
                      ? "bg-[#d90416] text-white border-[#d90416]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#d90416]"
                  }`}
                >
                  Product Offer
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleOfferTypeChange("Category")
                  }
                  className={`h-12 rounded-xl border font-semibold transition ${
                    offerType === "Category"
                      ? "bg-[#d90416] text-white border-[#d90416]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#d90416]"
                  }`}
                >
                  Category Offer
                </button>

              </div>

            </div>

            {/* PRODUCT / CATEGORY */}
            <div className="mb-5">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {offerType === "Product"
                  ? "Select Product"
                  : "Select Category"}
              </label>

              <select
                name="targetId"
                value={formData.targetId}
                onChange={handleChange}
                className="w-full h-12 px-4 border border-gray-300 rounded-xl bg-white outline-none focus:border-[#d90416] focus:ring-2 focus:ring-red-100 transition"
              >

                <option value="">
                  {offerType === "Product"
                    ? loadingProducts
                      ? "Loading products..."
                      : "Select Product"
                    : loadingCategories
                    ? "Loading categories..."
                    : "Select Category"}
                </option>

                {offerType === "Product" &&
                  products.map((product) => (
                    <option
                      key={product._id}
                      value={product._id}
                    >
                      {product.name}
                    </option>
                  ))}

                {offerType === "Category" &&
                  categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}

              </select>

            </div>

            {/* DISCOUNT */}
            <div className="mb-5">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount Percentage
              </label>

              <div className="relative">

                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  placeholder="Enter discount"
                  className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-xl outline-none focus:border-[#d90416] focus:ring-2 focus:ring-red-100 transition"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                  %
                </span>

              </div>

            </div>

            {/* DATES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none focus:border-[#d90416] focus:ring-2 focus:ring-red-100 transition"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none focus:border-[#d90416] focus:ring-2 focus:ring-red-100 transition"
                />

              </div>

            </div>

            {/* STATUS */}
            <div className="mb-6">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Offer Status
              </label>

              <select
                value={
                  formData.status
                    ? "Active"
                    : "Inactive"
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status:
                      e.target.value === "Active",
                  }))
                }
                className="w-full h-12 px-4 border border-gray-300 rounded-xl bg-white outline-none focus:border-[#d90416] focus:ring-2 focus:ring-red-100 transition"
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

            {/* BUTTONS */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 bg-[#d90416] hover:bg-[#b90312] text-white rounded-xl font-semibold transition disabled:opacity-50"
              >
                {loading
                  ? "Updating..."
                  : "Update Offer"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default EditOfferModal;