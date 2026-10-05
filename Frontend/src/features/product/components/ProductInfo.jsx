import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { addToCart } from "../../cart/services/cartService";
import { useCart } from "../../cart/context/CartContext";

import { useWishlist } from "../../wishlist/context/WishlistContext";

function ProductInfo({ product }) {
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { refreshCartCount } = useCart();

  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  // Find selected variant
  const selectedVariant = product.variants?.find(
    (variant) => variant.size === selectedSize
  );

  // Check whether product is in wishlist
  const isInWishlist = wishlist.some(
    (item) => item._id === product._id
  );

  // Add to Cart
  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!selectedVariant) {
      toast.error("Selected size is not available");
      return;
    }

    if (selectedVariant.stock < quantity) {
      toast.error("Not enough stock");
      return;
    }

    try {
      // Add product to cart
      await addToCart({
        productId: product._id,
        size: selectedSize,
        quantity,
      });

      // Refresh cart count
      await refreshCartCount();

      // Remove from wishlist if it exists there
      if (isInWishlist) {
        await removeFromWishlist(product._id);
      }

      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Buy Now
  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!selectedVariant) {
      toast.error("Selected size is not available");
      return;
    }

    if (selectedVariant.stock < quantity) {
      toast.error("Not enough stock");
      return;
    }

    navigate("/checkout", {
      state: {
        items: [
          {
            product,
            size: selectedSize,
            quantity,
          },
        ],
      },
    });
  };

  // Wishlist
const handleWishlist = async () => {
  try {
    if (isInWishlist) {
      await removeFromWishlist(product._id);
      toast.success("Removed from wishlist");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!selectedVariant) {
      toast.error("Selected size is not available");
      return;
    }

    if (selectedVariant.stock <= 0) {
      toast.error("Selected size is out of stock");
      return;
    }

    await addToWishlist(
      product._id,
      selectedSize
    );

    toast.success("Added to wishlist");
  } catch (error) {
    toast.error(error.message);
  }
};

  return (
    <div className="h-[650px] overflow-y-auto pr-4 scrollbar-hide">

      {/* Product Information */}
      <div className="flex flex-col">

        <span className="mt-3 sm:text-1xl md:text-1xl mb-8">
          <span className="text-black">J -</span>
          <span className="text-[#d90416]"> HUB</span>
        </span>

        {/* Brand */}
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          {product.brand}
        </p>

        {/* Product Name */}
        <h2 className="text-3xl md:text-4xl font-extrabold !text-black">
          {product.name}
        </h2>

        {/* Rating */}
        <div className="mt-6 flex items-center gap-2">
          <span className="text-yellow-500">
            ★★★★★
          </span>

          <span className="text-sm text-gray-500">
            (0 Reviews)
          </span>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center gap-3">
          <p className="text-3xl font-bold text-black">
            ₹{product.price}
          </p>

          {product.discount > 0 && (
            <span className="text-sm font-semibold text-[#d90416]">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="mt-5">

          {!product.variants?.length ? (
            <p className="font-semibold text-red-600">
              Out of Stock
            </p>
          ) : selectedVariant ? (
            selectedVariant.stock > 0 ? (
              <p className="font-semibold text-green-600">
                {selectedVariant.stock} items available
              </p>
            ) : (
              <p className="font-semibold text-red-600">
                Selected size is Out of Stock
              </p>
            )
          ) : (
            <p className="font-semibold text-gray-500">
              Select a size to check stock
            </p>
          )}

        </div>

        {/* Sizes */}
        {product.variants?.length > 0 && (
          <div className="mt-6">

            <h3 className="font-semibold text-black">
              Select Size
            </h3>

            <div className="flex gap-3 mt-3 flex-wrap">

              {product.variants.map((variant) => (
                <button
                  type="button"
                  key={variant._id}
                  onClick={() => {
                    setSelectedSize(variant.size);
                    setQuantity(1);
                  }}
                  disabled={variant.stock === 0}
                  className={`
                    px-5
                    py-2
                    border
                    rounded-lg
                    transition
                    ${
                      selectedSize === variant.size
                        ? "border-[#d90416] bg-[#d90416] text-white"
                        : "border-gray-300 text-black hover:border-[#d90416]"
                    }
                    ${
                      variant.stock === 0
                        ? "opacity-40 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                >
                  {variant.size}
                </button>
              ))}

            </div>

          </div>
        )}

        {/* Quantity */}
        {selectedVariant && selectedVariant.stock > 0 && (
          <div className="mt-6">

            <h3 className="font-semibold text-black">
              Quantity
            </h3>

            <div className="flex items-center gap-4 mt-3">

              <button
                type="button"
                onClick={() =>
                  setQuantity((prev) =>
                    Math.max(1, prev - 1)
                  )
                }
                className="
                  w-10
                  h-10
                  border
                  border-gray-300
                  rounded-lg
                  text-xl
                  text-black
                  hover:border-[#d90416]
                "
              >
                -
              </button>

              <span className="text-lg font-semibold text-black">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((prev) =>
                    Math.min(
                      selectedVariant.stock,
                      prev + 1
                    )
                  )
                }
                className="
                  w-10
                  h-10
                  border
                  border-gray-300
                  rounded-lg
                  text-xl
                  text-black
                  hover:border-[#d90416]
                "
              >
                +
              </button>

            </div>

          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">

          {/* Add to Cart - BIG */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              !selectedVariant ||
              selectedVariant.stock === 0
            }
            className="
              w-full
              py-4
              rounded-lg
              bg-[#d90416]
              hover:bg-[#b90312]
              text-white
              font-semibold
              text-lg
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Add to Cart
          </button>

          {/* Buy Now + Wishlist */}
          <div className="flex gap-3">

            {/* Buy Now */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={
                !selectedVariant ||
                selectedVariant.stock === 0
              }
              className="
                flex-1
                py-4
                rounded-lg
                border
                border-black
                text-black
                font-semibold
                text-lg
                hover:bg-black
                hover:text-white
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              Buy Now
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={handleWishlist}
              aria-label={
                isInWishlist
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className="
                w-14
                rounded-lg
                border
                border-[#d90416]
                text-[#d90416]
                text-2xl
                flex
                items-center
                justify-center
                hover:bg-[#d90416]
                hover:text-white
                transition
              "
            >
              {isInWishlist ? "♥" : "♡"}
            </button>

          </div>

        </div>

        {/* Description */}
        <div className="mt-8 pb-6">

          <h3 className="text-lg font-semibold text-black">
            Description
          </h3>

          <p className="mt-3 text-gray-600 leading-relaxed">
            {product.description}
          </p>

        </div>

      </div>

    </div>
  );
}

export default ProductInfo;