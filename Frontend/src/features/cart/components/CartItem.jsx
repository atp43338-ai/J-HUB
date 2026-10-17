function CartItem({ item, onQuantityChange, onRemove, loading = false }) {

  const selectedVariant = item.product?.variants?.find(
    (variant) => variant.size === item.size
  );

  const stock = selectedVariant?.stock ?? item.product?.stock ?? 0;

  const isOutOfStock = stock === 0;

  const quantityExceeded = item.quantity > stock;

  const handleDecrease = () => {
    if (item.quantity > 1 && !loading) {
      onQuantityChange(item._id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < stock && item.quantity < 5 && !loading) {
      onQuantityChange(item._id, item.quantity + 1);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex gap-5">

      {/* Product Image */}
      <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={
            item.product.images?.[0]?.startsWith("http")
              ? item.product.images[0].replace("http://localhost:5000", "https://api.afsal.online")
              : `https://api.afsal.online${item.product.images?.[0]}`
          }
          alt={item.product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Information */}
      <div className="flex-1">

        <h3 className="text-lg font-semibold text-black">
          {item.product.name}
        </h3>

        <p className="mt-2 text-gray-500">
          Size: {item.size}
        </p>

        {(() => {
          const originalPrice = Number(item.product.price) || 0;
          const offerDiscount = Number(item.product.offerDiscount) || 0;
          const offerPrice = Number(item.product.offerPrice);

          const hasOffer = offerDiscount > 0 && Number.isFinite(offerPrice);
          const productDiscount = Number(item.product.discount) || 0;

          const unitPrice = hasOffer
            ? offerPrice
            : productDiscount > 0
            ? originalPrice - (originalPrice * productDiscount) / 100
            : originalPrice;

          const hasDiscount = hasOffer || productDiscount > 0;

          return hasDiscount ? (
            <div className="mt-2 flex items-center gap-3">
              <span className="text-lg font-bold text-[#d90416]">
                ₹{unitPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          ) : (
            <p className="mt-2 text-lg font-bold text-black">
              ₹{originalPrice.toLocaleString("en-IN")}
            </p>
          );
        })()}

        {/* Stock Status */}
        {isOutOfStock && (
          <p className="mt-2 text-red-600 font-semibold">
            Out of Stock
          </p>
        )}

        {!isOutOfStock && quantityExceeded && (
          <p className="mt-2 text-red-600 font-semibold">
            Only {stock} available
          </p>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-3 mt-4">

          <button
            type="button"
            onClick={handleDecrease}
            disabled={
              item.quantity <= 1 || loading
            }
            className="
              w-8 h-8
              border
              rounded-lg
              text-black
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:bg-gray-100
            "
          >
            -
          </button>

          <span className="text-black font-semibold">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={handleIncrease}
            disabled={
              item.quantity >= stock || item.quantity >= 5 || loading
            }
            className="
              w-8 h-8
              border
              rounded-lg
              text-black
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:bg-gray-100
            "
          >
            +
          </button>

        </div>

      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(item._id)}
        disabled={loading}
        className="text-red-600 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Remove
      </button>

    </div>
  );
}

export default CartItem;