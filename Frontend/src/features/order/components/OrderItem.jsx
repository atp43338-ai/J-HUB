function OrderItem({
  item,
  onCancelItem,
  onReturnItem,
}) {
  const itemTotal =
    item.price * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-5 border-b border-gray-200 pb-5 last:border-b-0 last:pb-0">

      {/* Image */}
      <div className="w-full sm:w-28 h-28 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={
            item.image?.startsWith("http")
              ? item.image
              : `http://localhost:5000${item.image}`
          }
          alt={item.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Details */}
      <div className="flex-1">

        <h3 className="text-lg font-semibold text-black">
          {item.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Size: {item.size}
        </p>

        <p className="text-sm text-gray-500">
          Quantity: {item.quantity}
        </p>

        <p className="text-sm text-gray-500">
          Price: ₹
          {item.price.toLocaleString("en-IN")}
        </p>

        <p className="font-bold text-black mt-2">
          Total: ₹
          {itemTotal.toLocaleString("en-IN")}
        </p>

        {/* Cancel Product */}
        {item.canCancel && (
          <button
            type="button"
            onClick={() => onCancelItem(item)}
            className="mt-3 text-sm text-red-600 font-semibold hover:underline"
          >
            Cancel Item
          </button>
        )}

        {/* Return Product */}
        {item.canReturn && (
          <button
            type="button"
            onClick={() => onReturnItem(item)}
            className="mt-3 ml-4 text-sm text-[#d90416] font-semibold hover:underline"
          >
            Return Item
          </button>
        )}

      </div>

    </div>
  );
}

export default OrderItem;