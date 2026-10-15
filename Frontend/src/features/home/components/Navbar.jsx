import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { useCart } from "../../cart/context/CartContext";
import { useEffect, useState } from "react";
import { getWishlist } from "../../wishlist/services/wishlistService";
import { getProfileImageUrl } from "../../profile/services/profileService";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncUser = () => {
      try {
        setCurrentUser(JSON.parse(localStorage.getItem("user")) || null);
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener("userUpdated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("userUpdated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const { cartCount } = useCart();

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Sync searchTerm with URL query param if present
  useEffect(() => {
    const query = searchParams.get("search") || searchParams.get("q") || "";
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/shop");
    }
  };

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
      setIsScrolled(window.scrollY > 20);
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
    const handleWishlistUpdate = (e) => {
      if (e?.detail?.count !== undefined) {
        setWishlistCount(e.detail.count);
      } else {
        fetchWishlistCount();
      }
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

  // Route & Contrast detection (transparent overlay on Home and Products/Shop hero banners)
  const isHeroPage =
    location.pathname === "/" ||
    location.pathname === "/products" ||
    location.pathname === "/shop";

  const isLightPage = !isHeroPage || isScrolled;
  const navTextColor = isLightPage ? "text-gray-800" : "text-white";
  const navIconColor = isLightPage
    ? "text-gray-700 hover:text-[#d90416]"
    : "text-white hover:text-red-400";
  const badgeBg = "bg-[#d90416] text-white";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isLightPage
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 text-gray-900"
          : "bg-transparent border-b border-transparent shadow-none text-white"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-[80px] flex items-center justify-between">

        {/* Logo */}
        <button
          type="button"
          onClick={handleHome}
          className="text-2xl md:text-3xl font-extrabold tracking-wide"
        >
          <span className={navTextColor}>
            J
          </span>

          <span className={navTextColor}>
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
            className={`font-medium transition ${navTextColor} hover:text-[#d90416]`}
          >
            Home
          </button>

          {/* Shop */}
          <button
            type="button"
            onClick={handleShop}
            className={`font-medium transition ${navTextColor} hover:text-[#d90416]`}
          >
            Shop
          </button>

          {/* About */}
          <button
            type="button"
            onClick={handleAbout}
            className={`font-medium transition ${navTextColor} hover:text-[#d90416]`}
          >
            About
          </button>

          {/* Contact */}
          <button
            type="button"
            onClick={handleContact}
            className={`font-medium transition ${navTextColor} hover:text-[#d90416]`}
          >
            Contact Us
          </button>

        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5 sm:gap-7 md:gap-8">

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              placeholder="Search jerseys..."
              className={`h-9 pl-3.5 pr-8 rounded-full text-xs font-medium transition-all duration-300 outline-none ${
                isLightPage
                  ? "bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-200 focus:bg-white focus:border-[#d90416]"
                  : "bg-white/15 text-white placeholder-gray-300 border border-white/30 focus:bg-white focus:text-black focus:placeholder-gray-400 focus:border-white"
              } w-24 sm:w-36 md:w-52 focus:w-36 sm:focus:w-48 md:focus:w-60`}
            />

            <button
              type="submit"
              onClick={handleSearch}
              className={`absolute right-2.5 p-1 transition ${navIconColor}`}
              title="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
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
            </button>
          </form>

          {/* Wishlist */}
          <div className="relative">

            <Link
              to="/wishlist"
              className={`transition ${navIconColor}`}
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
              <span className={`absolute -top-3 -right-3 w-5 h-5 rounded-full ${badgeBg} text-[11px] font-bold flex items-center justify-center`}>
                {wishlistCount}
              </span>
            )}

          </div>

          {/* Cart */}
          <div className="relative">

            <Link
              to="/cart"
              className={`transition ${navIconColor}`}
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
              <span className={`absolute -top-3 -right-3 w-5 h-5 rounded-full ${badgeBg} text-[11px] font-bold flex items-center justify-center`}>
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
              className={`w-11 h-11 rounded-full flex items-center justify-center transition overflow-hidden border-2 ${
                isLightPage
                  ? "bg-gray-100 text-gray-800 hover:bg-[#d90416] hover:text-white border-gray-200"
                  : "bg-white/20 text-white hover:bg-[#d90416] border-white/40"
              }`}
              title="Profile"
            >
              {currentUser?.profileImage ? (
                <img
                  src={getProfileImageUrl(currentUser.profileImage)}
                  alt={currentUser.name || "User"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-sm">👤</span>
              )}
            </Link>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;