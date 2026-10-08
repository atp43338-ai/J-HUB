import { Routes, Route } from "react-router";

import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import OTPVerification from "./features/auth/pages/OTPVerification";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";

import Home from "./features/home/pages/Home";

import Profile from "./features/profile/pages/Profile";
import EditProfile from "./features/profile/pages/EditProfile";
import ChangePassword from "./features/profile/pages/ChangePassword";

import Address from "./features/address/pages/Address";
import AddEditAddress from "./features/address/pages/AddEditAddress";
import EmailVerification from "./features/profile/pages/EmailVerification";

import AdminLogin from "./features/admin/pages/AdminLogin";
import UserManagement from "./features/admin/pages/UserManagement";

import ProductManagement from "./features/admin/pages/admin/product/ProductManagement";
import ProductListing from "./features/product/pages/ProductListing";

import ProductDetails from "./features/product/pages/ProductDetails";

import CategoryManagement from "./features/admin/pages/admin/category/CategoryManagement";

import Cart from "./features/cart/pages/Cart";

import OrderManagement from "./features/admin/pages/admin/order/OrderManagement";

import Wishlist from "./features/wishlist/pages/Wishlist";

import Checkout from "./features/checkout/pages/Checkout";
import OrderSuccess from "./features/checkout/components/OrderSuccess";
import OrderFailed from "./features/checkout/components/OrderFailed";

import MyOrders from "./features/order/pages/MyOrders";

import AdminOrderDetails from "./features/admin/pages/admin/order/OrderDetails";
import UserOrderDetails from "./features/order/pages/OrderDetails";

import AdminLayout from "./features/admin/components/AdminLayout";
import AdminDashboard from "./features/admin/pages/admin/dashboard/AdminDashboard";
import OfferManagement from "./features/admin/pages/admin/offer/OfferManagement";
import CouponManagement from "./features/admin/pages/admin/coupon/CouponManagement";
import SalesReport from "./features/admin/pages/admin/sales/SalesReport";
import ReferralOfferManagement from "./features/admin/pages/admin/referral/ReferralOfferManagement";

import InventoryManagement from "./features/admin/pages/admin/inventory/InventoryManagement";

import ReturnManagement from "./features/admin/pages/admin/return/ReturnManagement";

import Referral from "./features/referral/pages/Referral";
import Wallet from "./features/wallet/pages/Wallet";

import ProtectedRoute from "./middleware/ProtectedRoute";
import PublicRoute from "./middleware/PublicRoute";

function App() {
  return (
    <Routes>

      {/* =========================
          AUTH
      ========================= */}

      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route path="/otp-verification" element={<OTPVerification />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password" element={<ResetPassword />} />


      {/* =========================
          HOME
      ========================= */}

      <Route path="/" element={<Home />} />


      {/* =========================
          PROFILE
      ========================= */}

      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />

      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

      <Route path="/address" element={<ProtectedRoute><Address /></ProtectedRoute>} />

      <Route path="/address/add" element={<ProtectedRoute><AddEditAddress /></ProtectedRoute>} />

      <Route path="/address/edit/:id" element={<ProtectedRoute><AddEditAddress /></ProtectedRoute>} />

      <Route path="/email-verification" element={<ProtectedRoute><EmailVerification /></ProtectedRoute>} />


      {/* =========================
          ADMIN LOGIN
      ========================= */}

      <Route path="/admin/login" element={<PublicRoute admin><AdminLogin /></PublicRoute>} />


      {/* =========================
          ADMIN LAYOUT
      ========================= */}

      <Route path="/admin" element={<ProtectedRoute admin><AdminLayout /></ProtectedRoute>}>

        <Route index element={<AdminDashboard />} />

        <Route path="users" element={<UserManagement />} />

        <Route path="products" element={<ProductManagement />} />

        <Route path="categories" element={<CategoryManagement />} />

        <Route path="orders" element={<OrderManagement />} />

        <Route path="orders/:id" element={<AdminOrderDetails />} />

        <Route path="inventory" element={<InventoryManagement />} />

        <Route path="returns" element={<ReturnManagement />} />

        <Route path="offers" element={<OfferManagement />} />

        <Route path="/admin/coupons" element={<CouponManagement />} />

        <Route path="/admin/sales" element={<SalesReport />} />

        <Route path="/admin/referrals" element={<ReferralOfferManagement />} />

      </Route>


      {/* =========================
          PRODUCTS
      ========================= */}

      <Route path="/products" element={<ProductListing />} />

      <Route path="/products/:id" element={<ProductDetails />} />


      {/* =========================
          CART
      ========================= */}

      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />


      {/* =========================
          WISHLIST
      ========================= */}

      <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />


      {/* =========================
          CHECKOUT
      ========================= */}

      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />


      {/* =========================
          ORDER SUCCESS
      ========================= */}

      <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
      <Route path="/order-failed" element={<OrderFailed />} />


      {/* =========================
          USER ORDERS
      ========================= */}

      <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

      <Route path="/orders/:orderId" element={<ProtectedRoute><UserOrderDetails /></ProtectedRoute>} />
      
      {/*referrel*/}

      <Route path="/referral" element={ <ProtectedRoute> <Referral /> </ProtectedRoute>} />

      <Route path="/wallet" element={ <ProtectedRoute> <Wallet /> </ProtectedRoute> } />

    </Routes>
  );
}

export default App;