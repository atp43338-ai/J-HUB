function CheckoutSummary({
  subtotal,
  discount,
  tax,
  shipping,
  finalPrice,
  onPlaceOrder,
}) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-24">

      {/* Header */}
      <h2 className="text-xl font-bold !text-black mb-6">
        Price Summary
      </h2>

      {/* Prices */}
      <div className="space-y-4">

        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Subtotal
          </span>

          <span className="font-medium text-black">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Discount */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Discount
          </span>

          <span className="font-medium text-green-600">
            -₹{discount.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Tax
          </span>

          <span className="font-medium text-black">
            ₹{tax.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Shipping
          </span>

          <span className="font-medium text-black">
            ₹{shipping.toLocaleString("en-IN")}
          </span>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6" />

      {/* Final Price */}
      <div className="flex justify-between items-center">

        <span className="text-lg font-semibold text-black">
          Final Price
        </span>

        <span className="text-2xl font-bold text-black">
          ₹{finalPrice.toLocaleString("en-IN")}
        </span>

      </div>

      {/* Place Order */}
      <button
        type="button"
        onClick={onPlaceOrder}
        className="w-full mt-6 py-3.5 bg-[#d90416] hover:bg-[#b90312] text-white rounded-lg font-semibold transition"
      >
        Place Order
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        By placing your order, you agree to our terms
        and conditions.
      </p>

    </section>
  );
}

export default CheckoutSummary;