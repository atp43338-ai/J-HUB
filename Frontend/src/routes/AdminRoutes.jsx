import { Routes, Route } from "react-router";

import AdminLogin from "../features/admin/auth/pages/AdminLogin";
import UserManagement from "../features/admin/user/pages/UserManagement";

import ProductManagement from "../features/admin/product/pages/ProductManagement";
import CategoryManagement from "../features/admin/category/pages/CategoryManagement";

import OrderManagement from "../features/admin/order/pages/OrderManagement";
import AdminOrderDetails from "../features/admin/order/pages/OrderDetails";

import InventoryManagement from "../features/admin/inventory/pages/InventoryManagement";
import ReturnManagement from "../features/admin/return/pages/ReturnManagement";

import OfferManagement from "../features/admin/offer/pages/OfferManagement";
import CouponManagement from "../features/admin/coupon/pages/CouponManagement";

import SalesReport from "../features/admin/sales/pages/SalesReport";
import ReferralOfferManagement from "../features/admin/referral/pages/ReferralOfferManagement";

import AdminDashboard from "../features/admin/dashboard/pages/AdminDashboard";

import AdminLayout from "../features/admin/components/AdminLayout";

import ProtectedRoute from "../middleware/ProtectedRoute";
import PublicRoute from "../middleware/PublicRoute";

function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <PublicRoute admin>
            <AdminLogin />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute admin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />

        <Route path="users" element={<UserManagement />} />

        <Route path="products" element={<ProductManagement />} />

        <Route path="categories" element={<CategoryManagement />} />

        <Route path="orders" element={<OrderManagement />} />

        <Route path="orders/:id" element={<AdminOrderDetails />} />

        <Route path="inventory" element={<InventoryManagement />} />

        <Route path="returns" element={<ReturnManagement />} />

        <Route path="offers" element={<OfferManagement />} />

        <Route path="coupons" element={<CouponManagement />} />

        <Route path="sales" element={<SalesReport />} />

        <Route path="referrals" element={<ReferralOfferManagement />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;