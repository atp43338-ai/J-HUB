function CartSummary({ subtotal, discount, delivery }) {
  const total = subtotal - discount + delivery;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">

      <h2 className="text-xl font-bold !text-black">
        Cart Summary
      </h2>

      {/* Subtotal */}
      <div className="flex justify-between mt-6">
        <span className="text-gray-500">
          Subtotal
        </span>

        <span className="font-medium text-black">
          ₹{subtotal}
        </span>
      </div>

      {/* Discount */}
      <div className="flex justify-between mt-4">
        <span className="text-gray-500">
          Discount
        </span>

        <span className="font-medium text-green-600">
          - ₹{discount}
        </span>
      </div>

      {/* Delivery */}
      <div className="flex justify-between mt-4">
        <span className="text-gray-500">
          Delivery
        </span>

        <span className="font-medium text-black">
          ₹{delivery}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-5"></div>

      {/* Total */}
      <div className="flex justify-between">
        <span className="text-lg font-bold text-black">
          Total
        </span>

        <span className="text-lg font-bold text-black">
          ₹{total}
        </span>
      </div>

      {/* Checkout */}
      <button
        type="button"
        className="
          w-full
          mt-6
          py-3
          rounded-lg
          bg-[#d90416]
          hover:bg-[#b90312]
          text-white
          font-semibold
          transition
        "
      >
        Proceed to Checkout
      </button>

    </div>
  );
}

export default CartSummary;