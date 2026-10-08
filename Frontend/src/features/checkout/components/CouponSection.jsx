import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  getAvailableCoupons,
} from "../../coupon/services/couponService";

import toast from "react-hot-toast";

function CouponSection({
  couponCode,
  setCouponCode,
  couponDiscount,
  appliedCoupon,
  couponLoading,
  handleApplyCoupon,
  discountedSubtotal,
}) {
  const [showCoupons, setShowCoupons] = useState(false);

  const [coupons, setCoupons] = useState([]);

  const [loadingCoupons, setLoadingCoupons] = useState(false);

  // FETCH AVAILABLE COUPONS
  const fetchCoupons = async () => {
    try {
      setLoadingCoupons(true);

      const data = await getAvailableCoupons();

      setCoupons(data.coupons || []);
    } catch (error) {
      console.error(
        "Failed to fetch coupons:",
        error
      );

      toast.error(
        error.message ||
          "Failed to load coupons"
      );
    } finally {
      setLoadingCoupons(false);
    }
  };

  // OPEN COUPON DRAWER
  const handleViewCoupons = () => {
    setShowCoupons(true);
    fetchCoupons();
  };

  // CLOSE COUPON DRAWER
  const handleCloseCoupons = () => {
    setShowCoupons(false);
  };

  // LOCK PAGE SCROLL WHEN DRAWER IS OPEN
  useEffect(() => {
    if (showCoupons) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showCoupons]);

  // SELECT COUPON
  const handleSelectCoupon = (coupon) => {
    setCouponCode(coupon.code);

    setShowCoupons(false);

    toast.success(
      `${coupon.code} selected`
    );
  };

  // CHECK MINIMUM PURCHASE
  const isCouponApplicable = (coupon) => {
    return (
      discountedSubtotal >=
      coupon.minimumPurchase
    );
  };

  return (
    <>
      {/* COUPON SECTION */}
      <div className="border-b border-gray-200 p-5">

        {/* COUPON INPUT */}
        <div className="flex gap-2">

          <input
            type="text"
            value={couponCode}
            onChange={(e) =>
              setCouponCode(
                e.target.value.toUpperCase()
              )
            }
            placeholder="Enter coupon code"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
          />

          <button
            type="button"
            onClick={handleApplyCoupon}
            disabled={couponLoading}
            className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {couponLoading
              ? "Applying..."
              : "APPLY"}
          </button>

        </div>

        {/* VIEW ALL COUPONS */}
        <button
          type="button"
          onClick={handleViewCoupons}
          className="mt-4 flex w-full items-center gap-2 text-left text-sm font-semibold text-gray-900 transition hover:text-red-600"
        >
          <span className="text-lg">
            🏷
          </span>

          <span>
            VIEW ALL AVAILABLE COUPONS
          </span>
        </button>

        {/* NOTE */}
        <div className="mt-3 flex gap-2 text-xs text-gray-500">

          <span>ⓘ</span>

          <p>
            Offer products cannot get
            coupons.
          </p>

        </div>

        {/* APPLIED COUPON */}
        {appliedCoupon && (
          <div className="mt-4 flex items-center justify-between rounded-lg bg-green-50 px-4 py-3">

            <div>

              <p className="text-sm font-semibold text-green-700">
                {appliedCoupon}
              </p>

              <p className="text-xs text-green-600">
                Coupon applied successfully
              </p>

            </div>

            <span className="text-sm font-bold text-green-700">
              -₹{couponDiscount}
            </span>

          </div>
        )}

      </div>

      {/* COUPON DRAWER */}
      {showCoupons &&
        createPortal(
          <div className="fixed inset-0 z-[999999]">

            {/* FULL SCREEN OVERLAY */}
            <div
              className="
                fixed
                inset-0
                z-[999998]
                bg-black/70
                backdrop-blur-md
              "
              onClick={handleCloseCoupons}
            />

            {/* DRAWER */}
            <div
              className="
                fixed
                right-0
                top-0
                z-[999999]
                h-screen
                w-full
                max-w-md
                overflow-y-auto
                bg-white
                shadow-2xl
                animate-[slideIn_0.35s_ease-out]
              "
            >

              {/* HEADER */}
              <div className="sticky top-0 z-20 border-b border-gray-200 bg-white">

                <div className="flex items-start justify-between px-6 py-5">

                  <div>

                    <h2 className="text-xl font-bold text-gray-900">
                      Available Coupons
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Select a coupon to apply it
                      to your order
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={handleCloseCoupons}
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      text-xl
                      text-gray-500
                      transition
                      duration-200
                      hover:bg-gray-100
                      hover:text-black
                    "
                  >
                    ×
                  </button>

                </div>

              </div>

              {/* COUPON LIST */}
              <div className="space-y-4 p-5">

                {/* LOADING */}
                {loadingCoupons && (
                  <div className="flex min-h-[300px] items-center justify-center">

                    <div className="text-center">

                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                      <p className="mt-4 text-sm text-gray-500">
                        Loading coupons...
                      </p>

                    </div>

                  </div>
                )}

                {/* NO COUPONS */}
                {!loadingCoupons &&
                  coupons.length === 0 && (
                    <div className="flex min-h-[300px] items-center justify-center">

                      <div className="text-center">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                          🏷
                        </div>

                        <p className="text-sm font-semibold text-gray-700">
                          No coupons available
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Please check again later.
                        </p>

                      </div>

                    </div>
                  )}

                {/* COUPONS */}
                {!loadingCoupons &&
                  coupons.map((coupon) => {

                    const applicable =
                      isCouponApplicable(
                        coupon
                      );

                    return (
                      <div
                        key={coupon._id}
                        className="
                          rounded-xl
                          border
                          border-gray-200
                          bg-white
                          p-5
                          shadow-sm
                          transition
                          duration-200
                          hover:-translate-y-0.5
                          hover:shadow-md
                        "
                      >

                        {/* COUPON CODE */}
                        <div className="flex items-start justify-between">

                          <div>

                            <p className="text-lg font-bold tracking-wide text-gray-900">
                              {coupon.code}
                            </p>

                            <p className="mt-1 text-sm font-semibold text-red-600">
                              {coupon.discountType ===
                              "percentage"
                                ? `${coupon.discountValue}% OFF`
                                : `₹${coupon.discountValue} OFF`}
                            </p>

                          </div>

                          <span className="rounded-md border border-dashed border-gray-400 px-2 py-1 text-xs font-semibold text-gray-700">
                            COUPON
                          </span>

                        </div>

                        {/* COUPON DETAILS */}
                        <div className="mt-4 space-y-3 text-xs text-gray-500">

                          <div className="flex items-center justify-between">

                            <span>
                              Minimum purchase
                            </span>

                            <span className="font-medium text-gray-800">
                              ₹
                              {
                                coupon.minimumPurchase
                              }
                            </span>

                          </div>

                          {coupon.discountType ===
                            "percentage" &&
                            coupon.maximumDiscount !==
                              null && (
                              <div className="flex items-center justify-between">

                                <span>
                                  Maximum discount
                                </span>

                                <span className="font-medium text-gray-800">
                                  ₹
                                  {
                                    coupon.maximumDiscount
                                  }
                                </span>

                              </div>
                            )}

                          <div className="flex items-center justify-between">

                            <span>
                              Valid until
                            </span>

                            <span className="font-medium text-gray-800">
                              {new Date(
                                coupon.endDate
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>

                          </div>

                        </div>

                        {/* NOT APPLICABLE */}
                        {!applicable && (
                          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                            Minimum purchase of ₹
                            {
                              coupon.minimumPurchase
                            } required
                          </p>
                        )}

                        {/* APPLY BUTTON */}
                        <button
                          type="button"
                          disabled={!applicable}
                          onClick={() =>
                            handleSelectCoupon(
                              coupon
                            )
                          }
                          className={`
                            mt-4
                            w-full
                            rounded-lg
                            px-4
                            py-3
                            text-sm
                            font-semibold
                            transition
                            duration-200
                            ${
                              applicable
                                ? "bg-black text-white hover:bg-red-600 hover:shadow-md"
                                : "cursor-not-allowed bg-gray-200 text-gray-400"
                            }
                          `}
                        >
                          {applicable
                            ? "APPLY COUPON"
                            : "NOT APPLICABLE"}
                        </button>

                      </div>
                    );
                  })}

              </div>

            </div>

          </div>,
          document.body
        )}
    </>
  );
}

export default CouponSection;