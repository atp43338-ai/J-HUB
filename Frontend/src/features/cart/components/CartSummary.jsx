import { useNavigate } from "react-router";

function CartSummary({
  subtotal,
  discount,
  delivery,
  hasOutOfStockItem,
  cartItems,
}) {
  const navigate = useNavigate();

  const total = subtotal - discount + delivery;

  const handleCheckout = () => {
    if (hasOutOfStockItem) {
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      return;
    }

    navigate("/checkout", {
      state: {
        items: cartItems,
      },
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">

      {/* TITLE */}
      <h2 className="text-xl font-bold text-black">
        Cart Summary
      </h2>

      {/* SUBTOTAL */}
      <div className="flex justify-between mt-6">
        <span className="text-gray-500">
          Subtotal
        </span>

        <span className="font-medium text-black">
          ₹{subtotal}
        </span>
      </div>

      {/* DISCOUNT */}
      <div className="flex justify-between mt-4">
        <span className="text-gray-500">
          Discount
        </span>

        <span className="font-medium text-green-600">
          - ₹{discount}
        </span>
      </div>

      {/* DELIVERY */}
      <div className="flex justify-between mt-4">
        <span className="text-gray-500">
          Delivery
        </span>

        <span className="font-medium text-black">
          ₹{delivery}
        </span>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-200 my-5"></div>

      {/* TOTAL */}
      <div className="flex justify-between">
        <span className="text-lg font-bold text-black">
          Total
        </span>

        <span className="text-lg font-bold text-black">
          ₹{total}
        </span>
      </div>

      {/* OUT OF STOCK */}
      {hasOutOfStockItem && (
        <p className="mt-4 text-sm text-red-600 font-semibold">
          Remove unavailable items before checkout.
        </p>
      )}

      {/* CHECKOUT */}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={hasOutOfStockItem}
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
          disabled:opacity-40
          disabled:cursor-not-allowed
          disabled:hover:bg-[#d90416]
        "
      >
        Proceed to Checkout
      </button>

    </div>
  );
}

export default CartSummary;