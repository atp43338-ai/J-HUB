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

      {/* UPI */}
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
            Pay securely using your UPI app.
          </p>
        </div>
      </label>

      {/* CREDIT / DEBIT CARD */}
      <label
        className={`flex items-center gap-4 border rounded-xl p-5 mt-4 cursor-pointer transition ${
          paymentMethod === "card"
            ? "border-[#d90416] bg-red-50"
            : "border-gray-200 hover:border-gray-400"
        }`}
      >
        <input
          type="radio"
          name="payment"
          value="card"
          checked={paymentMethod === "card"}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
          className="w-5 h-5 accent-[#d90416]"
        />

        <div>
          <h3 className="font-semibold text-black">
            Credit / Debit Card
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Pay using your credit or debit card.
          </p>
        </div>
      </label>

    </section>
  );
}

export default PaymentMethod;