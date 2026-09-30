import { useLocation, useNavigate } from "react-router";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // ORDER DATA FROM CHECKOUT
  const orderData = location.state;

  // IF ORDER DATA IS MISSING
  if (!orderData?.orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-md w-full">

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Order Not Found
          </h1>

          <p className="text-gray-500 mb-6">
            We couldn't find the order information.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="bg-[#d90416] hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Continue Shopping
          </button>

        </div>

      </div>
    );
  }

  // ORDER DETAILS
  const {
    orderId,
    total,
    status,
    paymentMethod,
  } = orderData;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-lg">

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl px-6 sm:px-10 py-10 text-center animate-[fadeUp_0.6s_ease-out]">

          {/* SUCCESS ICON */}
          <div className="flex justify-center mb-7">

            <div className="relative">

              {/* OUTER GLOW */}
              <div className="absolute inset-0 rounded-full bg-green-400/20 blur-xl scale-125"></div>

              {/* CIRCLE */}
              <div className="relative w-24 h-24 rounded-full bg-green-50 border border-green-200 flex items-center justify-center animate-[successPop_0.5s_ease-out]">

                {/* CHECK */}
                <svg
                  viewBox="0 0 52 52"
                  className="w-12 h-12"
                  fill="none"
                >
                  <circle
                    cx="26"
                    cy="26"
                    r="24"
                    stroke="#16a34a"
                    strokeWidth="2"
                    className="opacity-30"
                  />

                  <path
                    d="M14 27L22 35L39 17"
                    stroke="#16a34a"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-[checkDraw_0.6s_ease-out_0.3s_both]"
                  />
                </svg>

              </div>

            </div>

          </div>

          {/* SMALL STATUS */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium mb-4">

            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>

            Order Confirmed

          </div>

          {/* TITLE */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 !text-black">

            Order Placed Successfully!

          </h1>

          <p className="text-gray-500 leading-relaxed max-w-sm mx-auto mb-8">

            Thank you for your purchase.
            Your order has been successfully placed.

          </p>

          {/* ORDER DETAILS */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left mb-8">

            {/* ORDER ID */}
            <div className="flex justify-between items-center gap-4 pb-4 border-b border-gray-200">

              <span className="text-sm text-gray-500">
                Order ID
              </span>

              <span className="text-sm font-semibold text-gray-900 text-right break-all">
                {orderId}
              </span>

            </div>

            {/* TOTAL */}
            <div className="flex justify-between items-center gap-4 py-4 border-b border-gray-200">

              <span className="text-sm text-gray-500">
                Total Amount
              </span>

              <span className="font-bold text-gray-900">
                ₹{total}
              </span>

            </div>

            {/* PAYMENT */}
            <div className="flex justify-between items-center gap-4 py-4 border-b border-gray-200">

              <span className="text-sm text-gray-500">
                Payment Method
              </span>

              <span className="text-sm font-semibold text-gray-900">

                {paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : paymentMethod}

              </span>

            </div>

            {/* STATUS */}
            <div className="flex justify-between items-center gap-4 pt-4">

              <span className="text-sm text-gray-500">
                Order Status
              </span>

              <span className="text-sm font-semibold text-[#d90416] capitalize">

                {status?.replace(/_/g, " ")}

              </span>

            </div>

          </div>

          {/* BUTTONS */}
          <div className="space-y-3">

            {/* VIEW ORDER */}
            <button
              onClick={() =>
                navigate(`/orders/${orderId}`)
              }
              className="w-full bg-[#d90416] hover:bg-red-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-red-200 active:scale-[0.98]"
            >
              View Order
            </button>

            {/* CONTINUE SHOPPING */}
            <button
              onClick={() =>
                navigate("/products")
              }
              className="w-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-900 py-3.5 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98]"
            >
              Continue Shopping
            </button>

          </div>

        </div>

        {/* BOTTOM TEXT */}
        <p className="text-center text-gray-400 text-sm mt-6 animate-[fadeUp_0.8s_ease-out]">

          Thank you for choosing J-HUB.

        </p>

      </div>

      {/* ANIMATION STYLES */}
      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes successPop {
            0% {
              opacity: 0;
              transform: scale(0.5);
            }

            70% {
              transform: scale(1.08);
            }

            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes checkDraw {
            from {
              stroke-dasharray: 50;
              stroke-dashoffset: 50;
            }

            to {
              stroke-dasharray: 50;
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>

    </div>
  );
}

export default OrderSuccess;