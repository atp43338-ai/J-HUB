import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useWishlist } from "../context/WishlistContext";
import { addToCart } from "../../cart/services/cartService";

function WishlistItem({ product }) {
  const navigate = useNavigate();

  const {
    removeFromWishlist,
  } = useWishlist();

  const handleRemove = () => {
    removeFromWishlist(product._id);

    toast.success("Removed from wishlist");
  };

  const handleMoveToCart = async () => {
    // Find first available variant
    const availableVariant = product.variants?.find(
      (variant) => variant.stock > 0
    );

    if (!availableVariant) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        size: availableVariant.size,
        quantity: 1,
      });

      removeFromWishlist(product._id);

      toast.success("Added to cart");

      navigate("/cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">

      {/* Image */}
      <button
        type="button"
        onClick={() =>
          navigate(`/products/${product._id}`)
        }
        className="w-full h-72 bg-gray-50 overflow-hidden"
      >
        <img
          src={`http://localhost:5000${product.images?.[0]}`}
          alt={product.name}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
        />
      </button>

      {/* Content */}
      <div className="p-5">

        <div className="flex items-start justify-between gap-3">

          <div>
            <h3 className="text-lg font-semibold text-black">
              {product.name}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {product.brand}
            </p>
          </div>

          {/* Remove */}
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-800 text-xl"
            title="Remove from wishlist"
          >
            ♥
          </button>

        </div>

        {/* Price */}
        <div className="mt-4">
          <span className="text-xl font-bold text-black">
            ₹{product.price?.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-5">

          <button
            type="button"
            onClick={() =>
              navigate(`/products/${product._id}`)
            }
            className="flex-1 py-3 border border-black rounded-lg text-black font-semibold hover:bg-black hover:text-white transition"
          >
            View
          </button>

          <button
            type="button"
            onClick={handleMoveToCart}
            className="flex-1 py-3 bg-[#d90416] text-white rounded-lg font-semibold hover:bg-[#b90312] transition"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default WishlistItem;