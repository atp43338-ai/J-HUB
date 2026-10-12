import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

import { CartProvider } from "./features/cart/context/CartContext";
import { WishlistProvider } from "./features/wishlist/context/WishlistContext";

const clientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "261069794901-58gkbo439mcimlk16r6f7tcqeu9vop4a.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <CartProvider>
          <WishlistProvider>
            <App />
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);