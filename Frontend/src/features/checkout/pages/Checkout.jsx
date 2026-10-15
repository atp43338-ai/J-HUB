
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

import {
  getCart,
  removeCartItem,
} from "../../cart/services/cartService";

import {
  createPaymentOrder,
  verifyPayment,
} from "../../payment/services/paymentService";

import { getWallet } from "../../wallet/services/walletService";

import { applyCoupon } from "../../coupon/services/couponService";

import toast from "react-hot-toast";

function Checkout() {
  const navigate = useNavigate();

  const location = useLocation();

  // RETRY PAYMENT INFORMATION
  const [retryOrderId] = useState(() => {
    return (
      location.state?.retryOrderId ||
      sessionStorage.getItem("checkout_retry_order_id") ||
      null
    );
  });

  const [isRetryPayment] = useState(() => {
    return (
      location.state?.retryPayment === true ||
      sessionStorage.getItem("checkout_is_retry") === "true"
    );
  });

  // ITEMS FOR CHECKOUT (PERSISTENT ON RELOAD / CTRL + F5)
  const [checkoutItems, setCheckoutItems] = useState(() => {
    // 1. Try location.state?.items
    if (
      location.state?.items &&
      Array.isArray(location.state.items) &&
      location.state.items.length > 0
    ) {
      try {
        sessionStorage.setItem(
          "checkout_items",
          JSON.stringify(location.state.items)
        );
        if (location.state.retryOrderId) {
          sessionStorage.setItem(
            "checkout_retry_order_id",
            location.state.retryOrderId
          );
        }
        if (location.state.retryPayment) {
          sessionStorage.setItem("checkout_is_retry", "true");
        }
      } catch (e) {
        console.error("Failed to save checkout items to sessionStorage:", e);
      }
      return location.state.items;
    }

    // 2. Try sessionStorage fallback
    try {
      const saved = sessionStorage.getItem("checkout_items");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse checkout items from sessionStorage:", e);
    }

    return [];
  });

  const [itemsLoading, setItemsLoading] = useState(
    checkoutItems.length === 0
  );

  // STATES
  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(() => {
    try {
      return sessionStorage.getItem("checkout_selected_address") || "";
    } catch {
      return "";
    }
  });

  const handleSelectAddress = (addressId) => {
    setSelectedAddress(addressId);
    try {
      sessionStorage.setItem("checkout_selected_address", addressId);
    } catch (e) {
      console.error("Failed to save selected address to sessionStorage:", e);
    }
  };

  const [addressLoading, setAddressLoading] =
    useState(true);

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [placingOrder, setPlacingOrder] =
    useState(false);

  // WALLET STATES
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);

  // COUPON STATES
  const [couponCode, setCouponCode] =
    useState("");

  const [couponDiscount, setCouponDiscount] =
    useState(0);

  const [appliedCoupon, setAppliedCoupon] =
    useState("");

  const [couponLoading, setCouponLoading] =
    useState(false);

  // CLEAN STORAGE HELPER
  const cleanCheckoutStorage = () => {
    try {
      sessionStorage.removeItem("checkout_items");
      sessionStorage.removeItem("checkout_selected_address");
      sessionStorage.removeItem("checkout_retry_order_id");
      sessionStorage.removeItem("checkout_is_retry");
    } catch (e) {
      console.error("Storage cleanup error:", e);
    }
  };

  // RESTORE ACTIVE CART ITEMS IF LOCATION.STATE AND SESSIONSTORAGE ARE EMPTY
  useEffect(() => {
    if (checkoutItems.length > 0) {
      setItemsLoading(false);
      return;
    }

    const restoreCartItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setItemsLoading(false);
        navigate("/login", { state: { from: location } });
        return;
      }

      try {
        setItemsLoading(true);
        const data = await getCart();
        const serverItems = data?.cart?.items || [];

        if (serverItems.length > 0) {
          setCheckoutItems(serverItems);
          try {
            sessionStorage.setItem(
              "checkout_items",
              JSON.stringify(serverItems)
            );
          } catch (err) {
            console.error("Failed to cache server items in sessionStorage:", err);
          }
        }
      } catch (error) {
        console.error("Failed to fetch cart fallback for checkout:", error);
      } finally {
        setItemsLoading(false);
      }
    };

    restoreCartItems();
  }, [location, navigate]);

  // REDIRECT ONLY AFTER FETCH COMPLETES AND CONFIRMED EMPTY
  useEffect(() => {
    if (!itemsLoading && checkoutItems.length === 0) {
      toast.error("Your checkout session is empty");
      navigate("/cart", { replace: true });
    }
  }, [itemsLoading, checkoutItems.length, navigate]);

  // FETCH ADDRESSES
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { state: { from: location } });
        return;
      }

      try {
        setAddressLoading(true);

        const data = await getAddresses(token);

        const userAddresses =
          data.addresses || [];

        setAddresses(userAddresses);

        // Select address: restore previously selected if present in addresses,
        // otherwise default address, otherwise first address
        const savedAddressId = sessionStorage.getItem("checkout_selected_address");
        const foundSaved = userAddresses.find(
          (address) => address._id === savedAddressId
        );
        const defaultAddress = userAddresses.find(
          (address) => address.isDefault
        );

        if (foundSaved) {
          setSelectedAddress(foundSaved._id);
        } else if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
          sessionStorage.setItem("checkout_selected_address", defaultAddress._id);
        } else if (userAddresses.length > 0) {
          setSelectedAddress(userAddresses[0]._id);
          sessionStorage.setItem("checkout_selected_address", userAddresses[0]._id);
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
  }, [location, navigate]);

  // FETCH WALLET
  useEffect(() => {
    const fetchWallet = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setWalletLoading(true);
        const data = await getWallet(token);
        if (data && data.wallet) {
          setWallet(data.wallet);
        } else if (data && typeof data.balance === "number") {
          setWallet(data);
        }
      } catch (error) {
        console.error("Failed to fetch wallet:", error);
      } finally {
        setWalletLoading(false);
      }
    };

    fetchWallet();
  }, []);

  // CONVERT PRODUCTS FOR CHECKOUT UI
  const items = checkoutItems
    .filter((item) => item && item.product)
    .map((item) => {
      const prod = typeof item.product === "object" ? item.product : {};
      const originalPrice = Number(prod.price) || 0;
      const offerDiscount = Number(prod.offerDiscount) || 0;
      const offerPrice = Number(prod.offerPrice);

      const price =
        offerDiscount > 0 && Number.isFinite(offerPrice)
          ? offerPrice
          : originalPrice -
            (originalPrice * (Number(prod.discount) || 0)) / 100;

      return {
        id: prod._id,
        name: prod.name,
        image: prod.images?.[0],
        size: item.size,
        quantity: item.quantity,
        price,
        originalPrice,
        offerDiscount:
          offerDiscount > 0
            ? offerDiscount
            : Number(prod.discount) || 0,
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
      for (const item of checkoutItems) {
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

  // GET THE ACTUAL TOTAL RETURNED BY THE BACKEND
  const getOrderTotal = (order) =>
    Number(order?.finalPrice ?? order?.total ?? 0);

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
    if (!checkoutItems.length) {
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

          subtotal,
          discount,
          totalAmount: finalPrice,
          finalAmount: finalPrice,

          items: items.map((item) => ({
            productId: item.id,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            originalPrice: item.originalPrice,
            discount: item.originalPrice - item.price,
            unitDiscount: item.originalPrice - item.price,
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

        await removeOrderedItemsFromCart();

        cleanCheckoutStorage();

        setPlacingOrder(false);

        const finalAmountValue = getOrderTotal(data.order);

        navigate("/order-success", {
          state: {
            orderId:
              data.order.orderId,

            total:
              finalAmountValue,

            finalAmount:
              finalAmountValue,

            totalAmount:
              finalAmountValue,

            finalPrice:
              finalAmountValue,

            status:
              data.order.status,

            paymentStatus:
              data.order.paymentStatus || "pending",

            paymentMethod:
              data.order.paymentMethod,
          },
        });

        return;
      }

      // ==============================
      // WALLET PAYMENT
      // ==============================

      if (paymentMethod === "wallet") {
        let currentWallet = wallet;
        if (!currentWallet) {
          try {
            const wRes = await getWallet(token);
            currentWallet = wRes?.wallet || wRes;
            if (currentWallet) setWallet(currentWallet);
          } catch (e) {
            console.error("Wallet check error:", e);
          }
        }

        const walletBalance = Number(currentWallet?.balance || 0);

        if (walletBalance < finalPrice) {
          toast.error(
            "Insufficient wallet balance. Please choose another payment method or add funds."
          );
          setPlacingOrder(false);
          return;
        }

        const orderData = {
          addressId: selectedAddress,
          paymentMethod: "WALLET",
          couponCode: appliedCoupon || null,
          subtotal,
          discount,
          totalAmount: finalPrice,
          finalAmount: finalPrice,
          items: items.map((item) => ({
            productId: item.id,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            originalPrice: item.originalPrice,
            discount: item.originalPrice - item.price,
            unitDiscount: item.originalPrice - item.price,
          })),
        };

        console.log("Wallet Order data:", orderData);

        const data = await createOrder(orderData);

        console.log("Wallet Order created:", data);

        await removeOrderedItemsFromCart();

        cleanCheckoutStorage();

        toast.success("Order placed successfully using wallet balance!");

        setPlacingOrder(false);

        const finalAmountValue = getOrderTotal(data.order);

        navigate("/order-success", {
          state: {
            orderId: data.order.orderId,
            total: finalAmountValue,
            finalAmount: finalAmountValue,
            totalAmount: finalAmountValue,
            finalPrice: finalAmountValue,
            status: data.order.status,
            paymentStatus: data.order.paymentStatus || "paid",
            paymentMethod: data.order.paymentMethod,
          },
        });

        return;
      }

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

      // GET & VALIDATE RAZORPAY KEY ID
      const razorpayKey =
        data.key_id ||
        data.razorpayKeyId ||
        data.order?.key_id ||
        import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        toast.error("Razorpay Key ID is missing. Please check your configuration.");
        setPlacingOrder(false);
        return;
      }

      // =================================
      // RAZORPAY OPTIONS
      // =================================

      const options = {
        key: razorpayKey,

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

                cleanCheckoutStorage();

                toast.success(
                  "Payment completed successfully"
                );

                const retryTotalValue = getOrderTotal(retryResult.order);

                navigate("/order-success", {
                  state: {
                    orderId:
                      retryResult.order
                        .orderId,

                    total:
                      retryTotalValue,

                    finalAmount:
                      retryTotalValue,

                    totalAmount:
                      retryTotalValue,

                    finalPrice:
                      retryTotalValue,

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

                subtotal,
                discount,
                totalAmount: finalPrice,
                finalAmount: finalPrice,

                items: items.map((item) => ({
                  productId: item.id,
                  size: item.size,
                  quantity: item.quantity,
                  price: item.price,
                  originalPrice: item.originalPrice,
                  discount: item.originalPrice - item.price,
                  unitDiscount: item.originalPrice - item.price,
                })),
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

              cleanCheckoutStorage();

              // ==============================
              // SUCCESS PAGE
              // ==============================

              setPlacingOrder(false);

const onlineTotalValue = Number(
  orderDataResponse.order.finalPrice ??
  orderDataResponse.order.finalAmount ??
  orderDataResponse.order.totalAmount ??
  orderDataResponse.order.total ??
  0
);

navigate("/order-success", {
  state: {
    orderId: orderDataResponse.order.orderId,

    total: onlineTotalValue,

    finalAmount: onlineTotalValue,

    totalAmount: onlineTotalValue,

    finalPrice: onlineTotalValue,

    status: orderDataResponse.order.status,

    paymentMethod:
      orderDataResponse.order.paymentMethod,
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

                items: checkoutItems,
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

              subtotal,
              discount,
              totalAmount: finalPrice,
              finalAmount: finalPrice,

              items: items.map((item) => ({
                productId: item.id,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                originalPrice: item.originalPrice,
                discount: item.originalPrice - item.price,
                unitDiscount: item.originalPrice - item.price,
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

                items: checkoutItems,
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

                items: checkoutItems,

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

  // LOADING SKELETON / SPINNER DURING CHECKOUT INITIALIZATION
  if (itemsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-[#d90416] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium text-sm">
            Loading checkout details...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // EMPTY CHECKOUT
  if (!checkoutItems.length) {
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
                  setSelectedAddress={handleSelectAddress}
                  checkoutItems={checkoutItems}
                  addressLoading={addressLoading}
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
                  wallet={wallet}
                  finalPrice={finalPrice}
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
