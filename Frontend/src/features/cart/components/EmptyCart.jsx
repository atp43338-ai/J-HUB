import { useNavigate } from "react-router";

function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20">

      {/* Empty Cart Icon */}
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
        <span className="text-4xl">🛒</span>
      </div>

      {/* Message */}
      <h2 className="mt-6 text-2xl font-bold text-black">
        Your Cart is Empty
      </h2>

      <p className="mt-2 text-gray-500 text-center">
        You haven't added any jerseys to your cart yet.
      </p>

      {/* Continue Shopping */}
      <button
        type="button"
        onClick={() => navigate("/products")}
        className="
          mt-6
          px-6
          py-3
          rounded-lg
          bg-[#d90416]
          hover:bg-[#b90312]
          text-white
          font-semibold
          transition
        "
      >
        Continue Shopping
      </button>

    </div>
  );
}

export default EmptyCart;