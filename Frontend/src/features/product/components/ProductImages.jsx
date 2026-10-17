import { useState } from "react";

function ProductImages({ images }) {
  const [selectedImage, setSelectedImage] = useState(images?.[0]);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full">

      {/* Main Image (Order 1 on mobile, Order 2 on desktop) */}
      <div
        className="
          order-1
          md:order-2
          w-full
          max-w-[550px]
          h-[320px]
          sm:h-[420px]
          md:h-[550px]
          overflow-hidden
          rounded-xl
          bg-gray-50
          flex
          items-center
          justify-center
          cursor-zoom-in
          mx-auto
        "
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setZoomPosition({ x: 50, y: 50 });
        }}
        onMouseMove={handleMouseMove}
      >
        <img
          src={
            selectedImage?.startsWith("http")
              ? selectedImage.replace("http://localhost:5000", "https://api.afsal.online")
              : `https://api.afsal.online${selectedImage}`
          }
          alt="Product"
          className="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-200"
          style={{
            transform: isHovering ? "scale(2)" : "scale(1)",
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        />
      </div>

      {/* Thumbnails (Order 2 on mobile, Order 1 on desktop) */}
      <div className="order-2 md:order-1 flex flex-row overflow-x-auto gap-2 py-2 md:py-0 md:flex-col shrink-0 justify-start sm:justify-center md:justify-start">
        {images?.map((image, index) => (
          <button
            type="button"
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`
              w-16 h-16
              sm:w-20 sm:h-20
              shrink-0
              border-2
              rounded-lg
              overflow-hidden
              p-1
              bg-gray-50
              transition
              ${
                selectedImage === image
                  ? "border-[#d90416]"
                  : "border-gray-200 hover:border-gray-400"
              }
            `}
          >
            <img
              src={
                image?.startsWith("http")
                  ? image.replace("http://localhost:5000", "https://api.afsal.online")
                  : `https://api.afsal.online${image}`
              }
              alt={`Product ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>

    </div>
  );
}

export default ProductImages;