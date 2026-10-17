import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useWishlist } from "../../wishlist/context/WishlistContext";
import { getProductPricing } from "../../../utils/pricing";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const { sellingPrice, originalPrice, discount, hasDiscount } =
    getProductPricing(product);

  const handleProductClick = () => {
    navigate(`/products/${product._id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    navigate(`/products/${product._id}`);
  };

  return (
    <div
      onClick={handleProductClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex flex-col justify-between w-full cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative w-full aspect-[4/5] bg-black rounded-xl overflow-hidden mb-4 flex items-center justify-center">

        {/* Discount Corner Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-[#d90416] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm tracking-wide">
            {discount}% OFF
          </div>
        )}

        <img
          src={
            product.images?.[0]?.startsWith("http")
              ? product.images[0].replace("http://localhost:5000", "https://api.afsal.online")
              : `https://api.afsal.online${product.images?.[0]}`
          }
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
        />

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 text-white hover:text-[#d90416] transition-colors p-1 z-10"
          title={
            isInWishlist(product._id)
              ? "Remove from Wishlist"
              : "Add to Wishlist"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
            fill={
              isInWishlist(product._id)
                ? "#d90416"
                : "none"
            }
            viewBox="0 0 24 24"
            stroke={isInWishlist(product._id) ? "#d90416" : "currentColor"}
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
            />
          </svg>
        </button>

      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 justify-between">

        <div>
          <h3 className="font-medium text-gray-900 text-base mb-1 truncate" title={product.name}>
            {product.name}
          </h3>

          {/* Price */}
          <div className="text-lg font-bold text-gray-900 mb-3">
            ₹{sellingPrice}
          </div>
        </div>

        <div>
          {/* Buy Now */}
          <button
            type="button"
            onClick={handleProductClick}
            className="w-full bg-black hover:bg-neutral-800 text-white font-medium py-2.5 rounded-lg mb-2 transition text-sm sm:text-base"
          >
            Buy Now
          </button>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-[#d90416] hover:bg-[#b90312] text-white font-medium py-2.5 rounded-lg transition text-sm sm:text-base"
          >
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductCard;