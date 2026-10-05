import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAllReturns,
  approveReturn,
  rejectReturn,
} from "../../../services/adminReturnService";

function ReturnManagement() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

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

  // APPROVE RETURN
  const handleApprove = async (returnId) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this return?"
    );

    if (!confirmApprove) {
      return;
    }

    try {
      setProcessingId(returnId);

      await approveReturn(returnId);

      toast.success(
        "Return request approved successfully"
      );

      await fetchReturns();
    } catch (error) {
      console.error(
        "Failed to approve return:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to approve return"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // REJECT RETURN
  const handleReject = async (returnId) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this return?"
    );

    if (!confirmReject) {
      return;
    }

    try {
      setProcessingId(returnId);

      await rejectReturn(returnId);

      toast.success(
        "Return request rejected successfully"
      );

      await fetchReturns();
    } catch (error) {
      console.error(
        "Failed to reject return:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to reject return"
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
                      handleApprove(returnRequest._id)
                    }
                    disabled={
                      processingId ===
                      returnRequest._id
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingId ===
                    returnRequest._id
                      ? "Processing..."
                      : "Accept Return"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleReject(returnRequest._id)
                    }
                    disabled={
                      processingId ===
                      returnRequest._id
                    }
                    className="flex-1 border border-red-500 text-red-600 hover:bg-red-50 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject Return
                  </button>

                </div>
              )}

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default ReturnManagement;