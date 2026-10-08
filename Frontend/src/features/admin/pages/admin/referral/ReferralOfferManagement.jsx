import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllReferralOffers,
  createReferralOffer,
  updateReferralOffer,
  updateReferralOfferStatus,
  deleteReferralOffer,
} from "../../../services/adminReferralService";

const ReferralOfferManagement = () => {
  const [referralOffers, setReferralOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [deleteOffer, setDeleteOffer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    rewardType: "percentage",
    rewardValue: "",
    minimumPurchase: "",
    startDate: "",
    endDate: "",
    status: true,
  });

  const fetchReferralOffers = async () => {
    try {
      setLoading(true);

      const data = await getAllReferralOffers();

      setReferralOffers(data.referralOffers || []);
    } catch (error) {
      toast.error(
        error.message || "Failed to fetch referral offers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralOffers();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      rewardType: "percentage",
      rewardValue: "",
      minimumPurchase: "",
      startDate: "",
      endDate: "",
      status: true,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter referral offer name");
      return;
    }

    if (!formData.rewardValue) {
      toast.error("Please enter reward value");
      return;
    }

    if (
      formData.rewardType === "percentage" &&
      Number(formData.rewardValue) > 100
    ) {
      toast.error("Percentage reward cannot be greater than 100");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    if (formData.startDate > formData.endDate) {
      toast.error("End date cannot be before start date");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        rewardType: formData.rewardType,
        rewardValue: Number(formData.rewardValue),
        minimumPurchase: Number(
          formData.minimumPurchase || 0
        ),
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      };

      if (editingOffer) {
        await updateReferralOffer(
          editingOffer._id,
          payload
        );

        toast.success(
          "Referral offer updated successfully"
        );
      } else {
        await createReferralOffer(payload);

        toast.success(
          "Referral offer created successfully"
        );
      }

      setShowForm(false);
      setEditingOffer(null);
      resetForm();

      fetchReferralOffers();
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to save referral offer"
      );
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);

    setFormData({
      name: offer.name || "",
      rewardType: offer.rewardType || "percentage",
      rewardValue: offer.rewardValue || "",
      minimumPurchase:
        offer.minimumPurchase || "",
      startDate: offer.startDate
        ? new Date(offer.startDate)
            .toISOString()
            .split("T")[0]
        : "",
      endDate: offer.endDate
        ? new Date(offer.endDate)
            .toISOString()
            .split("T")[0]
        : "",
      status: offer.status ?? true,
    });

    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOffer(null);
    resetForm();
  };

  const handleStatusChange = async (offer) => {
    try {
      await updateReferralOfferStatus(
        offer._id,
        !offer.status
      );

      toast.success(
        `Referral offer ${
          offer.status ? "deactivated" : "activated"
        } successfully`
      );

      fetchReferralOffers();
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to update referral offer status"
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteOffer) return;

    try {
      await deleteReferralOffer(deleteOffer._id);

      toast.success(
        "Referral offer deleted successfully"
      );

      setDeleteOffer(null);

      fetchReferralOffers();
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to delete referral offer"
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatReward = (offer) => {
    if (offer.rewardType === "percentage") {
      return `${offer.rewardValue}%`;
    }

    return `₹${Number(
      offer.rewardValue || 0
    ).toLocaleString("en-IN")}`;
  };

  const totalOffers = referralOffers.length;

  const activeOffers = referralOffers.filter(
    (offer) => offer.status
  ).length;

  const inactiveOffers =
    totalOffers - activeOffers;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Referral Offers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage referral rewards and offers.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-[#d90416] px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700"
        >
          + Add Referral Offer
        </button>
      </div>

      {/* SUMMARY */}

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Offers
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {totalOffers}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Active Offers
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {activeOffers}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Inactive Offers
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-500">
            {inactiveOffers}
          </h2>
        </div>
      </div>

      {/* TABLE */}

      <div className="rounded-xl bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Referral Offer List
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">
                <th className="px-5 py-4">
                  Name
                </th>

                <th className="px-5 py-4">
                  Reward
                </th>

                <th className="px-5 py-4">
                  Min. Purchase
                </th>

                <th className="px-5 py-4">
                  Start Date
                </th>

                <th className="px-5 py-4">
                  End Date
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Loading referral offers...
                  </td>
                </tr>
              ) : referralOffers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No referral offers found.
                  </td>
                </tr>
              ) : (
                referralOffers.map((offer) => (
                  <tr
                    key={offer._id}
                    className="border-b border-gray-100 text-sm hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {offer.name}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-900">
                      {formatReward(offer)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      ₹
                      {Number(
                        offer.minimumPurchase || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(offer.startDate)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(offer.endDate)}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          handleStatusChange(offer)
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          offer.status
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {offer.status
                          ? "Active"
                          : "Inactive"}
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleEdit(offer)
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            setDeleteOffer(offer)
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingOffer
                  ? "Edit Referral Offer"
                  : "Add Referral Offer"}
              </h2>

              <button
                type="button"
                onClick={handleCloseForm}
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Offer Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Refer & Earn"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Reward Type
                </label>

                <select
                  name="rewardType"
                  value={formData.rewardType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-500"
                >
                  <option value="percentage">
                    Percentage
                  </option>

                  <option value="fixed">
                    Fixed Amount
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Reward Value
                </label>

                <input
                  type="number"
                  name="rewardValue"
                  value={formData.rewardValue}
                  onChange={handleChange}
                  min="1"
                  max={
                    formData.rewardType ===
                    "percentage"
                      ? "100"
                      : undefined
                  }
                  placeholder={
                    formData.rewardType ===
                    "percentage"
                      ? "10"
                      : "500"
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Minimum Purchase
                </label>

                <input
                  type="number"
                  name="minimumPurchase"
                  value={formData.minimumPurchase}
                  onChange={handleChange}
                  min="0"
                  placeholder="1000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-500"
                />
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                Active
              </label>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#d90416] px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                >
                  {editingOffer
                    ? "Update Offer"
                    : "Create Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}

      {deleteOffer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Referral Offer?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-800">
                {deleteOffer.name}
              </span>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteOffer(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralOfferManagement;