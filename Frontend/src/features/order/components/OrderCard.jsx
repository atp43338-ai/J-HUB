import { useNavigate } from "react-router";
import OrderStatus from "./OrderStatus";

function OrderCard({ order }) {
  const navigate = useNavigate();

  // Product image URL
  const getImageUrl = (image) => {
    if (!image) return "";

    // Already a complete URL
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // Backend uploaded image
    return `http://localhost:5000${
      image.startsWith("/") ? "" : "/"
    }${image}`;
  };

  const firstItem = order.items?.[0];

  return (
    <div className="w-full min-w-0 bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* Order ID */}
        <div className="min-w-0">
          <p className="text-sm text-gray-500">
            Order ID
          </p>

          <h2 className="font-bold text-black text-lg break-all">
            #{order.id}
          </h2>
        </div>

        {/* Total and View Details */}
        <div className="flex items-center justify-between sm:justify-end gap-4">

          <div>
            <p className="text-xs text-gray-500">
              Total Amount
            </p>

            <p className="font-bold text-black text-lg">
              ₹
              {(order.totalAmount || 0).toLocaleString("en-IN")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/orders/${order.id}`)}
            className="px-4 py-2.5 bg-[#d90416] text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition whitespace-nowrap"
          >
            View Details →
          </button>

        </div>
      </div>

      {/* Product and Order Details */}
      <div className="flex flex-col sm:flex-row gap-5 mt-5">

        {/* Product Image */}
        <div className="w-full sm:w-30 h-40 sm:h-40 shrink-0 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden">

          {firstItem?.image ? (
            <img
              src={getImageUrl(firstItem.image)}
              alt={firstItem.name || "Ordered product"}
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="text-sm text-gray-400">
              No image
            </span>
          )}

        </div>

        {/* Order Information */}
        <div className="flex-1 min-w-0">

          {/* Product Name */}
          <h3 className="font-semibold text-black text-base mb-4">
            {firstItem?.name || "Product"}

            {order.items?.length > 1 &&
              ` + ${order.items.length - 1} more`}
          </h3>

          {/* Order Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Order Date */}
            <div>
              <p className="text-sm text-gray-500">
                Order Date
              </p>

              <p className="font-medium text-black mt-1">
                {order.date
                  ? new Date(order.date).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
              </p>
            </div>

            {/* Items */}
            <div>
              <p className="text-sm text-gray-500">
                Items
              </p>

              <p className="font-medium text-black mt-1">
                {order.items?.length || 0} items
              </p>
            </div>

            {/* Product Price */}
            <div>
              <p className="text-sm text-gray-500">
                Product Price
              </p>

              <p className="font-medium text-black mt-1">
                ₹
                {(firstItem?.total ??
                  firstItem?.price ??
                  0
                ).toLocaleString("en-IN")}
              </p>
            </div>

          </div>

          {/* Size and Quantity */}
          {firstItem && (
            <div className="mt-4 text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">

              {firstItem.size && (
                <span>
                  Size: {firstItem.size}
                </span>
              )}

              {firstItem.quantity && (
                <span>
                  Quantity: {firstItem.quantity}
                </span>
              )}

            </div>
          )}

        </div>
      </div>

      {/* Order Status Timeline */}
      <OrderStatus status={order.status} />

    </div>
  );
}

export default OrderCard;