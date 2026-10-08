import OrderStatus from "./OrderStatus";

function OrderTable({
  orders,
  onViewDetails,
}) {
  if (!orders || orders.length === 0) {
    return (
      <div className="border border-gray-200 rounded-xl py-16 text-center">
        <p className="text-gray-500">
          No orders found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl">

      <table className="w-full min-w-[900px]">

        <thead className="bg-gray-50 border-b border-gray-200">

          <tr>

            <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
              Order ID
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
              Date
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
              User
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
              Amount
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
              Status
            </th>

            <th className="px-5 py-4 text-center text-sm font-semibold text-gray-700">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
            >

              {/* Order ID */}
              <td className="px-5 py-4">
                <span className="font-semibold text-black">
                  #{order.id}
                </span>
              </td>

              {/* Date */}
              <td className="px-5 py-4 text-sm text-gray-600">
                {new Date(order.date).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </td>

              {/* User */}
              <td className="px-5 py-4">

                <p className="font-medium text-black">
                  {order.user.name}
                </p>

                <p className="text-sm text-gray-500">
                  {order.user.email}
                </p>

              </td>

              {/* Amount */}
              <td className="px-5 py-4 font-semibold text-black">
                ₹{order.amount.toLocaleString("en-IN")}
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <OrderStatus
                  status={order.status}
                />
              </td>

              {/* Action */}
              <td className="px-5 py-4 text-center">

                <button
                  type="button"
                  onClick={() =>
                    onViewDetails(order.id)
                  }
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                >
                  View Details
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default OrderTable;