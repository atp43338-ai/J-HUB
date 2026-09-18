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
    <div className="flex gap-4">

      {/* Thumbnails */}
      <div className="flex flex-col gap-3">
        {images?.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`
              w-20 h-20
              border
              rounded-lg
              overflow-hidden
              ${
                selectedImage === image
                  ? "border-[#d90416]"
                  : "border-gray-200"
              }
            `}
          >
            <img
              src={`http://localhost:5000${image}`}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div
        className="
          w-full
          max-w-[550px]
          h-[550px]
          overflow-hidden
          rounded-xl
          cursor-zoom-in
        "
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setZoomPosition({ x: 50, y: 50 });
        }}
        onMouseMove={handleMouseMove}
      >
        <img
          src={`http://localhost:5000${selectedImage}`}
          alt="Product"
          className="w-full h-full object-contain transition-transform duration-200"
          style={{
            transform: isHovering ? "scale(2)" : "scale(1)",
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        />
      </div>

    </div>
  );
}

export default ProductImages;