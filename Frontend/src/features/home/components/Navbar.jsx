import { Link, useLocation, useNavigate } from "react-router";
import { useCart } from "../../cart/context/CartContext";
import { useEffect, useState } from "react";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  const token = localStorage.getItem("token");

  const { cartCount } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
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
          onClick={handleHome}
          className="text-2xl md:text-3xl font-extrabold tracking-wide"
        >
          <span
            className={
              isScrolled ? "text-black" : "text-white"
            }
          >
            J
          </span>

          <span
            className={
              isScrolled ? "text-black" : "text-white"
            }
          >
            {" - "}
          </span>

          <span className="text-[#d90416]">
            HUB
          </span>
        </button>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">

          <button
            onClick={handleHome}
            className={`font-medium transition ${
              isScrolled
                ? "text-black hover:text-[#d90416]"
                : "text-white hover:text-[#d90416]"
            }`}
          >
            Home
          </button>

          <button
            onClick={handleShop}
            className={`font-medium transition ${
              isScrolled
                ? "text-black hover:text-[#d90416]"
                : "text-white hover:text-[#d90416]"
            }`}
          >
            Shop
          </button>

          <button
            onClick={handleAbout}
            className={`font-medium transition ${
              isScrolled
                ? "text-black hover:text-[#d90416]"
                : "text-white hover:text-[#d90416]"
            }`}
          >
            About
          </button>

          <button
            onClick={handleContact}
            className={`font-medium transition ${
              isScrolled
                ? "text-black hover:text-[#d90416]"
                : "text-white hover:text-[#d90416]"
            }`}
          >
            Contact Us
          </button>

        </div>

        {/* Right Side */}
        <div className="flex items-center gap-10">

          {/* Search */}
          <Link
            to="/products"
            className={`transition ${
              isScrolled
                ? "text-black hover:text-[#d90416]"
                : "text-white hover:text-[#d90416]"
            }`}
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
          <Link
            to="/wishlist"
            className={`transition ${
              isScrolled
                ? "text-black hover:text-[#d90416]"
                : "text-white hover:text-[#d90416]"
            }`}
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

          {/* Cart */}
          <div className="relative">
            <Link
              to="/cart"
              className={`transition ${
                isScrolled
                  ? "text-black hover:text-[#d90416]"
                  : "text-white hover:text-[#d90416]"
              }`}
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
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
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
              className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#d90416] transition"
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