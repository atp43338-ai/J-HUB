import { useEffect, useState } from "react";

import ProfileLayout from "../../profile/components/ProfileLayout";
import ProfileHeader from "../../profile/components/ProfileHeader";

function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/wallet",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch wallet"
          );
        }

        setWallet(data.wallet);
      } catch (error) {
        console.error("Wallet error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

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
        <div className="p-6 rounded-xl bg-[#171717] text-white">

          <p className="text-xs text-gray-400">
            Current Balance
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            ₹{Number(wallet.balance || 0).toFixed(2)}
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Available wallet balance
          </p>

        </div>
      </div>

      {/* Wallet Transactions */}
      <div className="mt-10">

        <h3 className="text-lg font-bold text-black">
          Wallet{" "}
          <span className="text-[#d90416]">
            Transactions
          </span>
        </h3>

        {wallet.transactions?.length === 0 ? (
          <div className="mt-5 p-5 rounded-xl border border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500 text-center">
              No transactions yet.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">

            {[...(wallet.transactions || [])]
              .reverse()
              .map((transaction) => (
                <div
                  key={transaction._id}
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
                      {transaction.reason}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(
                        transaction.createdAt
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
        )}

      </div>
    </ProfileLayout>
  );
}

export default Wallet;