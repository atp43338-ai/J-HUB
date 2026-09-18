import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import EmptyCart from "../components/EmptyCart";

import { getCart, updateCartItem, removeCartItem  } from "../services/cartService";
import { useCart } from "../context/CartContext";

import Navbar from "../../home/components/Navbar";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const { refreshCartCount } = useCart();

  const handleQuantityChange = async (itemId, quantity) => {
  try {
    await updateCartItem(itemId, quantity);

    const data = await getCart();
    setCart(data.cart);

    await refreshCartCount();

  } catch (error) {
    toast.error(error.message);
  }
};

const handleRemove = async (itemId) => {
  try {
    await removeCartItem(itemId);

    const data = await getCart();
    setCart(data.cart);

    await refreshCartCount();

    toast.success("Item removed from cart");
  } catch (error) {
    toast.error(error.message);
  }
};

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data.cart);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Loading cart...
        </p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  // Calculate subtotal
  const subtotal = cart.items.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
        <Navbar/>

      <div className="max-w-[1200px] mx-auto">

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold !text-black">
            <span className="text-black">My</span>
            <span className="text-[#d90416]"> Cart</span>
          </h1>

          <p className="mt-2 !text-black">
            Review your selected jerseys
          </p>
        </div>

        {/* Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 h-[650px] overflow-y-auto pr-4 space-y-5 scrollbar-hide">

            {cart.items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}

          </div>

          {/* Cart Summary */}
          <div>
            <CartSummary
              subtotal={subtotal}
              discount={0}
              delivery={100}
            />
          </div>

          

        </div>
        
      </div>
    </div>
  );
}

export default Cart;