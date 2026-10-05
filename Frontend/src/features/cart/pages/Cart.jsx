import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import EmptyCart from "../components/EmptyCart";

import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../services/cartService";

import { useCart } from "../context/CartContext";

import Navbar from "../../home/components/Navbar";
import Footer from "../../home/components/Footer";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const { refreshCartCount } = useCart();

  // -----------------------------
  // UPDATE QUANTITY
  // -----------------------------
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

  // -----------------------------
  // REMOVE ITEM
  // -----------------------------
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

  // -----------------------------
  // GET CART
  // -----------------------------
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

  // -----------------------------
  // LOADING
  // -----------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">

        <Navbar />

        <main className="min-h-screen flex items-center justify-center pt-[100px]">
          <p className="text-gray-500">
            Loading cart...
          </p>
        </main>

        <Footer />

      </div>
    );
  }

  // -----------------------------
  // EMPTY CART
  // -----------------------------
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">

        <Navbar />

        <main className="min-h-screen pt-[100px]">
          <EmptyCart />
        </main>

        <Footer />

      </div>
    );
  }

  // -----------------------------
  // OUT OF STOCK CHECK
  // -----------------------------
  const hasOutOfStockItem = cart.items.some((item) => {
    const variant = item.product?.variants?.find(
      (variant) => variant.size === item.size
    );

    const stock = variant?.stock ?? 0;

    return stock === 0 || item.quantity > stock;
  });

  // -----------------------------
  // SUBTOTAL
  // -----------------------------
  const subtotal = cart.items.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  // -----------------------------
  // CART PAGE
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <Navbar />

      <main className="pt-[110px] pb-12 px-6">

        <div className="max-w-[1200px] mx-auto">

          {/* TITLE */}
          <div className="mb-10">

            <h1 className="text-3xl font-bold">
              <span className="text-black">
                My
              </span>

              <span className="text-[#d90416]">
                {" "}Cart
              </span>
            </h1>

            <p className="mt-2 text-gray-500">
              Review your selected jerseys
            </p>

          </div>

          {/* CART LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CART ITEMS */}
            <div
              className="
                lg:col-span-2
                max-h-[650px]
                overflow-y-auto
                pr-4
                space-y-5
                scrollbar-hide
              "
            >
              {cart.items.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* CART SUMMARY */}
            <div>
              <CartSummary
                subtotal={subtotal}
                discount={0}
                delivery={100}
                hasOutOfStockItem={hasOutOfStockItem}
                cartItems={cart.items}
              />
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default Cart;