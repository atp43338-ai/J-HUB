import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import Navbar from "../../home/components/Navbar";
import Footer from "../../home/components/Footer";

import {
  retryPaymentOrder,
  completeRetryPaymentOrder,
} from "../../order/services/orderService";

function OrderFailed() {
  const navigate = useNavigate();
  const location = useLocation();

  // =================================
  // STATES
  // =================================

  const [remainingTime, setRemainingTime] =
    useState(0);

  const [retryLoading, setRetryLoading] =
    useState(false);

  // =================================
  // SCROLL TO TOP WHEN PAGE OPENS
  // =================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  // =================================
  // GET PAYMENT FAILURE DATA
  // =================================

  let storedFailure = null;

  try {
    const failureData =
      sessionStorage.getItem("paymentFailure");

    if (failureData) {
      storedFailure = JSON.parse(
        failureData
      );
    }
  } catch (error) {
    console.error(
      "Failed to read payment failure data:",
      error
    );
  }

  // First use router state.
  // If router state is not available,
  // use sessionStorage data.
  const orderData =
    location.state ||
    storedFailure ||
    {};

  const {
    orderId,
    total,
    paymentMethod,
    message,
    items,
    paymentRetryExpiresAt,
  } = orderData;

  // =================================
  // 5 MINUTE COUNTDOWN
  // =================================

  useEffect(() => {
    if (!paymentRetryExpiresAt) {
      setRemainingTime(0);
      return;
    }

    const expiryTime = new Date(
      paymentRetryExpiresAt
    ).getTime();

    const updateTimer = () => {
      const now = Date.now();

      const difference =
        expiryTime - now;

      if (difference <= 0) {
        setRemainingTime(0);
        return;
      }

      setRemainingTime(
        Math.floor(difference / 1000)
      );
    };

    updateTimer();

    const timer = setInterval(
      updateTimer,
      1000
    );

    return () => {
      clearInterval(timer);
    };
  }, [paymentRetryExpiresAt]);

  // =================================
  // FORMAT COUNTDOWN
  // =================================

  const minutes = Math.floor(
    remainingTime / 60
  );

  const seconds =
    remainingTime % 60;

  const formattedTime = `${String(
    minutes
  ).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  // =================================
  // RETRY PAYMENT
  // =================================

const handleRetryPayment = async () => {
  if (!orderId) {
    return;
  }

  if (remainingTime <= 0) {
    return;
  }

  try {
    setRetryLoading(true);

    // Check whether retry is still available
    const data = await retryPaymentOrder(orderId);

    console.log("Retry payment allowed:", data);

    // Go to checkout with the existing failed order
    navigate("/checkout", {
      state: {
        items: items || [],
        retryOrderId: orderId,
        retryPayment: true,
        retryTotal: total,
        retryPaymentMethod: paymentMethod,
        retryPaymentExpiresAt: paymentRetryExpiresAt,
      },
    });
  } catch (error) {
    console.error("Retry payment error:", error);

    alert(
      error.message ||
        "Payment retry is no longer available"
    );
  } finally {
    setRetryLoading(false);
  }
};

  // =================================
  // CONTINUE SHOPPING
  // =================================

  const handleContinueShopping = () => {
    sessionStorage.removeItem(
      "paymentFailure"
    );

    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="min-h-screen pt-[120px] pb-20">

        <div className="max-w-5xl mx-auto px-6">

          {/* FAILED SECTION */}
          <section className="text-center py-12">

            {/* FAILED ICON */}
            <div className="flex justify-center mb-8">

              <div className="relative">

                {/* RED GLOW */}
                <div
                  className="
                    absolute
                    inset-0
                    rounded-full
                    bg-red-400/20
                    blur-2xl
                    scale-150
                    animate-pulse
                  "
                ></div>

                {/* ICON CIRCLE */}
                <div
                  className="
                    relative
                    w-24
                    h-24
                    rounded-full
                    bg-red-50
                    border-2
                    border-red-500
                    flex
                    items-center
                    justify-center
                  "
                >

                  <svg
                    className="w-12 h-12 text-[#d90416]"
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

            </div>

            {/* STATUS */}
            <div
              className="
                inline-flex
                items-center
                gap-2
                text-[#d90416]
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
                  bg-[#d90416]
                "
              ></span>

              Payment Failed

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
              Payment Unsuccessful
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
              {message ||
                "Unfortunately, your payment could not be completed. You can retry the payment within 5 minutes."}
            </p>

          </section>

          {/* RETRY TIMER */}
          {orderId && (
            <section
              className="
                bg-red-50
                border
                border-red-100
                rounded-xl
                p-6
                text-center
                max-w-md
                mx-auto
                mb-8
              "
            >

              <p
                className="
                  text-sm
                  text-gray-500
                  mb-2
                "
              >
                Retry payment available for
              </p>

              <p
                className="
                  text-4xl
                  font-bold
                  text-[#d90416]
                  tracking-wider
                "
              >
                {formattedTime}
              </p>

              {remainingTime > 0 ? (
                <p
                  className="
                    text-xs
                    text-gray-500
                    mt-2
                  "
                >
                  Please complete your payment
                  before the timer expires.
                </p>
              ) : (
                <p
                  className="
                    text-sm
                    text-red-600
                    font-semibold
                    mt-2
                  "
                >
                  Payment retry time has expired.
                </p>
              )}

            </section>
          )}

          {/* PAYMENT INFORMATION */}
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
                sm:grid-cols-3
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
                    text-sm
                    font-bold
                    text-gray-900
                    break-all
                  "
                >
                  {orderId || "N/A"}
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
                  ₹{total || 0}
                </p>

              </div>

              {/* PAYMENT METHOD */}
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
                    : paymentMethod ||
                      "Online Payment"}
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

            {/* RETRY PAYMENT */}
            <button
              onClick={handleRetryPayment}
              disabled={
                remainingTime <= 0 ||
                retryLoading ||
                !orderId
              }
              className={`
                px-10
                py-3.5
                rounded-lg
                font-semibold
                transition-all
                duration-200
                ${
                  remainingTime > 0 &&
                  !retryLoading &&
                  orderId
                    ? "bg-[#d90416] hover:bg-red-700 text-white hover:shadow-lg hover:shadow-red-200"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {retryLoading
                ? "Checking..."
                : remainingTime > 0
                ? "Retry Payment"
                : "Retry Expired"}
            </button>

            {/* CONTINUE SHOPPING */}
            <button
              onClick={
                handleContinueShopping
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
              Your order details have been saved
              so you can retry the payment within
              the available time.
            </p>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default OrderFailed;