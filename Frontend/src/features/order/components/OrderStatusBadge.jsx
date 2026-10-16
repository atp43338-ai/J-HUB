function OrderStatusBadge({ status }) {
  const normalized = String(status || "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    processing: "bg-blue-100 text-blue-800 border border-blue-200",
    shipped: "bg-purple-100 text-purple-800 border border-purple-200",
    delivered: "bg-green-100 text-green-800 border border-green-200",
    cancelled: "bg-red-100 text-red-800 border border-red-200",
    canceled: "bg-red-100 text-red-800 border border-red-200",
    outfordelivery: "bg-purple-100 text-purple-800 border border-purple-200",
    paymentfailed: "bg-red-100 text-red-800 border border-red-200",
    paymentexpired: "bg-gray-100 text-gray-700 border border-gray-200",
    expired: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  const displayLabels = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    canceled: "Cancelled",
    outfordelivery: "Out for Delivery",
    paymentfailed: "Payment Failed",
    paymentexpired: "Payment Expired",
    expired: "Payment Expired",
  };

  const displayText =
    displayLabels[normalized] ||
    (status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Pending");

  const badgeClass =
    statusStyles[normalized] ||
    "bg-gray-100 text-gray-700 border border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}
    >
      {displayText}
    </span>
  );
}

export default OrderStatusBadge;
