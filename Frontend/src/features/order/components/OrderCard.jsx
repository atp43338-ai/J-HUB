import { useNavigate } from "react-router";
import OrderStatus from "./OrderStatus";

function OrderCard({ order }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <p className="text-sm text-gray-500">
            Order ID
          </p>

          <h2 className="font-bold text-black text-lg">
            #{order.id}
          </h2>
        </div>

        <OrderStatus status={order.status} />

      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">

        <div>
          <p className="text-sm text-gray-500">
            Order Date
          </p>

          <p className="font-medium text-black mt-1">
            {new Date(
              order.date
            ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Items
          </p>

          <p className="font-medium text-black mt-1">
            {order.items.length} items
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Total
          </p>

          <p className="font-bold text-black mt-1">
            ₹
            {order.totalAmount.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-t border-gray-100 mt-6 pt-5">

        <p className="text-sm text-gray-500">
          {order.items[0]?.name}
          {order.items.length > 1 &&
            ` + ${order.items.length - 1} more`}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(`/orders/${order.id}`)
          }
          className="px-5 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
        >
          View Details
        </button>

      </div>

    </div>
  );
}

export default OrderCard;