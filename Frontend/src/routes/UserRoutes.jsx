import { Routes, Route } from "react-router";

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import OTPVerification from "../features/auth/pages/OTPVerification";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";

import Home from "../features/home/pages/Home";

import Profile from "../features/profile/pages/Profile";
import EditProfile from "../features/profile/pages/EditProfile";
import ChangePassword from "../features/profile/pages/ChangePassword";
import EmailVerification from "../features/profile/pages/EmailVerification";

import Address from "../features/address/pages/Address";
import AddEditAddress from "../features/address/pages/AddEditAddress";

import ProductListing from "../features/product/pages/ProductListing";
import ProductDetails from "../features/product/pages/ProductDetails";

import Cart from "../features/cart/pages/Cart";
import Wishlist from "../features/wishlist/pages/Wishlist";

import Checkout from "../features/checkout/pages/Checkout";
import OrderSuccess from "../features/checkout/components/OrderSuccess";
import OrderFailed from "../features/checkout/components/OrderFailed";

import MyOrders from "../features/order/pages/MyOrders";
import UserOrderDetails from "../features/order/pages/OrderDetails";

import Referral from "../features/referral/pages/Referral";
import Wallet from "../features/wallet/pages/Wallet";

import ProtectedRoute from "../middleware/ProtectedRoute";
import PublicRoute from "../middleware/PublicRoute";

function UserRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/otp-verification"
        element={<OTPVerification />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route
        path="/address"
        element={
          <ProtectedRoute>
            <Address />
          </ProtectedRoute>
        }
      />

      <Route
        path="/address/add"
        element={
          <ProtectedRoute>
            <AddEditAddress />
          </ProtectedRoute>
        }
      />

      <Route
        path="/address/edit/:id"
        element={
          <ProtectedRoute>
            <AddEditAddress />
          </ProtectedRoute>
        }
      />

      <Route
        path="/email-verification"
        element={
          <ProtectedRoute>
            <EmailVerification />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={<ProductListing />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-failed"
        element={<OrderFailed />}
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:orderId"
        element={
          <ProtectedRoute>
            <UserOrderDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/referral"
        element={
          <ProtectedRoute>
            <Referral />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default UserRoutes;