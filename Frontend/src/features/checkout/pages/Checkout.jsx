import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router";

import Navbar from "../../home/components/Navbar";

import Footer from "../../home/components/Footer";

import CheckoutAddress from "../components/CheckoutAddress";

import CheckoutItems from "../components/CheckoutItems";

import CheckoutSummary from "../components/CheckoutSummary";

import PaymentMethod from "../components/PaymentMethod";

import CouponSection from "../components/CouponSection";

import { getAddresses } from "../../address/services/addressService";

import {
  createOrder,
  createFailedPaymentOrder,
  completeRetryPaymentOrder,
} from "../../order/services/orderService";

import { removeCartItem } from "../../cart/services/cartService";

import {
  createPaymentOrder,
  verifyPayment,
} from "../../payment/services/paymentService";

import { applyCoupon } from "../../coupon/services/couponService";

import toast from "react-hot-toast";

function Checkout() {
  const navigate = useNavigate();

  const location = useLocation();

  // ITEMS RECEIVED FROM BUY NOW
  const buyNowItems = location.state?.items || [];

  // RETRY PAYMENT INFORMATION
  const retryOrderId = location.state?.retryOrderId;

  const isRetryPayment =
    location.state?.retryPayment === true;

  // STATES
  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] =
    useState("");

  const [addressLoading, setAddressLoading] =
    useState(true);

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [placingOrder, setPlacingOrder] =
    useState(false);

  // COUPON STATES
  const [couponCode, setCouponCode] =
    useState("");

  const [couponDiscount, setCouponDiscount] =
    useState(0);

  const [appliedCoupon, setAppliedCoupon] =
    useState("");

  const [couponLoading, setCouponLoading] =
    useState(false);

  // CHECK CHECKOUT ITEMS
  useEffect(() => {
    if (!buyNowItems.length) {
      navigate("/products");
    }
  }, [buyNowItems.length, navigate]);

  // FETCH ADDRESSES
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setAddressLoading(true);

        const data = await getAddresses(token);

        const userAddresses =
          data.addresses || [];

        setAddresses(userAddresses);

        // Select default address
        const defaultAddress =
          userAddresses.find(
            (address) => address.isDefault
          );

        if (defaultAddress) {
          setSelectedAddress(
            defaultAddress._id
          );
        } else if (
          userAddresses.length > 0
        ) {
          setSelectedAddress(
            userAddresses[0]._id
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch addresses:",
          error
        );

        toast.error(
          error.message ||
            "Failed to load addresses"
        );
      } finally {
        setAddressLoading(false);
      }
    };

    fetchAddresses();
  }, [navigate]);

  // CONVERT PRODUCTS FOR CHECKOUT UI
  const items = buyNowItems.map((item) => {
    const originalPrice =
      Number(item.product.price) || 0;

    const offerPrice =
      Number(item.product.offerPrice) || 0;

    const price =
      item.product.offerDiscount > 0 &&
      offerPrice > 0
        ? offerPrice
        : originalPrice;

    return {
      id: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0],
      size: item.size,
      quantity: item.quantity,
      price,
      originalPrice,
      offerDiscount:
        item.product.offerDiscount || 0,
    };
  });

  // PRICE CALCULATION
  const subtotal = items.reduce(
    (total, item) =>
      total +
      item.originalPrice * item.quantity,
    0
  );

  const discountedSubtotal = items.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  const discount =
    subtotal - discountedSubtotal;

  const tax = 0;

  const shipping = 0;

  const finalPrice =
    discountedSubtotal -
    couponDiscount +
    tax +
    shipping;

  // APPLY COUPON
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      setCouponLoading(true);

      const data = await applyCoupon(
        couponCode.trim(),
        discountedSubtotal
      );

      setCouponDiscount(
        data.couponDiscount || 0
      );

      setAppliedCoupon(
        data.couponCode ||
          couponCode.trim().toUpperCase()
      );

      toast.success(
        "Coupon applied successfully"
      );
    } catch (error) {
      setCouponDiscount(0);
      setAppliedCoupon("");

      toast.error(
        error.message ||
          "Failed to apply coupon"
      );
    } finally {
      setCouponLoading(false);
    }
  };
  

  const removeOrderedItemsFromCart = async () => {
  try {
    for (const item of buyNowItems) {
      if (item._id) {
        await removeCartItem(item._id);
      }
    }

    window.dispatchEvent(new Event("cartUpdated"));

    console.log("Ordered items removed from cart");
  } catch (error) {
    console.error(
      "Failed to remove ordered items from cart:",
      error
    );
  }
};

  // PLACE ORDER
  const handlePlaceOrder = async () => {
    // Check address
    if (!selectedAddress) {
      toast.error(
        "Please select an address"
      );

      return;
    }

    // Check payment method
    if (!paymentMethod) {
      toast.error(
        "Please select a payment method"
      );

      return;
    }

    // Check items
    if (!buyNowItems.length) {
      toast.error(
        "No products found"
      );

      return;
    }

    try {
      setPlacingOrder(true);

      const token =
        localStorage.getItem("token");

      // ==============================
      // COD PAYMENT
      // ==============================

      if (paymentMethod === "cod") {
        const orderData = {
          addressId: selectedAddress,

          paymentMethod:
            paymentMethod.toUpperCase(),

          couponCode:
            appliedCoupon || null,

          items: buyNowItems.map((item) => ({
            productId: item.product._id,
            size: item.size,
            quantity: item.quantity,
          })),
        };

        console.log(
          "COD Order data:",
          orderData
        );

        const data =
          await createOrder(orderData);

        console.log(
          "COD Order created:",
          data
        );

        navigate("/order-success", {
          state: {
            orderId:
              data.order.orderId,

            total:
              data.order.total,

            status:
              data.order.status,

            paymentMethod:
              data.order.paymentMethod,
          },
        });

        return;
      }

      const removeOrderedItemsFromCart = async () => {
  try {
    for (const item of buyNowItems) {
      if (item._id) {
        await removeCartItem(item._id);
      }
    }

    window.dispatchEvent(new Event("cartUpdated"));

    console.log("Ordered items removed from cart");
  } catch (error) {
    console.error(
      "Failed to remove ordered items from cart:",
      error
    );
  }
};

      // ==============================
      // RAZORPAY PAYMENT
      // ==============================

      const data =
        await createPaymentOrder(
          finalPrice,
          token
        );

      console.log(
        "Razorpay order:",
        data
      );

      // CHECK RAZORPAY SCRIPT
      if (!window.Razorpay) {
        toast.error(
          "Razorpay is not loaded"
        );

        setPlacingOrder(false);

        return;
      }

      // =================================
      // RAZORPAY OPTIONS
      // =================================

      const options = {
        key: import.meta.env
          .VITE_RAZORPAY_KEY_ID,

        amount: data.order.amount,

        currency: data.order.currency,

        name: "J-HUB",

        description:
          "J-HUB Jersey Purchase",

        order_id: data.order.id,

        // =================================
        // PAYMENT SUCCESS
        // =================================

        handler: async function (response) {
          try {
            console.log(
              "Razorpay payment successful:",
              response
            );

            const verificationData = {
              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,
            };

            console.log(
              "Payment verification data:",
              verificationData
            );

            // VERIFY PAYMENT
            const verificationResponse =
              await verifyPayment(
                verificationData,
                token
              );

            console.log(
              "Payment verification response:",
              verificationResponse
            );

            // =================================
            // PAYMENT VERIFIED
            // =================================

            if (
              verificationResponse.success
            ) {
              // =================================
              // RETRY PAYMENT
              // =================================

              if (
                isRetryPayment &&
                retryOrderId
              ) {
                console.log(
                  "Completing retry payment for existing order:",
                  retryOrderId
                );

                const retryResult =
                  await completeRetryPaymentOrder(
                    retryOrderId
                  );

                console.log(
                  "Retry payment completed:",
                  retryResult
                );

                setPlacingOrder(false);

                toast.success(
                  "Payment completed successfully"
                );

                navigate("/order-success", {
                  state: {
                    orderId:
                      retryResult.order
                        .orderId,

                    total:
                      retryResult.order
                        .total,

                    status:
                      retryResult.order
                        .status,

                    paymentMethod:
                      retryResult.order
                        .paymentMethod,
                  },
                });

                return;
              }

              // =================================
              // CREATE NEW ORDER
              // =================================

              const orderData = {
                addressId:
                  selectedAddress,

                paymentMethod:
                  paymentMethod.toUpperCase(),

                couponCode:
                  appliedCoupon || null,

                items: buyNowItems.map(
                  (item) => ({
                    productId:
                      item.product._id,

                    size: item.size,

                    quantity:
                      item.quantity,
                  })
                ),
              };

              console.log(
                "Online payment order data:",
                orderData
              );

              const orderDataResponse =
                await createOrder(
                  orderData
                );

              console.log(
                "Online order created:",
                orderDataResponse
              );

              toast.success(
                "Order placed successfully"
              );

              // ==============================
              // SUCCESS PAGE
              // ==============================

              setPlacingOrder(false);

              navigate("/order-success", {
                state: {
                  orderId:
                    orderDataResponse.order
                      .orderId,

                  total:
                    orderDataResponse.order
                      .total,

                  status:
                    orderDataResponse.order
                      .status,

                  paymentMethod:
                    orderDataResponse.order
                      .paymentMethod,
                },
              });
            }
          } catch (error) {
            console.error(
              "Payment verification failed:",
              error
            );

            setPlacingOrder(false);

            // ==============================
            // PAYMENT VERIFICATION FAILED
            // ==============================

            navigate("/order-failed", {
              state: {
                total: finalPrice,

                paymentMethod:
                  paymentMethod.toUpperCase(),

                message:
                  error.message ||
                  "Payment verification failed. Please try again.",

                items: buyNowItems,
              },
            });
          }
        },

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        theme: {
          color: "#d90416",
        },

        // =================================
        // RAZORPAY MODAL
        // =================================

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay modal dismissed"
            );

            setPlacingOrder(false);
          },
        },
      };

      // =================================
      // CREATE RAZORPAY INSTANCE
      // =================================

      const razorpay =
        new window.Razorpay(options);

      // =================================
      // RAZORPAY PAYMENT FAILED
      // =================================

      razorpay.on(
        "payment.failed",
        async function (response) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          // Close Razorpay failure modal
          razorpay.close();

          try {
            const failedOrderData = {
              addressId: selectedAddress,

              paymentMethod:
                paymentMethod.toUpperCase(),

              items: buyNowItems.map((item) => ({
                productId: item.product._id,
                size: item.size,
                quantity: item.quantity,
              })),
            };

            const failedOrderResponse =
              await createFailedPaymentOrder(
                failedOrderData
              );

            console.log(
              "Failed payment order created:",
              failedOrderResponse
            );

            setPlacingOrder(false);

            navigate("/order-failed", {
              state: {
                orderId:
                  failedOrderResponse.order
                    .orderId,

                total:
                  failedOrderResponse.order
                    .total,

                paymentMethod:
                  failedOrderResponse.order
                    .paymentMethod,

                paymentStatus:
                  failedOrderResponse.order
                    .paymentStatus,

                paymentRetryExpiresAt:
                  failedOrderResponse.order
                    .paymentRetryExpiresAt,

                message:
                  response.error?.description ||
                  "Your payment could not be completed. You can retry the payment within 5 minutes.",

                items: buyNowItems,
              },
            });
          } catch (error) {
            console.error(
              "Failed payment order creation error:",
              error
            );

            setPlacingOrder(false);

            // IMPORTANT:
            // Even if failed-order creation fails,
            // still go to the failed page.

            navigate("/order-failed", {
              state: {
                total: finalPrice,

                paymentMethod:
                  paymentMethod.toUpperCase(),

                message:
                  response.error?.description ||
                  "Your payment could not be completed. Please try again.",

                items: buyNowItems,

                paymentRetryExpiresAt:
                  new Date(
                    Date.now() +
                      5 * 60 * 1000
                  ).toISOString(),
              },
            });
          }
        }
      );

      // =================================
      // OPEN RAZORPAY
      // =================================

      razorpay.open();
    } catch (error) {
      console.error(
        "Failed to place order:",
        error
      );

      toast.error(
        error.message ||
          "Failed to place order"
      );

      setPlacingOrder(false);
    }
  };

  // EMPTY CHECKOUT
  if (!buyNowItems.length) {
    return null;
  }

  // UI
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-7xl mx-auto">

          {/* PAGE TITLE */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 !text-black">
              Checkout
            </h1>

            <p className="text-gray-500 mt-2">
              Complete your order by selecting
              your address and payment method.
            </p>
          </div>

          {/* CHECKOUT CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-6">

              {/* ADDRESS */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <CheckoutAddress
                  addresses={addresses}
                  selectedAddress={selectedAddress}
                  setSelectedAddress={setSelectedAddress}
                  checkoutItems={buyNowItems}
                />
              </div>

              {/* ITEMS */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <CheckoutItems
                  items={items}
                />
              </div>

              {/* PAYMENT */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <PaymentMethod
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="lg:col-span-1">

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-24">

                {/* COUPON SECTION */}
                <CouponSection
                  couponCode={couponCode}
                  setCouponCode={setCouponCode}
                  couponDiscount={couponDiscount}
                  appliedCoupon={appliedCoupon}
                  couponLoading={couponLoading}
                  handleApplyCoupon={handleApplyCoupon}
                  discountedSubtotal={discountedSubtotal}
                />

                {/* ORDER SUMMARY */}
                <CheckoutSummary
                  subtotal={subtotal}
                  discount={discount}
                  tax={tax}
                  shipping={shipping}
                  finalPrice={finalPrice}
                  onPlaceOrder={handlePlaceOrder}
                  placingOrder={placingOrder}
                />

              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Checkout;