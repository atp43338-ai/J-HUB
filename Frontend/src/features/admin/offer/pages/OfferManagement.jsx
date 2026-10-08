import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AddOfferModal from "../components/AddOfferModal";
import EditOfferModal from "../../order/components/EditOfferModal";
import {
  getAllOffers,
  updateOfferStatus,
  deleteOffer,
} from "../services/adminOfferService";

function OfferManagement() {
  const [showAddOffer, setShowAddOffer] = useState(false);

  const [showEditOffer, setShowEditOffer] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [deleteOfferData, setDeleteOfferData] =
    useState(null);

  // FETCH OFFERS
  const fetchOffers = async () => {
    try {
      setLoading(true);

      const data = await getAllOffers();

      setOffers(data.offers || []);
    } catch (error) {
      console.error("Fetch offers error:", error);

      toast.error(
        error.message || "Failed to load offers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // OPEN EDIT MODAL
  const handleEditClick = (offer) => {
    setSelectedOffer(offer);
    setShowEditOffer(true);
  };

  // CLOSE EDIT MODAL
  const handleEditClose = () => {
    setShowEditOffer(false);
    setSelectedOffer(null);
  };

  // UPDATE STATUS
  const handleStatusChange = async (id, status) => {
    try {
      await updateOfferStatus(id, status);

      toast.success(
        status
          ? "Offer activated successfully"
          : "Offer deactivated successfully"
      );

      fetchOffers();
    } catch (error) {
      console.error(
        "Update offer status error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to update offer status"
      );
    }
  };

  // OPEN DELETE POPUP
  const handleDeleteClick = (offer) => {
    setDeleteOfferData(offer);
    setShowDeleteModal(true);
  };

  // CLOSE DELETE POPUP
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteOfferData(null);
  };

  // DELETE OFFER
  const handleDelete = async () => {
    if (!deleteOfferData) return;

    try {
      await deleteOffer(deleteOfferData._id);

      toast.success("Offer deleted successfully");

      setShowDeleteModal(false);
      setDeleteOfferData(null);

      fetchOffers();
    } catch (error) {
      console.error(
        "Delete offer error:",
        error
      );

      toast.error(
        error.message || "Failed to delete offer"
      );
    }
  };

  const totalOffers = offers.length;

  const activeOffers = offers.filter(
    (offer) => offer.status === true
  ).length;

  const inactiveOffers = offers.filter(
    (offer) => offer.status === false
  ).length;

  return (
    <div className="min-h-screen bg-[#f6f6f6] p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold text-black">
            Offer Management
          </h1>

          <p className="text-gray-500 mt-1">
            Create and manage product and category
            offers
          </p>

        </div>

        <button
          type="button"
          onClick={() => setShowAddOffer(true)}
          className="bg-[#d90416] hover:bg-[#b90312] text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition"
        >
          + Add Offer
        </button>

      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        {/* TOTAL */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">

          <p className="text-sm text-gray-500">
            Total Offers
          </p>

          <h2 className="text-2xl font-bold text-black mt-2">
            {totalOffers}
          </h2>

        </div>

        {/* ACTIVE */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">

          <p className="text-sm text-gray-500">
            Active Offers
          </p>

          <h2 className="text-2xl font-bold text-[#d90416] mt-2">
            {activeOffers}
          </h2>

        </div>

        {/* INACTIVE */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">

          <p className="text-sm text-gray-500">
            Inactive Offers
          </p>

          <h2 className="text-2xl font-bold text-gray-700 mt-2">
            {inactiveOffers}
          </h2>

        </div>

      </div>

      {/* OFFER TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* TABLE HEADER */}
        <div className="px-6 py-5 border-b border-gray-200">

          <h2 className="text-lg font-bold text-black">
            All Offers
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage your available offers
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            {/* TABLE HEAD */}
            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-6 py-4 text-sm font-semibold text-black">
                  Offer Name
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-black">
                  Type
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-black">
                  Discount
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-black">
                  Start Date
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-black">
                  End Date
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
                    colSpan="7"
                    className="text-center py-16 text-gray-500"
                  >
                    Loading offers...
                  </td>

                </tr>
              )}

              {/* EMPTY */}
              {!loading && offers.length === 0 && (
                <tr>

                  <td
                    colSpan="7"
                    className="text-center py-16"
                  >

                    <div className="flex flex-col items-center">

                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">

                        <span className="text-2xl">
                          %
                        </span>

                      </div>

                      <h3 className="text-lg font-semibold text-gray-700">
                        No Offers Found
                      </h3>

                      <p className="text-sm text-gray-400 mt-1">
                        Create your first offer to get
                        started.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setShowAddOffer(true)
                        }
                        className="mt-5 bg-black hover:bg-[#d90416] text-white px-5 py-2.5 rounded-lg font-semibold transition"
                      >
                        + Create Offer
                      </button>

                    </div>

                  </td>

                </tr>
              )}

              {/* OFFERS */}
              {!loading &&
                offers.map((offer) => (

                  <tr
                    key={offer._id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >

                    {/* NAME */}
                    <td className="px-6 py-4">

                      <p className="font-semibold text-black">
                        {offer.name}
                      </p>

                    </td>

                    {/* TYPE */}
                    <td className="px-6 py-4">

                      <span className="text-sm text-gray-700">
                        {offer.type}
                      </span>

                    </td>

                    {/* DISCOUNT */}
                    <td className="px-6 py-4">

                      <span className="font-semibold text-[#d90416]">
                        {offer.discount}%
                      </span>

                    </td>

                    {/* START DATE */}
                    <td className="px-6 py-4 text-sm text-gray-600">

                      {new Date(
                        offer.startDate
                      ).toLocaleDateString()}

                    </td>

                    {/* END DATE */}
                    <td className="px-6 py-4 text-sm text-gray-600">

                      {new Date(
                        offer.endDate
                      ).toLocaleDateString()}

                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(
                            offer._id,
                            !offer.status
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
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

                    {/* ACTION */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-4">

                        {/* EDIT */}
                        <button
                          type="button"
                          onClick={() =>
                            handleEditClick(offer)
                          }
                          className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteClick(offer)
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

      {/* ADD OFFER MODAL */}
      {showAddOffer && (

        <AddOfferModal
          onClose={() => {
            setShowAddOffer(false);
            fetchOffers();
          }}
        />

      )}

      {/* EDIT OFFER MODAL */}
      {showEditOffer && selectedOffer && (

        <EditOfferModal
          offer={selectedOffer}
          onClose={handleEditClose}
          onUpdated={fetchOffers}
        />

      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && deleteOfferData && (

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
              Delete Offer?
            </h2>

            {/* MESSAGE */}
            <p className="text-sm text-gray-500 text-center mt-2">

              Are you sure you want to delete{" "}

              <span className="font-semibold text-black">
                {deleteOfferData.name}
              </span>

              ?

            </p>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-6">

              <button
                type="button"
                onClick={handleCloseDeleteModal}
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

export default OfferManagement;