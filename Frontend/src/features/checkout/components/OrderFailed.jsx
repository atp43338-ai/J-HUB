import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import Navbar from "../../home/components/Navbar";
import Footer from "../../home/components/Footer";

import {
  getOrderById,
  retryPaymentOrder,
  completeRetryPaymentOrder,
} from "../../order/services/orderService";
import { verifyPayment } from "../../payment/services/paymentService";
import toast from "react-hot-toast";

function OrderFailed() {
  const navigate = useNavigate();
  const location = useLocation();

  // =================================
  // STATES
  // =================================

  const [remainingTime, setRemainingTime] = useState(300);
  const [retryLoading, setRetryLoading] = useState(false);
  const [fetchedOrder, setFetchedOrder] = useState(null);

  // =================================
  // SCROLL TO TOP & CLEANUP RAZORPAY DOM ON MOUNT
  // =================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    const strayContainers = document.querySelectorAll(".razorpay-container");
    strayContainers.forEach((el) => el.remove());
    document.body.style.overflow = "unset"; // Restore scroll if Razorpay locked it

    return () => {
      const remaining = document.querySelectorAll(".razorpay-container");
      remaining.forEach((el) => el.remove());
      document.body.style.overflow = "unset";
    };
  }, []);

  // Save router state to sessionStorage for refresh safety
  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      try {
        sessionStorage.setItem(
          "paymentFailure",
          JSON.stringify(location.state)
        );
      } catch (error) {
        console.error("Failed to save payment failure data to sessionStorage:", error);
      }
    }
  }, [location.state]);

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
    errorMessage,
    reason,
    source,
    items,
    createdAt,
    paymentRetryExpiresAt,
  } = orderData;

  const displayMessage =
    errorMessage ||
    message ||
    (source === "wallet"
      ? "Wallet recharge could not be completed. You can try again from your wallet."
      : "Unfortunately, your payment could not be completed. You can retry the payment within 5 minutes.");

  // Effective Order Values (synchronized if user reloads)
  const effectiveOrderId =
    fetchedOrder?.orderId || orderId || fetchedOrder?._id;
  const effectiveCreatedAt =
    fetchedOrder?.createdAt || createdAt || orderData.createdAt;
  const effectiveExpiresAt =
    fetchedOrder?.paymentRetryExpiresAt || paymentRetryExpiresAt;
  const effectiveTotal =
    fetchedOrder?.finalPrice ??
    fetchedOrder?.totalAmount ??
    fetchedOrder?.finalAmount ??
    total ??
    0;
  const effectivePaymentMethod =
    fetchedOrder?.paymentMethod || paymentMethod || "Online Payment";

  // =================================
  // RE-SYNCHRONIZE ON RELOAD BY FETCHING ORDER DETAILS
  // =================================
  useEffect(() => {
    const idToFetch = orderId || storedFailure?.orderId;
    if (!idToFetch || source === "wallet") return;

    const fetchOrderDetails = async () => {
      try {
        const res = await getOrderById(idToFetch);
        if (res?.order) {
          setFetchedOrder(res.order);
        }
      } catch (err) {
        console.warn("Could not fetch order details on OrderFailed page:", err);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // =================================
  // 5 MINUTE COUNTDOWN TIMER (FROM CREATEDAT OR 300s DEFAULT)
  // =================================

  useEffect(() => {
    const calculateTime = () => {
      if (effectiveCreatedAt) {
        const createdMs = new Date(effectiveCreatedAt).getTime();
        const elapsedSec = Math.floor((Date.now() - createdMs) / 1000);
        return Math.max(0, 300 - elapsedSec);
      }
      if (effectiveExpiresAt) {
        const expiryMs = new Date(effectiveExpiresAt).getTime();
        const remainingSec = Math.floor((expiryMs - Date.now()) / 1000);
        return Math.max(0, remainingSec);
      }
      return 300;
    };

    setRemainingTime(calculateTime());

    const timer = setInterval(() => {
      setRemainingTime(calculateTime());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [effectiveCreatedAt, effectiveExpiresAt]);

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
  // RETRY PAYMENT (CALLS POST /api/orders/:orderId/retry-payment & TRIGGERS RAZORPAY)
  // =================================

  const handleRetryPayment = async () => {
    if (source === "wallet") {
      sessionStorage.removeItem("paymentFailure");
      navigate("/wallet");
      return;
    }

    if (!effectiveOrderId) {
      navigate("/checkout");
      return;
    }

    if (remainingTime <= 0) {
      toast.error("Payment retry window has expired. Please place a new order.");
      return;
    }

    try {
      setRetryLoading(true);

      // Call POST /api/orders/:orderId/retry-payment
      const data = await retryPaymentOrder(effectiveOrderId);

      if (!data || !data.order) {
        throw new Error(data?.message || "Failed to initialize payment retry");
      }

      if (!window.Razorpay) {
        toast.error("Razorpay SDK not loaded. Please refresh the page.");
        return;
      }

      const razorpayKey =
        data.razorpayKeyId ||
        data.order.key_id ||
        import.meta.env.VITE_RAZORPAY_KEY_ID;

      const options = {
        key: razorpayKey,
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        name: "J-HUB",
        description: `Payment Retry for Order #${effectiveOrderId}`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            setRetryLoading(true);

            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const token = localStorage.getItem("token");
            const verifyRes = await verifyPayment(verificationData, token);

            if (verifyRes.success) {
              try {
                rzp.close();
              } catch (e) {}
              const strayContainers =
                document.querySelectorAll(".razorpay-container");
              strayContainers.forEach((el) => el.remove());
              document.body.style.overflow = "unset";

              const completeRes = await completeRetryPaymentOrder(effectiveOrderId);
              toast.success("Payment completed successfully!");
              sessionStorage.removeItem("paymentFailure");

              navigate("/order-success", {
                replace: true,
                state: {
                  orderId: completeRes?.order?.orderId || effectiveOrderId,
                  total: completeRes?.order?.total || data.order.amount / 100,
                  finalAmount: completeRes?.order?.total || data.order.amount / 100,
                  totalAmount: completeRes?.order?.total || data.order.amount / 100,
                  finalPrice: completeRes?.order?.total || data.order.amount / 100,
                  status: completeRes?.order?.status || "processing",
                  paymentStatus: "paid",
                  paymentMethod: completeRes?.order?.paymentMethod || "CARD",
                },
              });
            }
          } catch (vErr) {
            console.error("Verification error during retry:", vErr);
            toast.error(vErr.message || "Payment verification failed.");
          } finally {
            setRetryLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            try {
              rzp.close();
            } catch (e) {}
            const strayContainers =
              document.querySelectorAll(".razorpay-container");
            strayContainers.forEach((el) => el.remove());
            document.body.style.overflow = "unset";

            toast("Payment retry cancelled.", { icon: "⚠️" });
            setRetryLoading(false);
          },
        },
        theme: {
          color: "#d90416",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        console.error("Razorpay retry payment failed:", resp);
        try {
          rzp.close();
        } catch (e) {}
        const strayContainers =
          document.querySelectorAll(".razorpay-container");
        strayContainers.forEach((el) => el.remove());
        document.body.style.overflow = "unset";

        toast.error(resp.error?.description || "Payment failed.");
        setRetryLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Retry payment error:", error);

      toast.error(
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
              {source === "wallet"
                ? "Wallet Top-Up Failed"
                : "Payment Unsuccessful"}
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
              {displayMessage}
            </p>

            {/* REASON BADGE */}
            {reason && (
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                  <span>Reason:</span>
                  <span className="capitalize">{String(reason).replace(/_/g, " ")}</span>
                </span>
              </div>
            )}

          </section>

          {/* RETRY TIMER */}
          {effectiveOrderId && (
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
                  Payment window expired. Please place a new order.
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
                  {effectiveOrderId || "N/A"}
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
                  ₹{effectiveTotal || 0}
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
                  {effectivePaymentMethod === "COD"
                    ? "Cash on Delivery"
                    : effectivePaymentMethod ||
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
                source === "wallet"
                  ? false
                  : remainingTime <= 0 ||
                    retryLoading ||
                    !effectiveOrderId
              }
              className={`
                px-8
                py-3.5
                rounded-lg
                font-semibold
                transition-all
                duration-200
                ${
                  source === "wallet" ||
                  (remainingTime > 0 &&
                  !retryLoading &&
                  effectiveOrderId)
                    ? "bg-[#d90416] hover:bg-red-700 text-white hover:shadow-lg hover:shadow-red-200 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {retryLoading
                ? "Processing..."
                : source === "wallet" || remainingTime > 0
                ? "Retry Payment"
                : "Payment Expired"}
            </button>

            {/* GO TO ORDERS / WALLET */}
            <button
              onClick={() => {
                sessionStorage.removeItem("paymentFailure");
                navigate(source === "wallet" ? "/wallet" : "/orders");
              }}
              className="
                border
                border-gray-300
                hover:border-gray-400
                hover:bg-gray-50
                text-gray-900
                px-8
                py-3.5
                rounded-lg
                font-semibold
                transition-all
                duration-200
                active:scale-[0.98]
                cursor-pointer
              "
            >
              {source === "wallet" ? "Go to Wallet" : "Go to Orders"}
            </button>

            {/* GO TO HOME / CONTINUE SHOPPING */}
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
                px-8
                py-3.5
                rounded-lg
                font-semibold
                transition-all
                duration-200
                active:scale-[0.98]
                cursor-pointer
              "
            >
              Go to Home
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