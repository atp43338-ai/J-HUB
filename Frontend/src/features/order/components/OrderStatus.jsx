
const orderSteps = [
  { key: "pending", label: "Order Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function OrderStatus({ status }) {
  const normalizedStatus = String(status || "pending")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  const statusMap = {
    pending: 0,
    orderplaced: 0,
    processing: 1,
    confirmed: 1,
    shipped: 2,
    delivered: 3,
  };

  const currentStep = statusMap[normalizedStatus] ?? -1;
  const isCancelled = [
    "cancelled",
    "canceled",
    "failed",
    "returned",
  ].includes(normalizedStatus);

  if (isCancelled) {
    return (
      <div className="mt-6 border-t border-gray-100 pt-4">
        <p className="text-sm font-semibold text-red-600 capitalize">
          Order {status}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-6 border-t border-gray-100 pt-5">
      <div className="flex items-center w-full">
        {orderSteps.map((step, index) => {
          const completed = index <= currentStep;
          const active = index === currentStep;

          return (
            <div
              key={step.key}
              className="flex flex-1 items-center min-w-0"
            >
              {/* Stage */}
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition ${
                    completed
                      ? "bg-[#d90416] border-[#d90416] text-white"
                      : "bg-gray-100 border-gray-200 text-gray-400"
                  }`}
                >
                  {index === 0 && (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="7" width="18" height="14" rx="2" />
                      <path d="M8 7V5a4 4 0 0 1 8 0v2" />
                    </svg>
                  )}

                  {index === 1 && (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  )}

                  {index === 2 && (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 7h11v11H3z" />
                      <path d="M14 11h4l3 3v4h-7z" />
                      <circle cx="7.5" cy="19" r="1.5" />
                      <circle cx="17.5" cy="19" r="1.5" />
                    </svg>
                  )}

                  {index === 3 && (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  )}
                </div>

                <p
                  className={`text-[10px] sm:text-xs mt-2 text-center ${
                    active
                      ? "text-[#d90416] font-semibold"
                      : completed
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connecting line */}
              {index < orderSteps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 min-w-2 mx-1 sm:mx-2 mb-5 ${
                    index < currentStep
                      ? "bg-[#d90416]"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderStatus;
