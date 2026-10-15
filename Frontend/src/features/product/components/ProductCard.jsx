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
      className="
        bg-white
        border
        border-gray-200
        rounded-xl
        overflow-hidden
        shadow-sm
        hover:shadow-lg
        hover:scale-105
        max-w-[310px]
        w-full
        transition
        cursor-pointer
      "
    >
      {/* Image */}
      <div className="relative w-full">

        {/* Discount Corner Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-[#d90416] text-white text-[11px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm tracking-wide">
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
          className="
            w-full
            h-auto
            object-contain
            transition-transform
            duration-300
            hover:scale-105
          "
        />

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="
            absolute
            top-4
            right-4
            w-10
            h-10
            rounded-full
            shadow-md
            flex
            items-center
            justify-center
            text-white
            hover:text-[#d90416]
            transition
            z-10
          "
          title={
            isInWishlist(product._id)
              ? "Remove from Wishlist"
              : "Add to Wishlist"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill={
              isInWishlist(product._id)
                ? "#d90416"
                : "none"
            }
            viewBox="0 0 24 24"
            stroke="currentColor"
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
      <div className="p-5">

        <h3 className="text-lg font-semibold text-gray-900">
          {product.name}
        </h3>

        {/* Price & Offer Display */}
        <div className="mt-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            {/* Selling Price */}
            <span className="text-xl font-bold text-gray-900">
              ₹{sellingPrice}
            </span>

            {/* Original Price / MRP (if discount exists) */}
            {hasDiscount && originalPrice && originalPrice > sellingPrice && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ₹{originalPrice}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        {/* Buy Now */}
        <button
          type="button"
          onClick={handleProductClick}
          className="
            w-full
            mt-5
            py-2
            rounded-lg
            bg-black
            hover:bg-[#b90312]
            text-white
            font-semibold
            transition
          "
        >
          Buy Now
        </button>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="
            w-full
            mt-5
            py-1
            rounded-lg
            bg-[#d90416]
            hover:bg-[#b90312]
            text-white
            text-lg
            font-semibold
            transition
          "
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
}

export default ProductCard;