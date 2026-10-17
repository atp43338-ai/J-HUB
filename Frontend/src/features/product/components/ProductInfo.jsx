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
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    removeProductOnAddToCart,
  } = useWishlist();

  // Maximum allowed purchase quantity per item
  const MAX_QUANTITY = 5;

  // Find selected variant
  const selectedVariant = product.variants?.find(
    (variant) => variant.size === selectedSize
  );

  // Check whether product is in wishlist
  const isProductInWishlist = isInWishlist(product?._id);

  // Add to Cart
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add products to cart");
      navigate("/login");
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

    if (quantity > MAX_QUANTITY) {
      toast.error(`Maximum quantity allowed is ${MAX_QUANTITY}`);
      return;
    }

    if (selectedVariant.stock < quantity) {
      toast.error("Not enough stock");
      return;
    }

    try {
      // Add product to cart (backend automatically pulls from wishlist)
      await addToCart({
        productId: product._id,
        size: selectedSize,
        quantity,
      });

      // Refresh cart count
      await refreshCartCount();

      // Instantly remove product from wishlist state and sync badge count
      removeProductOnAddToCart(product._id);

      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Buy Now
  const handleBuyNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
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

    if (quantity > MAX_QUANTITY) {
      toast.error(`Maximum quantity allowed is ${MAX_QUANTITY}`);
      return;
    }

    if (selectedVariant.stock < quantity) {
      toast.error("Not enough stock");
      return;
    }

    // Immediately remove from wishlist if present
    if (isProductInWishlist) {
      removeProductOnAddToCart(product._id);
      removeFromWishlist(product._id, true);
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
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to manage your wishlist");
      navigate("/login");
      return;
    }

    try {
      if (isProductInWishlist) {
        await removeFromWishlist(product._id);
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
        {(() => {
          const originalPrice = Number(product.price) || 0;
          const productDiscount = Number(product.discount) || 0;
          const offerDiscount = Number(product.offerDiscount) || 0;

          const hasOffer = offerDiscount > 0;
          const activeDiscount = hasOffer ? offerDiscount : productDiscount;

          const displayPrice = hasOffer
            ? Number(product.offerPrice)
            : originalPrice - (originalPrice * productDiscount) / 100;

          return activeDiscount > 0 ? (
            <div className="mt-4">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Discounted Price */}
                <p className="text-3xl font-bold text-[#d90416]">
                  ₹{displayPrice.toFixed(2)}
                </p>

                {/* Original Price */}
                <p className="text-lg text-gray-800 line-through">
                  ₹{originalPrice.toFixed(2)}
                </p>

                {/* Discount Percentage */}
                <span className="text-sm font-semibold text-[#d90416]">
                  {activeDiscount}% OFF
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-3xl font-bold text-black">
                ₹{originalPrice.toFixed(2)}
              </p>
            </div>
          );
        })()}

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

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
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
                    px-3.5
                    sm:px-5
                    py-2
                    border
                    rounded-lg
                    text-xs
                    sm:text-sm
                    font-semibold
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
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
                disabled={quantity <= 1}
                className="
                  w-10
                  h-10
                  border
                  border-gray-300
                  rounded-lg
                  text-xl
                  text-black
                  hover:border-[#d90416]
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >
                -
              </button>

              <span className="text-lg font-semibold text-black">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (quantity >= MAX_QUANTITY) {
                    toast.error(`Maximum limit is ${MAX_QUANTITY} units`);
                    return;
                  }
                  if (quantity >= selectedVariant.stock) {
                    toast.error("Cannot exceed available stock");
                    return;
                  }
                  setQuantity((prev) => prev + 1);
                }}
                disabled={
                  quantity >= MAX_QUANTITY ||
                  quantity >= selectedVariant.stock
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
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 sm:mt-8 flex flex-col gap-3">
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
              py-3
              sm:py-4
              rounded-lg
              bg-[#d90416]
              hover:bg-[#b90312]
              text-white
              font-semibold
              text-base
              sm:text-lg
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Add to Cart
          </button>

          {/* Buy Now + Wishlist */}
          <div className="flex gap-2.5 sm:gap-3">
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
                py-3
                sm:py-4
                rounded-lg
                border
                border-black
                text-black
                font-semibold
                text-base
                sm:text-lg
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
                isProductInWishlist
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className="
                w-12
                sm:w-14
                shrink-0
                rounded-lg
                border
                border-[#d90416]
                text-[#d90416]
                text-xl
                sm:text-2xl
                flex
                items-center
                justify-center
                hover:bg-[#d90416]
                hover:text-white
                transition
              "
            >
              {isProductInWishlist ? "♥" : "♡"}
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