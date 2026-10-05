import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import Navbar from "../../home/components/Navbar";
import Footer from "../../home/components/Footer";

import { useWishlist } from "../context/WishlistContext";
import { addToCart } from "../../cart/services/cartService";
import { useCart } from "../../cart/context/CartContext";

function Wishlist() {
  const navigate = useNavigate();

  const {
    wishlist,
    loading,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { refreshCartCount } = useCart();

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  // Add wishlist product to cart using saved size
  const handleMoveToCart = async (product) => {
    if (!product.size) {
      toast.error("Size is not available");
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        size: product.size,
        quantity: 1,
      });

      await refreshCartCount();

      await removeFromWishlist(product._id);

      toast.success(
        `Product added to cart with size ${product.size}`
      );

      navigate("/cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-500">
            Loading wishlist...
          </p>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="px-6 md:px-10 py-10">
        <div className="max-w-[1400px] mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                <span className="text-black">
                  My{" "}
                </span>

                <span className="text-[#d90416]">
                  Wishlist
                </span>
              </h1>

              <p className="text-gray-500 mt-2">
                Products you saved for later.
              </p>
            </div>

            {wishlist.length > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className="px-5 py-2.5 border border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition"
              >
                Clear Wishlist
              </button>
            )}

          </div>

          {/* Empty Wishlist */}
          {wishlist.length === 0 ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">

              <div className="text-6xl mb-5">
                ♡
              </div>

              <h2 className="text-2xl font-bold !text-black">
                Your Wishlist is Empty
              </h2>

              <p className="text-gray-500 mt-2">
                Save your favorite jerseys here.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/products")
                }
                className="mt-6 px-7 py-3 bg-[#d90416] text-white rounded-lg font-semibold hover:bg-[#b90312] transition"
              >
                Continue Shopping
              </button>

            </div>
          ) : (

            /* Wishlist Products */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {wishlist.map((product) => (

                <div
                  key={product._id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
                >

                  {/* Image */}
                  <div
                    className="relative cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/products/${product._id}`
                      )
                    }
                  >
                    <img
                      src={`http://localhost:5000${product.images?.[0]}`}
                      alt={product.name}
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-5">

                    <h3 className="text-lg font-semibold">
                      {product.name}
                    </h3>

                    {/* Size */}
                    {product.size && (
                      <p className="text-sm text-gray-500 mt-2">
                        Size:{" "}
                        <span className="font-semibold text-black">
                          {product.size}
                        </span>
                      </p>
                    )}

                    <p className="text-xl font-bold mt-2">
                      ₹
                      {product.price?.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() =>
                        handleRemove(product._id)
                      }
                      className="w-full mt-4 py-2 border border-gray-300 rounded-lg text-red-600 font-semibold hover:bg-red-50 transition"
                    >
                      Remove
                    </button>

                    {/* Add to Cart */}
                    <button
                      type="button"
                      onClick={() =>
                        handleMoveToCart(product)
                      }
                      className="w-full mt-3 py-2 bg-[#d90416] text-white rounded-lg font-semibold hover:bg-[#b90312] transition"
                    >
                      Add to Cart
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Wishlist;