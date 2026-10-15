import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getProductById,
  updateProduct,
} from "../services/adminProductService";

function EditProductModal({
  productId,
  onClose,
  onUpdated,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [brand, setBrand] = useState("");
  const [discount, setDiscount] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Format Image URL helper
  const formatImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) {
      return url.replace("http://localhost:5000", "https://api.afsal.online");
    }
    return `https://api.afsal.online${url}`;
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const product = await getProductById(productId);

        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(product.price ?? "");
        setCategory(product.category || "");
        setCollection(product.collection || "");
        setBrand(product.brand || "");
        setDiscount(product.discount ?? "");

        setExistingImages(product.images || []);
      } catch (error) {
        console.error("Fetch product error:", error);

        toast.error(
          error.message || "Failed to fetch product"
        );

        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, onClose]);

  // Remove an existing image
  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // Remove a newly selected image preview
  const handleRemoveNewImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    setNewImagePreviews((prev) => {
      const target = prev[indexToRemove];
      if (target) URL.revokeObjectURL(target);
      return prev.filter((_, i) => i !== indexToRemove);
    });
  };

  // Handle multiple file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const totalAllowed = 5 - (existingImages.length + newImages.length);
    if (totalAllowed <= 0) {
      toast.error("You can have a maximum of 5 images in total");
      e.target.value = "";
      return;
    }

    if (files.length > totalAllowed) {
      toast.error(
        `You can only add ${totalAllowed} more image${
          totalAllowed > 1 ? "s" : ""
        } (maximum 5 total)`
      );
      e.target.value = "";
      return;
    }

    const createdPreviews = files.map((file) => URL.createObjectURL(file));

    setNewImages((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...createdPreviews]);

    e.target.value = "";
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter product name");
      return;
    }

    if (!description.trim()) {
      toast.error(
        "Please enter product description"
      );
      return;
    }

    // Price validation
    const priceValue = Number(price);

    if (
      price === "" ||
      !Number.isFinite(priceValue) ||
      priceValue < 1 ||
      priceValue > 1000000
    ) {
      toast.error(
        "Price must be between ₹1 and ₹10,00,000"
      );
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!collection) {
      toast.error(
        "Please select a collection"
      );
      return;
    }

    if (!brand.trim()) {
      toast.error("Please enter brand name");
      return;
    }

    if (discount === "") {
      toast.error("Please enter discount");
      return;
    }

    if (
      Number(discount) < 0 ||
      Number(discount) > 100
    ) {
      toast.error(
        "Discount must be between 0 and 100"
      );
      return;
    }

    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error("Product must have at least one image");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append(
      "description",
      description
    );
    formData.append("price", price);
    formData.append(
      "category",
      category
    );
    formData.append(
      "collection",
      collection
    );
    formData.append("brand", brand);
    formData.append(
      "discount",
      discount
    );

    // Send remaining existing images as JSON string
    formData.append(
      "existingImages",
      JSON.stringify(existingImages)
    );

    // Append newly selected image files
    newImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      setUpdating(true);

      const data = await updateProduct(
        productId,
        formData
      );

      console.log(
        "Product updated:",
        data
      );

      toast.success(
        "Product updated successfully"
      );

      onUpdated();
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to update product"
      );
    } finally {
      setUpdating(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 shadow-xl">
          <p className="text-gray-600">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl scrollbar-hide">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">

          <h2 className="text-2xl font-bold">
            <span className="text-black">
              Edit{" "}
            </span>

            <span className="text-[#d90416]">
              Product
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
        <form
          onSubmit={handleSubmit}
          className="p-6"
        >

          {/* Product Name */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter product name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />

          </div>

          {/* Description */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Enter product description"
              rows="5"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416] resize-none"
            />

          </div>

          {/* Price */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              placeholder="Enter price"
              min="1"
              max="1000000"
              step="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />

            <p className="mt-2 text-sm text-gray-500">
              Price must be between ₹1 and ₹10,00,000.
            </p>

          </div>

          {/* Category */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            >

              <option value="">
                Select category
              </option>

              <option value="Unisex">
                Unisex
              </option>

            </select>

          </div>

          {/* Collection */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection
            </label>

            <select
              value={collection}
              onChange={(e) =>
                setCollection(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            >

              <option value="">
                Select collection
              </option>

              <option value="Club">
                Club
              </option>

              <option value="National">
                National
              </option>

              <option value="Legends">
                Legends
              </option>

              <option value="New Season">
                New Season
              </option>

            </select>

          </div>

          {/* Brand */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>

            <input
              type="text"
              value={brand}
              onChange={(e) =>
                setBrand(e.target.value)
              }
              placeholder="Enter brand name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />

          </div>

          {/* Product Images */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Current Product Images ({existingImages.length})
              </label>
              <span className="text-xs text-gray-500">
                {existingImages.length + newImages.length}/5 total
              </span>
            </div>

            {/* Existing Images Grid */}
            {existingImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
                {existingImages.map((imgUrl, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-square flex items-center justify-center shadow-sm"
                  >
                    <img
                      src={formatImageUrl(imgUrl)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-90 hover:opacity-100 transition shadow cursor-pointer"
                      title="Remove image"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic my-2">
                No existing images remaining.
              </p>
            )}

            {/* New Images Previews Grid */}
            {newImagePreviews.length > 0 && (
              <div className="mt-4 mb-3">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">
                  New Images To Upload ({newImagePreviews.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {newImagePreviews.map((previewUrl, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative group rounded-lg overflow-hidden border-2 border-green-500/40 bg-gray-50 aspect-square flex items-center justify-center shadow-sm"
                    >
                      <img
                        src={previewUrl}
                        alt={`New upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-90 hover:opacity-100 transition shadow cursor-pointer"
                        title="Remove new image"
                      >
                        ✕
                      </button>
                      <span className="absolute bottom-1 left-1 bg-green-700 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                        New
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add More Images Input */}
            {existingImages.length + newImages.length < 5 ? (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add New / Additional Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-[#d90416] text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Select one or more images (JPEG, PNG, WebP) to add to the product.
                </p>
              </div>
            ) : (
              <p className="mt-3 text-xs text-amber-600 font-medium">
                Maximum 5 images reached. Remove an image to upload a different one.
              </p>
            )}
          </div>

          {/* Discount */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount (%)
            </label>

            <input
              type="number"
              value={discount}
              onChange={(e) =>
                setDiscount(
                  e.target.value
                )
              }
              placeholder="Enter discount percentage"
              min="0"
              max="100"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={updating}
              className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
              className="px-6 py-3 rounded-lg bg-[#d90416] hover:bg-[#b90312] text-white font-semibold transition disabled:opacity-50"
            >
              {updating
                ? "Updating..."
                : "Update Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditProductModal;