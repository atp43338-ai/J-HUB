import { useState } from "react";
import Cropper from "react-easy-crop";
import { createProduct } from "../services/adminProductService";
import toast from "react-hot-toast";

function AddProductModal({ onClose, onAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  // Changed: collection is now an array
  const [collection, setCollection] = useState([]);

  const [brand, setBrand] = useState("");
  const [images, setImages] = useState([]);
  const [discount, setDiscount] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({});

  // Crop states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropImage, setCropImage] = useState(null);
  const [cropQueue, setCropQueue] = useState([]);

  // Remove image
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));

    setErrors((prev) => ({
      ...prev,
      images: "",
    }));
  };

  // Select images
  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);

    if (selectedImages.length < 1) {
      toast.error("Please select at least 1 image");
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

    setErrors((prev) => ({
      ...prev,
      images: "",
    }));
  };

  // Crop complete
  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Create cropped image
  const getCroppedImage = (imageSrc, cropArea) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

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

  // Crop current image
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

      setImages((prevImages) => [
        ...prevImages,
        croppedFile,
      ]);

      const remainingImages = cropQueue.slice(1);

      if (remainingImages.length > 0) {
        setCropQueue(remainingImages);
        setCropImage(remainingImages[0].url);

        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setCroppedAreaPixels(null);
      } else {
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

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Please enter product name";
    }

    if (!name.length === 3) {
      newErrors.name = "Please enter minimum 3 character ";
    }

    if (!description.trim()) {
      newErrors.description = "Please enter product description";
    }

    if (!description.length === 20) {
      newErrors.description = "Please enter minimum 20 words";
    }

    if (!price || Number(price) < 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!category) {
      newErrors.category = "Please select a category";
    }

    // Changed: check array length
    if (collection.length === 0) {
      newErrors.collection = "Please select a collection";
    }

    if (!brand.trim()) {
      newErrors.brand = "Please enter brand name";
    }

    if (images.length < 3) {
      newErrors.images = "Please upload at least 3 product images";
    }

    if (discount === "") {
      newErrors.discount = "Please enter discount";
    } else if (
      Number(discount) < 0 ||
      Number(discount) > 100
    ) {
      newErrors.discount =
        "Discount must be between 0 and 100";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check all fields together
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);

    // Changed: send each collection separately
    collection.forEach((item) => {
      formData.append("collection", item);
    });

    formData.append("brand", brand);
    formData.append("discount", discount);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const data = await createProduct(formData);

      console.log("Product created:", data);

      toast.success("Product added successfully");

      // Tell ProductManagement to refresh
      onAdded();
    } catch (error) {
      console.error("Create product error:", error);

      toast.error(
        error.message || "Failed to add product"
      );
    }
  };

  return (
    <>
      {/* Add Product Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl scrollbar-hide">

          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">

            <h2 className="text-2xl font-bold">
              <span className="text-black">Add </span>
              <span className="text-[#d90416]">
                Product
              </span>
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="text-2xl text-gray-500 hover:text-[#d90416]"
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
                onChange={(e) => {
                  setName(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    name: "",
                  }));
                }}
                placeholder="Enter product name"
                className={`w-full border rounded-lg px-4 py-3 outline-none focus:border-[#d90416] ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

              {errors.name && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    description: "",
                  }));
                }}
                placeholder="Enter product description"
                rows="5"
                className={`w-full border rounded-lg px-4 py-3 outline-none focus:border-[#d90416] resize-none ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

              {errors.description && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>

              <input
                type="number"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    price: "",
                  }));
                }}
                placeholder="Enter price"
                min="0"
                className={`w-full border rounded-lg px-4 py-3 outline-none focus:border-[#d90416] ${
                  errors.price
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

              {errors.price && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.price}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    category: "",
                  }));
                }}
                className={`w-full border rounded-lg px-4 py-3 outline-none focus:border-[#d90416] ${
                  errors.category
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">
                  Select category
                </option>

                <option value="Unisex">
                  Unisex
                </option>
              </select>

              {errors.category && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Collection */}
            <div>
              <label className="block font-medium mb-3">
                Collection
              </label>

              <div className="space-y-2">

                {["Club", "National", "Legends", "New Season"].map(
                  (item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={collection.includes(item)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCollection([
                              ...collection,
                              item,
                            ]);
                          } else {
                            setCollection(
                              collection.filter(
                                (value) => value !== item
                              )
                            );
                          }
                        }}
                      />

                      <span>{item}</span>
                    </label>
                  )
                )}

              </div>
            </div>

            {/* Brand */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>

              <input
                type="text"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    brand: "",
                  }));
                }}
                placeholder="Enter brand name"
                className={`w-full border rounded-lg px-4 py-3 outline-none focus:border-[#d90416] ${
                  errors.brand
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

              {errors.brand && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.brand}
                </p>
              )}
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
                className={`w-full border rounded-lg px-4 py-3 bg-white outline-none focus:border-[#d90416] ${
                  errors.images
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

              <p className="mt-2 text-sm text-gray-500">
                Select 3 to 5 images. Each image will be cropped and resized to 800 × 800.
              </p>

              {errors.images && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.images}
                </p>
              )}

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
                          onClick={() =>
                            handleRemoveImage(index)
                          }
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

            {/* Discount */}
            <div className="mb-6">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>

              <input
                type="number"
                value={discount}
                onChange={(e) => {
                  setDiscount(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    discount: "",
                  }));
                }}
                placeholder="Enter discount percentage"
                min="0"
                max="100"
                className={`w-full border rounded-lg px-4 py-3 outline-none focus:border-[#d90416] ${
                  errors.discount
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

              {errors.discount && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.discount}
                </p>
              )}

            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-[#d90416] hover:bg-[#b90312] text-white font-semibold transition"
              >
                Add Product
              </button>

            </div>

          </form>

        </div>
      </div>

      {/* Crop Modal */}
      {cropImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">

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
                onChange={(e) =>
                  setZoom(Number(e.target.value))
                }
                className="w-full"
              />

            </div>

            {/* Crop Buttons */}
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

    </>
  );
}

export default AddProductModal;