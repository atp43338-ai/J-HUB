import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateCoupon } from "../services/adminCouponService";

function EditCouponModal({ coupon, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    discountType: coupon?.discountType || "percentage",
    discountValue: coupon?.discountValue || "",
    minimumPurchase: coupon?.minimumPurchase || "",
    maximumDiscount:
      coupon?.maximumDiscount ?? "",
    startDate: coupon?.startDate
      ? new Date(coupon.startDate)
          .toISOString()
          .split("T")[0]
      : "",
    endDate: coupon?.endDate
      ? new Date(coupon.endDate)
          .toISOString()
          .split("T")[0]
      : "",
    usageLimit: coupon?.usageLimit ?? "",
    status: coupon?.status ?? true,
  });

  const [loading, setLoading] = useState(false);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // UPDATE COUPON
  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = formData.code.trim().toUpperCase();

    // CODE
    if (!code) {
      toast.error("Coupon code is required");
      return;
    }

    if (!/^[A-Z0-9_-]+$/.test(code)) {
      toast.error(
        "Coupon code can contain only letters, numbers, _ and -"
      );
      return;
    }

    // DISCOUNT
    if (!formData.discountValue) {
      toast.error("Discount value is required");
      return;
    }

    const discountValue = Number(
      formData.discountValue
    );

    if (
      !Number.isFinite(discountValue) ||
      discountValue <= 0
    ) {
      toast.error(
        "Discount value must be greater than 0"
      );
      return;
    }

    if (
      formData.discountType === "percentage" &&
      discountValue > 100
    ) {
      toast.error(
        "Percentage discount cannot exceed 100%"
      );
      return;
    }

    // MINIMUM PURCHASE
    const minimumPurchase = Number(
      formData.minimumPurchase || 0
    );

    if (
      !Number.isFinite(minimumPurchase) ||
      minimumPurchase < 0
    ) {
      toast.error(
        "Minimum purchase cannot be negative"
      );
      return;
    }

    // MAXIMUM DISCOUNT
    let maximumDiscount = null;

    if (formData.maximumDiscount !== "") {
      maximumDiscount = Number(
        formData.maximumDiscount
      );

      if (
        !Number.isFinite(maximumDiscount) ||
        maximumDiscount < 0
      ) {
        toast.error(
          "Maximum discount must be a valid amount"
        );
        return;
      }
    }

    // DATES
    if (!formData.startDate) {
      toast.error("Start date is required");
      return;
    }

    if (!formData.endDate) {
      toast.error("End date is required");
      return;
    }

    if (
      formData.endDate < formData.startDate
    ) {
      toast.error(
        "End date cannot be before start date"
      );
      return;
    }

    // USAGE LIMIT
    let usageLimit = null;

    if (formData.usageLimit !== "") {
      usageLimit = Number(formData.usageLimit);

      if (
        !Number.isInteger(usageLimit) ||
        usageLimit < 1
      ) {
        toast.error(
          "Usage limit must be at least 1"
        );
        return;
      }
    }

    try {
      setLoading(true);

      const couponData = {
        code,
        discountType: formData.discountType,
        discountValue,
        minimumPurchase,
        maximumDiscount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        usageLimit,
        status: formData.status,
      };

      await updateCoupon(
        coupon._id,
        couponData
      );

      toast.success(
        "Coupon updated successfully"
      );

      onUpdated();
      onClose();
    } catch (error) {
      console.error(
        "Update coupon error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to update coupon"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[105] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between shrink-0">

          <div>
            <h2 className="text-xl font-bold text-black">
              Edit Coupon
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Update coupon details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-black text-xl hover:bg-[#d90416] hover:text-white transition"
          >
            ×
          </button>

        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto">

          <form
            onSubmit={handleSubmit}
            className="p-6"
          >

            {/* COUPON CODE */}
            <div className="mb-5">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Coupon Code
              </label>

              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full h-12 px-4 border border-gray-300 rounded-xl uppercase outline-none focus:border-[#d90416] focus:ring-2 focus:ring-red-100"
              />

            </div>

            {/* DISCOUNT TYPE */}
            <div className="mb-5">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount Type
              </label>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      discountType:
                        "percentage",
                    }))
                  }
                  className={`h-12 rounded-xl border font-semibold transition ${
                    formData.discountType ===
                    "percentage"
                      ? "bg-[#d90416] text-white border-[#d90416]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#d90416]"
                  }`}
                >
                  Percentage
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      discountType: "fixed",
                    }))
                  }
                  className={`h-12 rounded-xl border font-semibold transition ${
                    formData.discountType === "fixed"
                      ? "bg-[#d90416] text-white border-[#d90416]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#d90416]"
                  }`}
                >
                  Fixed Amount
                </button>

              </div>

            </div>

            {/* DISCOUNT VALUE */}
            <div className="mb-5">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount Value
              </label>

              <div className="relative">

                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  min="1"
                  className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-xl outline-none focus:border-[#d90416] focus:ring-2 focus:ring-red-100"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                  {formData.discountType ===
                  "percentage"
                    ? "%"
                    : "₹"}
                </span>

              </div>

            </div>

            {/* MINIMUM PURCHASE */}
            <div className="mb-5">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Purchase
              </label>

              <input
                type="number"
                name="minimumPurchase"
                value={formData.minimumPurchase}
                onChange={handleChange}
                min="0"
                className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none focus:border-[#d90416] focus:ring-2 focus:ring-red-100"
              />

            </div>

            {/* MAXIMUM DISCOUNT */}
            <div className="mb-5">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum Discount
              </label>

              <input
                type="number"
                name="maximumDiscount"
                value={formData.maximumDiscount}
                onChange={handleChange}
                min="0"
                placeholder="Optional"
                className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none focus:border-[#d90416] focus:ring-2 focus:ring-red-100"
              />

            </div>

            {/* DATES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none focus:border-[#d90416] focus:ring-2 focus:ring-red-100"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none focus:border-[#d90416] focus:ring-2 focus:ring-red-100"
                />

              </div>

            </div>

            {/* USAGE LIMIT */}
            <div className="mb-5">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Usage Limit
              </label>

              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                min="1"
                placeholder="Optional"
                className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none focus:border-[#d90416] focus:ring-2 focus:ring-red-100"
              />

            </div>

            {/* STATUS */}
            <div className="mb-6">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Coupon Status
              </label>

              <select
                value={
                  formData.status
                    ? "Active"
                    : "Inactive"
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status:
                      e.target.value === "Active",
                  }))
                }
                className="w-full h-12 px-4 border border-gray-300 rounded-xl bg-white outline-none focus:border-[#d90416] focus:ring-2 focus:ring-red-100"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

            </div>

            {/* BUTTONS */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 bg-[#d90416] hover:bg-[#b90312] text-white rounded-xl font-semibold transition disabled:opacity-50"
              >
                {loading
                  ? "Updating..."
                  : "Update Coupon"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default EditCouponModal;