import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAllReturns,
  approveReturn,
  rejectReturn,
} from "../services/adminReturnService";

function ReturnManagement() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [actionModal, setActionModal] = useState(null);

  // FETCH RETURNS
  const fetchReturns = async () => {
    try {
      setLoading(true);

      const data = await getAllReturns();

      setReturns(data.returns || []);
    } catch (error) {
      console.error(
        "Failed to fetch return requests:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load return requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  // OPEN APPROVE MODAL
  const handleApprove = (returnReq) => {
    setActionModal({
      type: "approve",
      returnId: returnReq._id,
      returnItem: returnReq,
    });
  };

  // OPEN REJECT MODAL
  const handleReject = (returnReq) => {
    setActionModal({
      type: "reject",
      returnId: returnReq._id,
      returnItem: returnReq,
    });
  };

  // CONFIRM ACTION
  const confirmReturnAction = async () => {
    if (!actionModal) return;
    const { type, returnId } = actionModal;

    try {
      setProcessingId(returnId);

      if (type === "approve") {
        await approveReturn(returnId);
        toast.success("Return request approved successfully");
      } else {
        await rejectReturn(returnId);
        toast.success("Return request rejected successfully");
      }

      setActionModal(null);
      await fetchReturns();
    } catch (error) {
      console.error(`Failed to ${type} return:`, error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          `Failed to ${type} return`
      );
    } finally {
      setProcessingId(null);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">
          Loading return requests...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Return Management
        </h1>

        <p className="text-gray-500 mt-1">
          View and manage customer return requests.
        </p>
      </div>

      {/* EMPTY */}
      {returns.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl py-20 text-center">

          <div className="text-5xl mb-4">
            ↩️
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            No Return Requests
          </h2>

          <p className="text-gray-500 mt-2">
            There are no return requests at the moment.
          </p>

        </div>
      ) : (
        <div className="space-y-5">

          {returns.map((returnRequest) => (

            <div
              key={returnRequest._id}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >

              {/* TOP */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <h2 className="font-bold text-lg text-gray-900">
                    Return Request
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Request ID: {returnRequest._id}
                  </p>
                </div>

                {/* STATUS */}
                <span
                  className={`inline-flex w-fit px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                    returnRequest.status === "requested"
                      ? "bg-yellow-100 text-yellow-700"
                      : returnRequest.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {returnRequest.status}
                </span>

              </div>

              <div className="border-t border-gray-100 my-5" />

              {/* DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* CUSTOMER */}
                <div>
                  <p className="text-sm text-gray-500">
                    Customer
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {returnRequest.user?.name ||
                      "Unknown User"}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {returnRequest.user?.email || ""}
                  </p>
                </div>

                {/* ORDER */}
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {returnRequest.order?.orderId ||
                      returnRequest.order?._id ||
                      "Unknown Order"}
                  </p>
                </div>

                {/* REASON */}
                <div>
                  <p className="text-sm text-gray-500">
                    Return Reason
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {returnRequest.reason}
                  </p>
                </div>

                {/* DATE */}
                <div>
                  <p className="text-sm text-gray-500">
                    Requested On
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {new Date(
                      returnRequest.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

              </div>

              {/* DESCRIPTION */}
              {returnRequest.description && (
                <div className="mt-5">

                  <p className="text-sm text-gray-500">
                    Customer Details
                  </p>

                  <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      {returnRequest.description}
                    </p>
                  </div>

                </div>
              )}

              {/* ACTIONS */}
              {returnRequest.status === "requested" && (
                <div className="flex flex-col sm:flex-row gap-3 mt-6">

                  <button
                    type="button"
                    onClick={() =>
                      handleApprove(returnRequest)
                    }
                    disabled={
                      processingId ===
                      returnRequest._id
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {processingId ===
                    returnRequest._id
                      ? "Processing..."
                      : "Accept Return"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleReject(returnRequest)
                    }
                    disabled={
                      processingId ===
                      returnRequest._id
                    }
                    className="flex-1 border border-red-500 text-red-600 hover:bg-red-50 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Reject Return
                  </button>

                </div>
              )}

            </div>

          ))}

        </div>
      )}

      {/* Return Action Confirmation Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  actionModal.type === "approve"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {actionModal.type === "approve" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {actionModal.type === "approve"
                    ? "Approve Return Request"
                    : "Reject Return Request"}
                </h2>
                <p className="text-xs text-gray-500">
                  {actionModal.type === "approve"
                    ? "Approve item return and credit refund to customer wallet"
                    : "Reject customer return request"}
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mt-4">
              Are you sure you want to{" "}
              <strong className="text-gray-900">
                {actionModal.type === "approve" ? "approve" : "reject"}
              </strong>{" "}
              this return request
              {actionModal.returnItem?.order?.orderId
                ? ` for Order #${actionModal.returnItem.order.orderId}`
                : ""}
              ?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                disabled={processingId !== null}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmReturnAction}
                disabled={processingId !== null}
                className={`inline-flex items-center gap-2 px-5 py-2 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 cursor-pointer ${
                  actionModal.type === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-[#d90416] hover:bg-red-700"
                }`}
              >
                {processingId !== null ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    {actionModal.type === "approve"
                      ? "Approve Return"
                      : "Reject Return"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ReturnManagement;