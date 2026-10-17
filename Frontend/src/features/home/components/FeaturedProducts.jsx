import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getProducts } from "../../product/services/productService";
import { useNavigate, Link } from "react-router";
import { getProductPricing } from "../../../utils/pricing";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../wishlist/services/wishlistService";

function FeaturedProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [wishlistMessageType, setWishlistMessageType] =
    useState("success");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  // GET WISHLIST
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setWishlistProducts([]);
        return;
      }

      try {
        const data = await getWishlist();

        const wishlistIds =
          data?.wishlist?.products?.map(
            (product) => product._id
          ) || [];

        setWishlistProducts(wishlistIds);
      } catch (error) {
        console.error(
          "Wishlist fetch error:",
          error
        );
      }
    };

    fetchWishlist();
  }, []);

  // WISHLIST POPUP
  const showWishlistMessage = (
    message,
    type = "success"
  ) => {
    setWishlistMessage(message);
    setWishlistMessageType(type);

    setTimeout(() => {
      setWishlistMessage("");
    }, 2000);
  };

  // ADD / REMOVE WISHLIST
  const handleWishlist = async (
    e,
    product
  ) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    // LOGIN REQUIRED
    if (!token) {
      showWishlistMessage(
        "Please login to use wishlist",
        "error"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      return;
    }

    const isInWishlist =
      wishlistProducts.includes(product._id);

    try {
      if (isInWishlist) {
        // REMOVE FROM WISHLIST

        await removeFromWishlist(
          product._id
        );

        setWishlistProducts((previous) =>
          previous.filter(
            (id) => id !== product._id
          )
        );

        showWishlistMessage(
          "Removed from wishlist",
          "success"
        );
      } else {
        // ADD TO WISHLIST

        // Backend automatically selects
        // an available size

        await addToWishlist(
          product._id
        );

        setWishlistProducts((previous) => [
          ...previous,
          product._id,
        ]);

        showWishlistMessage(
          "Added to wishlist",
          "success"
        );
      }

      // UPDATE NAVBAR WISHLIST COUNT
      window.dispatchEvent(
        new Event("wishlistUpdated")
      );

    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      showWishlistMessage(
        error.message ||
          "Wishlist update failed",
        "error"
      );
    }
  };

  return (
    <section
      id="shop"
      className="py-12 sm:py-24 px-3 sm:px-6 md:px-10 bg-white overflow-x-hidden"
    >
      <div className="max-w-[1400px] mx-auto">

        {/* WISHLIST POPUP */}
        {wishlistMessage && (
          <div
            className="
              fixed
              top-6
              left-1/2
              -translate-x-1/2
              z-[9999]
              bg-white
              text-gray-700
              px-5
              py-3
              rounded-lg
              shadow-lg
              flex
              items-center
              gap-3
              text-base
              font-medium
              border
              border-gray-100
            "
          >
            {wishlistMessageType === "success" ? (
              <div
                className="
                  w-6
                  h-6
                  rounded-full
                  bg-green-500
                  text-white
                  flex
                  items-center
                  justify-center
                  text-sm
                  font-bold
                "
              >
                ✓
              </div>
            ) : (
              <div
                className="
                  w-6
                  h-6
                  rounded-full
                  bg-red-500
                  text-white
                  flex
                  items-center
                  justify-center
                  text-sm
                  font-bold
                "
              >
                ×
              </div>
            )}

            <span>
              {wishlistMessage}
            </span>
          </div>
        )}

        {/* Title */}
        <motion.div
          initial={{
            opacity: 0,
            y: -40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          viewport={{
            once: true,
          }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold !text-black">
            NEW ARRIVALS
          </h2>

          <p className="mt-3 text-gray-500">
            Explore our latest jersey collection
          </p>
        </motion.div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">

          {products
            .slice(0, 4)
            .map((product, index) => {

              const direction =
                index % 2 === 0
                  ? -100
                  : 100;

              const isInWishlist =
                wishlistProducts.includes(
                  product._id
                );

              const { sellingPrice, originalPrice, discount, hasDiscount } =
                getProductPricing(product);

              return (
                <motion.div
                  key={product._id}
                  initial={{
                    opacity: 0,
                    x: direction,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.15,
                    ease: "easeOut",
                  }}
                  viewport={{
                    once: true,
                  }}
                  whileHover={{
                    y: -8,
                  }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex flex-col justify-between w-full"
                >

                  {/* Product Image Frame */}
                  <div
                    className="relative w-full aspect-[4/5] bg-black rounded-xl overflow-hidden mb-4 flex items-center justify-center cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/products/${product._id}`
                      )
                    }
                  >

                    {/* Discount Corner Badge */}
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 bg-[#d90416] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm tracking-wide">
                        {discount}% OFF
                      </div>
                    )}

                    <motion.img
                      src={
                        product.images?.[0]?.startsWith("http")
                          ? product.images[0].replace("http://localhost:5000", "https://api.afsal.online")
                          : `https://api.afsal.online${product.images?.[0]}`
                      }
                      alt={product.name}
                      whileHover={{
                        scale: 1.08,
                      }}
                      transition={{
                        duration: 0.5,
                      }}
                      className="w-full h-full object-contain"
                    />

                    {/* Wishlist Heart */}
                    <button
                      type="button"
                      onClick={(e) =>
                        handleWishlist(
                          e,
                          product
                        )
                      }
                      className="absolute top-3 right-3 text-white hover:text-[#d90416] transition-colors p-1 z-10 cursor-pointer"
                      title={
                        isInWishlist
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                        viewBox="0 0 24 24"
                        fill={
                          isInWishlist
                            ? "#d90416"
                            : "none"
                        }
                        stroke={isInWishlist ? "#d90416" : "white"}
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                        />
                      </svg>
                    </button>

                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col flex-1 justify-between">

                    <div>
                      <h3
                        className="font-medium text-gray-900 text-base mb-1 truncate cursor-pointer"
                        title={product.name}
                        onClick={() =>
                          navigate(`/products/${product._id}`)
                        }
                      >
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="text-lg font-bold text-gray-900 mb-3">
                        ₹{sellingPrice}
                      </div>
                    </div>

                    <div>
                      {/* Buy Now */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/products/${product._id}`
                          )
                        }
                        className="w-full bg-black hover:bg-neutral-800 text-white font-medium py-2.5 rounded-lg mb-2 transition text-sm sm:text-base"
                      >
                        Buy Now
                      </button>

                      {/* Add to Cart */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/products/${product._id}`
                          )
                        }
                        className="w-full bg-[#d90416] hover:bg-[#b90312] text-white font-medium py-2.5 rounded-lg transition text-sm sm:text-base"
                      >
                        Add to Cart
                      </button>
                    </div>

                  </div>

                </motion.div>
              );
            })}

        </div>

       {/* View All Products */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.7,
          }}
          viewport={{
            once: true,
          }}
          className="flex justify-center mt-12"
        >
          <Link
            to="/products"
            className="
              px-8
              py-3
              rounded-lg
              border-2
              border-[#d90416]
              text-[#d90416]
              hover:bg-[#d90416]
              hover:text-white
              font-semibold
              transition
              duration-300
            "
          >
            View All Products
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

export default FeaturedProducts;