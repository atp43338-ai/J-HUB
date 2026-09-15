import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import {
  getProductById,
  updateProduct,
} from "../../../services/adminProductService";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [brand, setBrand] = useState("");
  const [images, setImages] = useState([]);
  const [stock, setStock] = useState("");
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState("");
  const [discount, setDiscount] = useState("");

  const [existingImages, setExistingImages] = useState([]);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);

        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(product.price || "");
        setCategory(product.category || "");
        setCollection(product.collection || "");
        setBrand(product.brand || "");
        setStock(product.stock || "");
        setSizes(product.sizes || []);
        setColors(product.colors?.join(", ") || "");
        setDiscount(product.discount || "");

        setExistingImages(product.images || []);
      } catch (error) {
        console.error("Fetch product error:", error);
        toast.error(error.message || "Failed to fetch product");
      }
    };

    fetchProduct();
  }, [id]);

  // Size change
  const handleSizeChange = (e) => {
    const value = e.target.value;

    if (e.target.checked) {
      setSizes([...sizes, value]);
    } else {
      setSizes(sizes.filter((size) => size !== value));
    }
  };

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
      toast.error("Please enter product description");
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
      toast.error("Please select a collection");
      return;
    }

    if (!brand.trim()) {
      toast.error("Please enter brand name");
      return;
    }

    if (stock === "" || Number(stock) < 0) {
      toast.error("Please enter valid stock");
      return;
    }

    if (sizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }

    if (!colors.trim()) {
      toast.error("Please enter at least one color");
      return;
    }

    if (discount === "") {
      toast.error("Please enter discount");
      return;
    }

    if (Number(discount) < 0 || Number(discount) > 100) {
      toast.error("Discount must be between 0 and 100");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("collection", collection);
    formData.append("brand", brand);
    formData.append("stock", stock);
    formData.append("discount", discount);

    const colorList = colors
      .split(",")
      .map((color) => color.trim())
      .filter((color) => color);

    colorList.forEach((color) => {
      formData.append("colors", color);
    });

    sizes.forEach((size) => {
      formData.append("sizes", size);
    });

    // Only send new image if user selected one
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const data = await updateProduct(id, formData);

      console.log("Product updated:", data);

      toast.success("Product updated successfully");

      navigate("/admin/products");
    } catch (error) {
      console.error("Update product error:", error);

      toast.error(error.message || "Failed to update product");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white p-6 md:p-10">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">
          <span className="text-black">Edit </span>
          <span className="text-[#d90416]">Product</span>
        </h1>

        <form onSubmit={handleSubmit}>

          {/* Product Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setDescription(e.target.value)}
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
              onChange={(e) => setPrice(e.target.value)}
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
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            >
              <option value="">Select category</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          {/* Collection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection
            </label>

            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            >
              <option value="">Select collection</option>
              <option value="Club">Club</option>
              <option value="National">National</option>
              <option value="Legends">Legends</option>
              <option value="New Season">New Season</option>
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
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Enter brand name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />
          </div>

          {/* Existing Product Image */}
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
                New image selected: {images[0].name}
              </p>
            )}

          </div>

          {/* Stock */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock
            </label>

            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter stock quantity"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />
          </div>

          {/* Sizes */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sizes
            </label>

            <div className="flex flex-wrap gap-4">

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="S"
                  checked={sizes.includes("S")}
                  onChange={handleSizeChange}
                />
                <span>S</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="M"
                  checked={sizes.includes("M")}
                  onChange={handleSizeChange}
                />
                <span>M</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="L"
                  checked={sizes.includes("L")}
                  onChange={handleSizeChange}
                />
                <span>L</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="XL"
                  checked={sizes.includes("XL")}
                  onChange={handleSizeChange}
                />
                <span>XL</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="XXL"
                  checked={sizes.includes("XXL")}
                  onChange={handleSizeChange}
                />
                <span>XXL</span>
              </label>

            </div>
          </div>

          {/* Colors */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colors
            </label>

            <input
              type="text"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              placeholder="Enter colors (e.g. Red, Black, White)"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />

            <p className="mt-2 text-sm text-gray-500">
              Separate multiple colors with commas
            </p>

          </div>

          {/* Discount */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount (%)
            </label>

            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Enter discount percentage"
              min="0"
              max="100"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />

          </div>

          {/* Update Product */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#d90416] hover:bg-[#b90312] text-white font-semibold transition"
          >
            Update Product
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditProduct;