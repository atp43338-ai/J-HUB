import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import Navbar from "../../home/components/Navbar";
import Footer from "../../home/components/Footer";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // SCROLL TO TOP WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  // DATA FROM CHECKOUT

  const orderData = location.state;

  // ==========================================
  // IF ORDER DATA IS MISSING
  // ==========================================

  if (!orderData?.orderId) {
    return (
      <div className="min-h-screen bg-white">

        <Navbar />

        <main
          className="
            min-h-screen
            flex
            items-center
            justify-center
            px-6
            pt-[100px]
          "
        >

          <div
            className="
              text-center
              max-w-md
              w-full
            "
          >

            {/* ERROR ICON */}

            <div className="flex justify-center mb-6">

              <div
                className="
                  w-20
                  h-20
                  rounded-full
                  bg-red-50
                  border
                  border-red-200
                  flex
                  items-center
                  justify-center
                "
              >

                <svg
                  className="w-10 h-10 text-[#d90416]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />

                </svg>

              </div>

            </div>

            <h1
              className="
                text-3xl
                font-bold
                text-gray-900
                mb-3
              "
            >
              Order Not Found
            </h1>

            <p
              className="
                text-gray-500
                mb-8
              "
            >
              We couldn't find the order information.
            </p>

            <button
              onClick={() =>
                navigate("/products")
              }
              className="
                bg-[#d90416]
                hover:bg-red-700
                text-white
                px-8
                py-3
                rounded-lg
                font-semibold
                transition
              "
            >
              Continue Shopping
            </button>

          </div>

        </main>

        <Footer />

      </div>
    );
  }

  // ==========================================
  // ORDER DETAILS
  // ==========================================

  const {
    orderId,
    total,
    status,
    paymentMethod,
  } = orderData;

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}

      <Navbar />

      {/* MAIN CONTENT */}

      <main
        className="
          min-h-screen
          pt-[120px]
          pb-20
        "
      >

        <div
          className="
            max-w-5xl
            mx-auto
            px-6
          "
        >

          {/* SUCCESS SECTION */}

          <section
            className="
              text-center
              py-12
            "
          >

            {/* SUCCESS ICON */}

            <div
              className="
                flex
                justify-center
                mb-8
              "
            >

              <div className="relative">

                {/* GREEN GLOW */}

                <div
                  className="
                    absolute
                    inset-0
                    rounded-full
                    bg-green-400/20
                    blur-2xl
                    scale-150
                  "
                ></div>

                {/* SUCCESS CIRCLE */}

                <div
                  className="
                    relative
                    w-24
                    h-24
                    rounded-full
                    bg-green-50
                    border-2
                    border-green-500
                    flex
                    items-center
                    justify-center
                  "
                >

                  <svg
                    className="w-12 h-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />

                  </svg>

                </div>

              </div>

            </div>

            {/* STATUS */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                text-green-700
                text-sm
                font-semibold
                mb-4
              "
            >

              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-green-500
                "
              ></span>

              Order Confirmed

            </div>

            {/* TITLE */}

            <h1
              className="
                text-4xl
                sm:text-5xl
                font-bold
                text-gray-900
                mb-4
              "
            >
              Order Placed Successfully!
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                text-gray-500
                max-w-xl
                mx-auto
                leading-relaxed
              "
            >
              Thank you for shopping with J-HUB.
              Your order has been successfully placed
              and is now being processed.
            </p>

          </section>

          {/* ORDER INFORMATION */}

          <section
            className="
              border-t
              border-gray-200
            "
          >

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                divide-y
                sm:divide-y-0
                sm:divide-x
                divide-gray-200
              "
            >

              {/* ORDER ID */}

              <div
                className="
                  py-6
                  sm:px-6
                  text-center
                  sm:text-left
                "
              >

                <p
                  className="
                    text-sm
                    text-gray-500
                    mb-2
                  "
                >
                  Order ID
                </p>

                <p
                  className="
                    font-semibold
                    text-gray-900
                    break-all
                  "
                >
                  {orderId}
                </p>

              </div>

              {/* TOTAL */}

              <div
                className="
                  py-6
                  sm:px-6
                  text-center
                  sm:text-left
                "
              >

                <p
                  className="
                    text-sm
                    text-gray-500
                    mb-2
                  "
                >
                  Total Amount
                </p>

                <p
                  className="
                    text-xl
                    font-bold
                    text-gray-900
                  "
                >
                  ₹{total}
                </p>

              </div>

              {/* PAYMENT */}

              <div
                className="
                  py-6
                  sm:px-6
                  text-center
                  sm:text-left
                "
              >

                <p
                  className="
                    text-sm
                    text-gray-500
                    mb-2
                  "
                >
                  Payment Method
                </p>

                <p
                  className="
                    font-semibold
                    text-gray-900
                  "
                >
                  {paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : paymentMethod}
                </p>

              </div>

              {/* STATUS */}

              <div
                className="
                  py-6
                  sm:px-6
                  text-center
                  sm:text-left
                "
              >

                <p
                  className="
                    text-sm
                    text-gray-500
                    mb-2
                  "
                >
                  Order Status
                </p>

                <p
                  className="
                    font-semibold
                    text-[#d90416]
                    capitalize
                  "
                >
                  {status?.replace(
                    /_/g,
                    " "
                  )}
                </p>

              </div>

            </div>

          </section>

          {/* ACTION BUTTONS */}

          <section
            className="
              flex
              flex-col
              sm:flex-row
              justify-center
              gap-4
              py-10
            "
          >

            {/* VIEW ORDER */}

            <button
              onClick={() =>
                navigate(
                  `/orders/${orderId}`
                )
              }
              className="
                bg-[#d90416]
                hover:bg-red-700
                text-white
                px-10
                py-3.5
                rounded-lg
                font-semibold
                transition-all
                duration-200
                hover:shadow-lg
                hover:shadow-red-200
                active:scale-[0.98]
              "
            >
              View Order
            </button>

            {/* CONTINUE SHOPPING */}

            <button
              onClick={() =>
                navigate("/products")
              }
              className="
                border
                border-gray-300
                hover:border-gray-400
                hover:bg-gray-50
                text-gray-900
                px-10
                py-3.5
                rounded-lg
                font-semibold
                transition-all
                duration-200
                active:scale-[0.98]
              "
            >
              Continue Shopping
            </button>

          </section>

          {/* BOTTOM MESSAGE */}

          <div
            className="
              text-center
              border-t
              border-gray-100
              pt-8
            "
          >

            <p className="text-sm text-gray-400">

              Thank you for choosing{" "}

              <span
                className="
                  font-semibold
                  text-gray-700
                "
              >
                J-HUB
              </span>

              .

            </p>

          </div>

        </div>

      </main>

      {/* FOOTER */}

      <Footer />

    </div>
  );
}

export default OrderSuccess;