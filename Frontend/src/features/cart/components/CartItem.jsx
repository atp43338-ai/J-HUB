function CartItem({ item, onQuantityChange, onRemove }) {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item._id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(item._id, item.quantity + 1);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex gap-5">

      {/* Product Image */}
      <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={`http://localhost:5000${item.product.images?.[0]}`}
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

        <p className="mt-2 text-lg font-bold text-black">
          ₹{item.product.price}
        </p>

        {/* Quantity */}
        <div className="flex items-center gap-3 mt-4">

          <button
            type="button"
            onClick={handleDecrease}
            disabled={item.quantity === 1}
            className="
              w-8 h-8
              border
              rounded-lg
              text-black
              disabled:opacity-40
              disabled:cursor-not-allowed
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
            className="
              w-8 h-8
              border
              rounded-lg
              text-black
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
      className="text-red-600 hover:text-red-800"
   >
     Remove
   </button>

    </div>
  );
}

export default CartItem;