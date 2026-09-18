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

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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

  // Image change
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      setImages([selectedImage]);
    }
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

    if (!price || Number(price) < 0) {
      toast.error("Please enter a valid price");
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

    // Only send new image if selected
    images.forEach((image) => {
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
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />

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

          {/* Existing Image */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Product Image
            </label>

            {existingImages.length > 0 && (
              <div className="mb-4">

                <img
                  src={`http://localhost:5000${existingImages[0]}`}
                  alt={name}
                  className="w-32 h-32 object-contain rounded-lg bg-gray-100 border"
                />

              </div>
            )}

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Change Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-[#d90416]"
            />

            <p className="mt-2 text-sm text-gray-500">
              Select a new image only if you want to replace the current image.
            </p>

            {images.length > 0 && (
              <p className="mt-2 text-sm text-gray-700">
                New image selected:{" "}
                {images[0].name}
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