function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
}) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold !text-black">
          Payment Method
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Select your preferred payment method.
        </p>
      </div>

      {/* COD */}
      <label
        className={`flex items-center gap-4 border rounded-xl p-5 cursor-pointer transition ${
          paymentMethod === "cod"
            ? "border-[#d90416] bg-red-50"
            : "border-gray-200 hover:border-gray-400"
        }`}
      >
        <input
          type="radio"
          name="payment"
          value="cod"
          checked={paymentMethod === "cod"}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
          className="w-5 h-5 accent-[#d90416]"
        />

        <div>
          <h3 className="font-semibold text-black">
            Cash on Delivery
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Pay when your order is delivered.
          </p>
        </div>
      </label>

      {/* UPI / RAZORPAY */}
      <label
        className={`flex items-center gap-4 border rounded-xl p-5 mt-4 cursor-pointer transition ${
          paymentMethod === "upi"
            ? "border-[#d90416] bg-red-50"
            : "border-gray-200 hover:border-gray-400"
        }`}
      >
        <input
          type="radio"
          name="payment"
          value="upi"
          checked={paymentMethod === "upi"}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
          className="w-5 h-5 accent-[#d90416]"
        />

        <div>
          <h3 className="font-semibold text-black">
            UPI
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Pay securely using UPI through Razorpay.
          </p>
        </div>
      </label>

      {/* WALLET */}
      <label
        className={`flex items-center gap-4 border rounded-xl p-5 mt-4 cursor-pointer transition ${
          paymentMethod === "wallet"
            ? "border-[#d90416] bg-red-50"
            : "border-gray-200 hover:border-gray-400"
        }`}
      >
        <input
          type="radio"
          name="payment"
          value="wallet"
          checked={paymentMethod === "wallet"}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
          className="w-5 h-5 accent-[#d90416]"
        />

        <div>
          <h3 className="font-semibold text-black">
            Wallet
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Pay securely using your wallet balance.
          </p>
        </div>
      </label>

      {/* RAZORPAY INFO */}
      {paymentMethod === "upi" && (
        <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            You will be redirected to the Razorpay
            secure payment window after clicking
            <span className="font-semibold text-black">
              {" "}Place Order
            </span>.
          </p>
        </div>
      )}

    </section>
  );
}

export default PaymentMethod;