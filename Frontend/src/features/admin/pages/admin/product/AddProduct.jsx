import { useState } from "react";
import Cropper from "react-easy-crop";
import { createProduct } from "../../../../product/services/productService";
import toast from "react-hot-toast";

function AddProduct() {
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

  // Crop states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropImage, setCropImage] = useState(null);
  const [cropQueue, setCropQueue] = useState([]);

  const handleSizeChange = (e) => {
    const value = e.target.value;

    if (e.target.checked) {
      setSizes([...sizes, value]);
    } else {
      setSizes(sizes.filter((size) => size !== value));
    }
  };

  //remove image 

  const handleRemoveImage = (index) => {
  setImages(images.filter((_, i) => i !== index));
};

  // Select multiple images
  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);

    if (selectedImages.length < 1) {
      toast.error("Please select at least 1 images");
      e.target.value = "";
      return;
    }

    if (selectedImages.length > 5) {
      toast.error("You can select maximum 5 images");
      e.target.value = "";
      return;
    }

    const imageUrls = selectedImages.map((image) => ({
      file: image,
      url: URL.createObjectURL(image),
    }));

    setCropQueue(imageUrls);

    setCropImage(imageUrls[0].url);

    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
  };

  // Crop complete
  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Create cropped and resized image
  const getCroppedImage = (imageSrc, cropArea) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Final image size
        const outputWidth = 800;
        const outputHeight = 800;

        canvas.width = outputWidth;
        canvas.height = outputHeight;

        ctx.drawImage(
          image,
          cropArea.x,
          cropArea.y,
          cropArea.width,
          cropArea.height,
          0,
          0,
          outputWidth,
          outputHeight
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create cropped image"));
              return;
            }

            const croppedFile = new File(
              [blob],
              `cropped-${Date.now()}.jpg`,
              {
                type: "image/jpeg",
              }
            );

            resolve(croppedFile);
          },
          "image/jpeg",
          0.9
        );
      };

      image.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      image.src = imageSrc;
    });
  };

  // Crop current image and continue to next image
  const handleCrop = async () => {
    try {
      if (!cropImage || !croppedAreaPixels) {
        toast.error("Please select crop area");
        return;
      }

      const croppedFile = await getCroppedImage(
        cropImage,
        croppedAreaPixels
      );

      // Add cropped image to existing images
      setImages((prevImages) => [
        ...prevImages,
        croppedFile,
      ]);

      // Remove current image from queue
      const remainingImages = cropQueue.slice(1);

      if (remainingImages.length > 0) {
        // Open next image
        setCropQueue(remainingImages);

        setCropImage(remainingImages[0].url);

        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setCroppedAreaPixels(null);
      } else {
        // All images completed
        setCropQueue([]);
        setCropImage(null);

        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setCroppedAreaPixels(null);

        toast.success("All images cropped successfully");
      }
    } catch (error) {
      console.error("Crop error:", error);

      toast.error("Failed to crop image");
    }
  };

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

    // Minimum 3 images
    if (images.length < 1) {
      toast.error("Please upload at least 3 product images");
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

    // Add all cropped images
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const data = await createProduct(formData);

      console.log("Product created:", data);

      toast.success("Product added successfully");

      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setCollection("");
      setBrand("");
      setImages([]);
      setStock("");
      setSizes([]);
      setColors("");
      setDiscount("");

      e.target.reset();
    } catch (error) {
      console.error("Create product error:", error);

      toast.error(error.message || "Failed to add product");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white p-6 md:p-10">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">
          <span className="text-black">Add </span>
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

          {/* Product Images */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-[#d90416]"
            />

            <p className="mt-2 text-sm text-gray-500">
              Select 3 to 5 images. Each image will be cropped and resized to 800 × 800.
            </p>

            {/* Cropped image previews */}
            {images.length > 0 && (
  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
    {images.map((image, index) => (
      <div key={index}>
        <div className="relative">
          <img
            src={URL.createObjectURL(image)}
            alt={`Product ${index + 1}`}
            className="w-full h-32 object-contain rounded-lg bg-gray-100 border"
          />

          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            className="absolute top-1 right-1 w-7 h-7 text-red-600 rounded-full shadow flex items-center justify-center font-bold hover:bg-red-50"
          >
            ×
          </button>
        </div>

        <p className="mt-2 text-sm text-center text-gray-700">
          Image {index + 1}
        </p>
      </div>
    ))}
  </div>
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

          {/* Add Product */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#d90416] hover:bg-[#b90312] text-white font-semibold transition"
          >
            Add Product
          </button>

        </form>
      </div>

      {/* Crop Modal */}
      {cropImage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl w-full max-w-2xl p-6">

            <h2 className="text-xl font-bold text-black mb-5">
              Crop Image
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Image {images.length + 1} of{" "}
              {images.length + cropQueue.length}
            </p>

            {/* Crop Area */}
            <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">

              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />

            </div>

            {/* Zoom */}
            <div className="mt-5">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoom
              </label>

              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />

            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={() => {
                  cropQueue.forEach((item) => {
                    URL.revokeObjectURL(item.url);
                  });

                  setCropQueue([]);
                  setCropImage(null);

                  setZoom(1);
                  setCrop({ x: 0, y: 0 });
                  setCroppedAreaPixels(null);
                }}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCrop}
                className="px-5 py-2.5 bg-[#d90416] text-white rounded-lg font-medium hover:bg-[#b90312] transition"
              >
                Crop & Continue
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AddProduct;