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
  const isInWishlist = (productId) => {
    return wishlist.some(
      (product) => product._id === productId
    );
  };

  // Add product
  const handleAddToWishlist = async (productId) => {
    try {
      const data = await addToWishlist(productId);

      setWishlist(data.wishlist?.products || []);

      toast.success("Added to wishlist");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Remove product
  const handleRemoveFromWishlist = async (productId) => {
    try {
      const data = await removeFromWishlist(productId);

      setWishlist(data.wishlist?.products || []);

      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Clear wishlist
  const handleClearWishlist = async () => {
    try {
      const data = await clearWishlist();

      setWishlist(data.wishlist?.products || []);

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