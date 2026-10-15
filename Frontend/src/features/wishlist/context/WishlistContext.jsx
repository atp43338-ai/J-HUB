import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../services/wishlistService";

import toast from "react-hot-toast";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist
  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      const data = await getWishlist();

      setWishlist(data.wishlist?.products || []);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);

      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productOrId) => {
    if (!productOrId) return false;
    const targetId = String(productOrId?._id || productOrId);
    return wishlist.some((item) => {
      if (!item) return false;
      const id = item.product?._id || item.product || item._id;
      return String(id) === targetId;
    });
  };

  // Add product with selected size
  const handleAddToWishlist = async (
    productOrId,
    size
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    const productId = String(productOrId?._id || productOrId);
    const selectedSize =
      size ||
      (typeof productOrId === "object"
        ? productOrId.variants?.find((v) => v.stock > 0)?.size ||
          productOrId.variants?.[0]?.size
        : undefined);

    try {
      const data = await addToWishlist(
        productId,
        selectedSize
      );

      const updated = data.wishlist?.products || [];
      setWishlist(updated);
      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", {
          detail: { count: updated.length },
        })
      );

      toast.success("Added to wishlist");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Remove product (optimistically updates state for real-time UI feedback)
  const handleRemoveFromWishlist = async (
    productOrId,
    silent = false
  ) => {
    if (!productOrId) return;
    const targetId = String(productOrId?._id || productOrId);

    // Optimistic local state update
    setWishlist((prev) => {
      const next = prev.filter((item) => {
        const id = item.product?._id || item.product || item._id;
        return String(id) !== targetId;
      });
      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", {
          detail: { count: next.length },
        })
      );
      return next;
    });

    try {
      const data = await removeFromWishlist(targetId);

      if (data?.wishlist?.products) {
        setWishlist(data.wishlist.products);
        window.dispatchEvent(
          new CustomEvent("wishlistUpdated", {
            detail: { count: data.wishlist.products.length },
          })
        );
      }
      if (!silent) {
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      if (!silent) {
        toast.error(error.message);
      }
      fetchWishlist();
    }
  };

  // Instantly remove product when it is added to cart
  const removeProductOnAddToCart = (productOrId) => {
    if (!productOrId) return;
    const targetId = String(productOrId?._id || productOrId);
    setWishlist((prev) => {
      const next = prev.filter((item) => {
        const id = item.product?._id || item.product || item._id;
        return String(id) !== targetId;
      });
      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", {
          detail: { count: next.length },
        })
      );
      return next;
    });
  };

  // Clear wishlist
  const handleClearWishlist = async () => {
    try {
      const data = await clearWishlist();

      setWishlist(data.wishlist?.products || []);
      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", {
          detail: { count: 0 },
        })
      );

      toast.success("Wishlist cleared");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        fetchWishlist,
        isInWishlist,
        addToWishlist: handleAddToWishlist,
        removeFromWishlist: handleRemoveFromWishlist,
        removeProductOnAddToCart,
        clearWishlist: handleClearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};