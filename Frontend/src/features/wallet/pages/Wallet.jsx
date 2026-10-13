import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProfileLayout from "../../profile/components/ProfileLayout";
import ProfileHeader from "../../profile/components/ProfileHeader";
import {
  getWallet,
  createTopupOrder,
  verifyTopup,
} from "../services/walletService";

// Helper to ensure Razorpay script is loaded dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add Money Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Transactions view toggle state (default: 3 items)
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const data = await getWallet(token);
      setWallet(data.wallet);
    } catch (error) {
      console.error("Wallet error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleOpenModal = () => {
    setAmount("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isProcessing) return;
    setIsModalOpen(false);
    setAmount("");
  };

  const handleQuickAdd = (value) => {
    const current = Number(amount) || 0;
    setAmount((current + value).toString());
  };

  const handleProceedToPay = async () => {
    const numericAmount = Number(amount);

    if (!numericAmount || Number.isNaN(numericAmount) || numericAmount < 10) {
      toast.error("Please enter a valid amount (Minimum ₹10)");
      return;
    }

    if (numericAmount > 50000) {
      toast.error("Maximum top-up amount is ₹50,000");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to continue");
      return;
    }

    try {
      setIsProcessing(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        toast.error("Failed to load Razorpay payment gateway. Please check your connection.");
        setIsProcessing(false);
        return;
      }

      // Step 1: Create top-up order
      const orderData = await createTopupOrder(numericAmount, token);
      if (!orderData || !orderData.order) {
        throw new Error(orderData?.message || "Failed to initiate payment");
      }

      const razorpayKey =
        orderData.key_id ||
        orderData.razorpayKeyId ||
        orderData.order?.key_id ||
        import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        toast.error("Razorpay Key ID is missing. Please check your configuration.");
        setIsProcessing(false);
        return;
      }

      // Step 2: Open Razorpay modal
      const options = {
        key: razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency || "INR",
        name: "J-HUB Wallet",
        description: "Add Money to Wallet",
        order_id: orderData.order.id,
        theme: {
          color: "#d90416",
        },
        handler: async function (response) {
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: numericAmount,
            };

            const result = await verifyTopup(verificationData, token);

            if (result.success && result.wallet) {
              setWallet(result.wallet);
            } else {
              await fetchWallet();
            }

            toast.success("Money added successfully");
            handleCloseModal();
          } catch (err) {
            console.error("Top-up verification failed:", err);
            toast.error(err.message || "Payment verification failed");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (resp) {
        console.error("Top-up payment failed:", resp);
        toast.error(resp.error?.description || "Payment failed");
        setIsProcessing(false);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Proceed to pay error:", error);
      toast.error(error.message || "Failed to initiate top-up");
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <ProfileLayout
        title="My"
        highlight="Wallet"
        description="Manage your wallet and transactions"
      >
        <div className="min-h-[450px] flex items-center justify-center">
          <p className="text-gray-500 text-sm">
            Loading wallet...
          </p>
        </div>
      </ProfileLayout>
    );
  }

  if (!wallet) {
    return (
      <ProfileLayout
        title="My"
        highlight="Wallet"
        description="Manage your wallet and transactions"
      >
        <div className="min-h-[450px] flex items-center justify-center">
          <p className="text-gray-500 text-sm">
            Failed to load wallet.
          </p>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout
      title="My"
      highlight="Wallet"
      description="Manage your wallet and transactions"
    >
      {/* Header */}
      <ProfileHeader
        title="Wallet"
        highlight="Information"
        description="View your wallet balance and transaction history"
      />

      {/* Wallet Balance */}
      <div className="mt-8">
        <div className="p-6 rounded-xl bg-[#171717] !text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

          <div>
            <p className="text-xs text-gray-400">
              Current Balance
            </p>

            <h2 className="mt-3 text-3xl font-bold !text-white">
              ₹{Number(wallet.balance || 0).toFixed(2)}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Available wallet balance
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={handleOpenModal}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                bg-[#d90416]
                hover:bg-red-700
                text-white
                px-5
                py-2.5
                rounded-lg
                font-semibold
                text-sm
                transition-all
                duration-200
                shadow-sm
                hover:shadow
                active:scale-[0.98]
                cursor-pointer
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Money</span>
            </button>
          </div>

        </div>
      </div>

      {/* Add Money Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Add Money to <span className="text-[#d90416]">Wallet</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Instant top-up via Razorpay (UPI, Cards, NetBanking)
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Enter Amount (₹)
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="10"
                    max="50000"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isProcessing}
                    className="
                      w-full
                      pl-9
                      pr-4
                      py-3
                      border
                      border-gray-300
                      rounded-xl
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#d90416]/20
                      focus:border-[#d90416]
                      text-lg
                      font-semibold
                      text-gray-900
                    "
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  Min: ₹10 • Max: ₹50,000
                </p>
              </div>

              {/* Quick Add Chips */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  Quick Add:
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {[100, 500, 1000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleQuickAdd(val)}
                      className="
                        py-2
                        px-3
                        rounded-lg
                        border
                        border-gray-200
                        bg-gray-50
                        hover:bg-red-50
                        hover:border-red-200
                        hover:text-[#d90416]
                        text-xs
                        font-semibold
                        text-gray-700
                        transition
                        active:scale-95
                        disabled:opacity-50
                      "
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleProceedToPay}
                  disabled={isProcessing || !amount || Number(amount) < 10}
                  className="
                    w-full
                    bg-[#d90416]
                    hover:bg-red-700
                    disabled:bg-gray-300
                    disabled:cursor-not-allowed
                    text-white
                    py-3.5
                    rounded-xl
                    font-semibold
                    text-sm
                    transition-all
                    duration-200
                    shadow-sm
                    active:scale-[0.98]
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Pay</span>
                      {Number(amount) > 0 && <span>₹{Number(amount).toLocaleString("en-IN")}</span>}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Transactions */}
      {(() => {
        const allTransactions = [...(wallet.transactions || [])].sort(
          (a, b) =>
            new Date(b.createdAt || b.date || 0) -
            new Date(a.createdAt || a.date || 0)
        );

        const displayedTransactions = showAllTransactions
          ? allTransactions
          : allTransactions.slice(0, 3);

        return (
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-black">
                Wallet{" "}
                <span className="text-[#d90416]">
                  Transactions
                </span>
              </h3>

              {allTransactions.length > 0 && (
                <span className="text-xs text-gray-500">
                  {showAllTransactions
                    ? `Showing all ${allTransactions.length} transactions`
                    : `Showing ${Math.min(3, allTransactions.length)} of ${allTransactions.length} transactions`}
                </span>
              )}
            </div>

            {allTransactions.length === 0 ? (
              <div className="mt-5 p-5 rounded-xl border border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-500 text-center">
                  No transactions yet.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-5 space-y-4">
                  {displayedTransactions.map((transaction, idx) => (
                    <div
                      key={transaction._id || idx}
                      className="
                        p-5
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        flex
                        items-center
                        justify-between
                        gap-5
                      "
                    >
                      {/* Transaction Details */}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800">
                          {transaction.reason || transaction.description || "Wallet Transaction"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(
                            transaction.createdAt || transaction.date || Date.now()
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Transaction Amount */}
                      <p
                        className={`
                          text-sm
                          font-bold
                          whitespace-nowrap
                          ${
                            transaction.type === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        `}
                      >
                        {transaction.type === "credit"
                          ? "+"
                          : "-"}
                        ₹
                        {Number(
                          transaction.amount
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* See All / Show Less Toggle Button */}
                {allTransactions.length > 3 && (
                  <div className="mt-5 text-center">
                    <button
                      type="button"
                      onClick={() => setShowAllTransactions((prev) => !prev)}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-5
                        py-2.5
                        rounded-xl
                        border
                        border-gray-300
                        hover:border-[#d90416]
                        bg-white
                        hover:bg-red-50
                        text-gray-700
                        hover:text-[#d90416]
                        text-sm
                        font-semibold
                        transition-all
                        duration-200
                        shadow-sm
                        active:scale-[0.98]
                        cursor-pointer
                      "
                    >
                      <span>
                        {showAllTransactions
                          ? "Show Less"
                          : `See All Transactions (${allTransactions.length})`}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-4 h-4 transition-transform duration-200 ${
                          showAllTransactions ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })()}
    </ProfileLayout>
  );
}

export default Wallet;