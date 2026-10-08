import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import EditCouponModal from "../components/EditCouponModal";

import {
  getAllCoupons,
  createCoupon,
  updateCouponStatus,
  deleteCoupon,
} from "../services/adminCouponService";

function CouponManagement() {
  const [showAddCoupon, setShowAddCoupon] = useState(false);

  const [showEditCoupon, setShowEditCoupon] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCouponData, setDeleteCouponData] = useState(null);

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minimumPurchase: "",
    maximumDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    status: true,
  });

  // FETCH COUPONS
  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const data = await getAllCoupons();

      setCoupons(data.coupons || []);
    } catch (error) {
      console.error("Fetch coupons error:", error);

      toast.error(
        error.message || "Failed to load coupons"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minimumPurchase: "",
      maximumDiscount: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
      status: true,
    });
  };

  // CLOSE ADD MODAL
  const handleCloseAddModal = () => {
    setShowAddCoupon(false);
    resetForm();
  };

  // CREATE COUPON
  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = formData.code.trim().toUpperCase();

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
      setCreating(true);

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

      await createCoupon(couponData);

      toast.success(
        "Coupon created successfully"
      );

      handleCloseAddModal();

      fetchCoupons();
    } catch (error) {
      console.error(
        "Create coupon error:",
        error
      );

      toast.error(
        error.message || "Failed to create coupon"
      );
    } finally {
      setCreating(false);
    }
  };

  // OPEN EDIT MODAL
  const handleEditClick = (coupon) => {
    setSelectedCoupon(coupon);
    setShowEditCoupon(true);
  };

  // CLOSE EDIT MODAL
  const handleEditClose = () => {
    setShowEditCoupon(false);
    setSelectedCoupon(null);
  };

  // UPDATE STATUS
  const handleStatusChange = async (
    id,
    status
  ) => {
    try {
      await updateCouponStatus(id, status);

      toast.success(
        status
          ? "Coupon activated successfully"
          : "Coupon deactivated successfully"
      );

      fetchCoupons();
    } catch (error) {
      console.error(
        "Update coupon status error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to update coupon status"
      );
    }
  };

  // OPEN DELETE POPUP
  const handleDeleteClick = (coupon) => {
    setDeleteCouponData(coupon);
    setShowDeleteModal(true);
  };

  // CLOSE DELETE POPUP
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteCouponData(null);
  };

  // DELETE COUPON
  const handleDelete = async () => {
    if (!deleteCouponData) return;

    try {
      await deleteCoupon(deleteCouponData._id);

      toast.success(
        "Coupon deleted successfully"
      );

      setShowDeleteModal(false);
      setDeleteCouponData(null);

      fetchCoupons();
    } catch (error) {
      console.error(
        "Delete coupon error:",
        error
      );

      toast.error(
        error.message || "Failed to delete coupon"
      );
    }
  };

  const totalCoupons = coupons.length;

  const activeCoupons = coupons.filter(
    (coupon) => coupon.status === true
  ).length;

  const inactiveCoupons = coupons.filter(
    (coupon) => coupon.status === false
  ).length;

  return (
    <div className="min-h-screen bg-[#f6f6f6] p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-black">
            Coupon Management
          </h1>

          <p className="text-gray-500 mt-1">
            Create and manage discount coupons
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddCoupon(true)}
          className="bg-[#d90416] hover:bg-[#b90312] text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition"
        >
          + Add Coupon
        </button>

      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        {/* TOTAL */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">

          <p className="text-sm text-gray-500">
            Total Coupons
          </p>

          <h2 className="text-2xl font-bold text-black mt-2">
            {totalCoupons}
          </h2>

        </div>

        {/* ACTIVE */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">

          <p className="text-sm text-gray-500">
            Active Coupons
          </p>

          <h2 className="text-2xl font-bold text-[#d90416] mt-2">
            {activeCoupons}
          </h2>

        </div>

        {/* INACTIVE */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">

          <p className="text-sm text-gray-500">
            Inactive Coupons
          </p>

          <h2 className="text-2xl font-bold text-gray-700 mt-2">
            {inactiveCoupons}
          </h2>

        </div>

      </div>

      {/* COUPON TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* TABLE HEADER */}
        <div className="px-6 py-5 border-b border-gray-200">

          <h2 className="text-lg font-bold text-black">
            All Coupons
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage your available discount coupons
          </p>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-6 py-4 text-sm font-semibold text-black">
                  Coupon Code
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-black">
                  Discount
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-black">
                  Minimum Purchase
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-black">
                  Validity
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-black">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-black">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {/* LOADING */}
              {loading && (
                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-16 text-gray-500"
                  >
                    Loading coupons...
                  </td>

                </tr>
              )}

              {/* EMPTY */}
              {!loading &&
                coupons.length === 0 && (
                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-16"
                    >

                      <div className="flex flex-col items-center">

                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">

                          <span className="text-2xl font-bold text-gray-500">
                            %
                          </span>

                        </div>

                        <h3 className="text-lg font-semibold text-gray-700">
                          No Coupons Found
                        </h3>

                        <p className="text-sm text-gray-400 mt-1">
                          Create your first coupon to
                          get started.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            setShowAddCoupon(true)
                          }
                          className="mt-5 bg-black hover:bg-[#d90416] text-white px-5 py-2.5 rounded-lg font-semibold transition"
                        >
                          + Create Coupon
                        </button>

                      </div>

                    </td>

                  </tr>
                )}

              {/* COUPONS */}
              {!loading &&
                coupons.map((coupon) => (

                  <tr
                    key={coupon._id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >

                    {/* CODE */}
                    <td className="px-6 py-4">

                      <span className="font-bold text-black">
                        {coupon.code}
                      </span>

                    </td>

                    {/* DISCOUNT */}
                    <td className="px-6 py-4">

                      <span className="font-semibold text-[#d90416]">

                        {coupon.discountType ===
                        "percentage"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}

                      </span>

                    </td>

                    {/* MINIMUM PURCHASE */}
                    <td className="px-6 py-4 text-sm text-gray-600">

                      ₹{coupon.minimumPurchase}

                    </td>

                    {/* VALIDITY */}
                    <td className="px-6 py-4 text-sm text-gray-600">

                      {new Date(
                        coupon.startDate
                      ).toLocaleDateString()}

                      {" - "}

                      {new Date(
                        coupon.endDate
                      ).toLocaleDateString()}

                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(
                            coupon._id,
                            !coupon.status
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                          coupon.status
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {coupon.status
                          ? "Active"
                          : "Inactive"}
                      </button>

                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-4">

                        {/* EDIT */}
                        <button
                          type="button"
                          onClick={() =>
                            handleEditClick(coupon)
                          }
                          className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteClick(coupon)
                          }
                          className="text-red-600 hover:text-red-800 text-sm font-semibold"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ADD COUPON MODAL */}
      {showAddCoupon && (

        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between shrink-0">

              <div>

                <h2 className="text-xl font-bold text-black">
                  Create New Coupon
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Add a discount coupon
                </p>

              </div>

              <button
                type="button"
                onClick={handleCloseAddModal}
                className="w-9 h-9 flex items-center justify-center rounded-full text-black text-xl hover:bg-[#d90416] hover:text-white transition"
              >
                ×
              </button>

            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto">

              <form
                onSubmit={handleSubmit}
                className="p-6"
              >

                {/* CODE */}
                <div className="mb-5">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Coupon Code
                  </label>

                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Example: JHUB20"
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
                        formData.discountType ===
                        "fixed"
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
                      value={
                        formData.discountValue
                      }
                      onChange={handleChange}
                      min="1"
                      placeholder="Enter discount"
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
                    value={
                      formData.minimumPurchase
                    }
                    onChange={handleChange}
                    min="0"
                    placeholder="Example: 1000"
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
                    value={
                      formData.maximumDiscount
                    }
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
                          e.target.value ===
                          "Active",
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
                    onClick={handleCloseAddModal}
                    disabled={creating}
                    className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 h-12 bg-[#d90416] hover:bg-[#b90312] text-white rounded-xl font-semibold transition disabled:opacity-50"
                  >
                    {creating
                      ? "Creating..."
                      : "Create Coupon"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

      {/* EDIT COUPON MODAL */}
      {showEditCoupon &&
        selectedCoupon && (

          <EditCouponModal
            coupon={selectedCoupon}
            onClose={handleEditClose}
            onUpdated={fetchCoupons}
          />

        )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal &&
        deleteCouponData && (

          <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

              {/* ICON */}
              <div className="flex items-center justify-center mb-4">

                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">

                  <span className="text-2xl font-bold text-[#d90416]">
                    !
                  </span>

                </div>

              </div>

              {/* TITLE */}
              <h2 className="text-xl font-bold text-black text-center">
                Delete Coupon?
              </h2>

              {/* MESSAGE */}
              <p className="text-sm text-gray-500 text-center mt-2">

                Are you sure you want to delete{" "}

                <span className="font-semibold text-black">
                  {deleteCouponData.code}
                </span>

                ?

              </p>

              {/* BUTTONS */}
              <div className="flex gap-3 mt-6">

                <button
                  type="button"
                  onClick={
                    handleCloseDeleteModal
                  }
                  className="flex-1 h-11 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 h-11 bg-[#d90416] hover:bg-[#b90312] text-white rounded-xl font-semibold transition"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}

export default CouponManagement;