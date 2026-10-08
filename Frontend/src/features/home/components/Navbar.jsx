import { Link, useLocation, useNavigate } from "react-router";
import { useCart } from "../../cart/context/CartContext";
import { useEffect, useState } from "react";
import { getWishlist } from "../../wishlist/services/wishlistService";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const token = localStorage.getItem("token");

  const { cartCount } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  // Get wishlist count
  const fetchWishlistCount = async () => {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      setWishlistCount(0);
      return;
    }

    try {
      const data = await getWishlist();

      setWishlistCount(
        data?.wishlist?.products?.length || 0
      );
    } catch (error) {
      console.error(
        "Wishlist count error:",
        error
      );

      setWishlistCount(0);
    }
  };

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // Fetch wishlist count
  useEffect(() => {
    fetchWishlistCount();
  }, [token]);

  // Update wishlist count when wishlist changes
  useEffect(() => {
    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdate
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdate
      );
    };
  }, []);

  // Home
  const handleHome = () => {
    if (location.pathname === "/") {
      document.getElementById("home")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/");
    }
  };

  // Shop
  const handleShop = () => {
    if (location.pathname === "/") {
      document.getElementById("shop")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/products");
    }
  };

  // About
  const handleAbout = () => {
    if (location.pathname === "/") {
      document.getElementById("about")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/");

      setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  };

  // Contact
  const handleContact = () => {
    if (location.pathname === "/") {
      document.getElementById("contact")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/");

      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  };

  /*
    White pages:
    → Black text/icons before scrolling

    Home dark hero:
    → White text/icons before scrolling

    After scrolling:
    → Black text/icons
  */

  const isHomePage = location.pathname === "/";

  const useWhiteText = isHomePage && !isScrolled;

  const textColor = useWhiteText
    ? "text-white"
    : "text-black";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white border-b border-gray-200 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-[80px] flex items-center justify-between">

        {/* Logo */}
        <button
          type="button"
          onClick={handleHome}
          className="text-2xl md:text-3xl font-extrabold tracking-wide"
        >
          <span className={textColor}>
            J
          </span>

          <span className={textColor}>
            {" - "}
          </span>

          <span className="text-[#d90416]">
            HUB
          </span>
        </button>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">

          {/* Home */}
          <button
            type="button"
            onClick={handleHome}
            className={`font-medium transition ${textColor} hover:text-[#d90416]`}
          >
            Home
          </button>

          {/* Shop */}
          <button
            type="button"
            onClick={handleShop}
            className={`font-medium transition ${textColor} hover:text-[#d90416]`}
          >
            Shop
          </button>

          {/* About */}
          <button
            type="button"
            onClick={handleAbout}
            className={`font-medium transition ${textColor} hover:text-[#d90416]`}
          >
            About
          </button>

          {/* Contact */}
          <button
            type="button"
            onClick={handleContact}
            className={`font-medium transition ${textColor} hover:text-[#d90416]`}
          >
            Contact Us
          </button>

        </div>

        {/* Right Side */}
        <div className="flex items-center gap-10">

          {/* Search */}
          <Link
            to="/products"
            className={`transition ${textColor} hover:text-[#d90416]`}
            title="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
              />
            </svg>
          </Link>

          {/* Wishlist */}
          <div className="relative">

            <Link
              to="/wishlist"
              className={`transition ${textColor} hover:text-[#d90416]`}
              title="Wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                />
              </svg>
            </Link>

            {wishlistCount > 0 && (
              <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-[#d90416] text-white text-[11px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}

          </div>

          {/* Cart */}
          <div className="relative">

            <Link
              to="/cart"
              className={`transition ${textColor} hover:text-[#d90416]`}
              title="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6"
                />

                <circle
                  cx="10"
                  cy="20"
                  r="1"
                />

                <circle
                  cx="18"
                  cy="20"
                  r="1"
                />
              </svg>
            </Link>

            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-[#d90416] text-white text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}

          </div>

          {/* Login / Profile */}
          {!token ? (
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-lg bg-[#d90416] hover:bg-[#b90312] text-white font-semibold transition"
            >
              Login
            </Link>
          ) : (
            <Link
              to="/profile"
              className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
                useWhiteText
                  ? "bg-white text-black hover:bg-[#d90416] hover:text-white"
                  : "bg-black text-white hover:bg-[#d90416]"
              }`}
            >
              👤
            </Link>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;