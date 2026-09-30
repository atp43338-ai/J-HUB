import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { generateInvoicePDF } from "../services/invoiceService";

import Navbar from "../../home/components/Navbar";
import Footer from "../../home/components/Footer";

import {
  getOrderById,
  cancelOrder,
  cancelOrderItem,
} from "../services/orderService";

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // CANCEL ORDER LOADING
  const [cancelling, setCancelling] = useState(false);

  // CANCEL ITEM LOADING
  const [cancellingItem, setCancellingItem] = useState(null);

  // FETCH ORDER
  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        const data = await getOrderById(orderId);

        setOrder(data.order);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast.error(error.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  // CANCEL ORDER
  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return;
    }

    const reason = window.prompt(
      "Enter cancellation reason (optional):"
    );

    if (reason === null) {
      return;
    }

    try {
      setCancelling(true);

      const data = await cancelOrder(
        orderId,
        reason
      );

      setOrder(data.order);

      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error(
        "Failed to cancel order:",
        error
      );

      toast.error(
        error.message || "Failed to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  // CANCEL SPECIFIC PRODUCT
  const handleCancelItem = async (itemId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this product?"
    );

    if (!confirmCancel) {
      return;
    }

    const reason = window.prompt(
      "Enter cancellation reason (optional):"
    );

    if (reason === null) {
      return;
    }

    try {
      setCancellingItem(itemId);

      const data = await cancelOrderItem(
        orderId,
        itemId,
        reason
      );

      setOrder(data.order);

      toast.success("Product cancelled successfully");
    } catch (error) {
      console.error(
        "Failed to cancel product:",
        error
      );

      toast.error(
        error.message || "Failed to cancel product"
      );
    } finally {
      setCancellingItem(null);
    }
  };

  // DOWNLOAD INVOICE
  const handleDownloadInvoice = () => {
    try {
      if (!order) {
        toast.error("Order details are not available");
        return;
      }

      generateInvoicePDF(order);

      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error(
        "Failed to generate invoice:",
        error
      );

      toast.error(
        "Failed to generate invoice"
      );
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex justify-center items-center min-h-[60vh]">
          <p style={{ color: "#6b7280" }}>
            Loading order...
          </p>
        </div>

        <Footer />
      </div>
    );
  }

  // ORDER NOT FOUND
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex justify-center items-center min-h-[60vh] px-4">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center max-w-md w-full">
            <h1
              className="text-2xl font-bold mb-3"
              style={{ color: "#111827" }}
            >
              Order Not Found
            </h1>

            <p
              className="mb-6"
              style={{ color: "#6b7280" }}
            >
              We couldn't find this order.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="bg-[#d90416] hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ color: "#111827" }}
    >
      <Navbar />

      <main className="px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="mb-8">

            <button
              onClick={() => navigate("/orders")}
              className="text-sm font-medium mb-4"
              style={{ color: "#d90416" }}
            >
              ← Back to Orders
            </button>

            <h1
              className="text-3xl font-bold"
              style={{ color: "#111827" }}
            >
              Order Details
            </h1>

            <p
              className="mt-2"
              style={{ color: "#6b7280" }}
            >
              Order ID:{" "}
              <span
                className="font-semibold"
                style={{ color: "#111827" }}
              >
                {order.orderId}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">

              {/* ORDER STATUS */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">

                <h2
                  className="text-xl font-semibold mb-5"
                  style={{ color: "#111827" }}
                >
                  Order Status
                </h2>

                <div className="flex items-center justify-between">

                  <div>
                    <p
                      className="text-sm"
                      style={{ color: "#6b7280" }}
                    >
                      Current Status
                    </p>

                    <p
                      className="text-lg font-semibold capitalize mt-1"
                      style={{ color: "#d90416" }}
                    >
                      {order.status?.replace(/_/g, " ")}
                    </p>
                  </div>

                  <div className="text-right">

                    <p
                      className="text-sm"
                      style={{ color: "#6b7280" }}
                    >
                      Order Date
                    </p>

                    <p
                      className="font-medium mt-1"
                      style={{ color: "#111827" }}
                    >
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </div>

                </div>
              </div>

              {/* PRODUCTS */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">

                <h2
                  className="text-xl font-semibold mb-5"
                  style={{ color: "#111827" }}
                >
                  Ordered Products
                </h2>

                <div className="space-y-5">

                  {order.items?.map((item) => (

                    <div
                      key={item._id}
                      className="flex gap-4 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                    >

                      <img
                        src={
                          item.product?.images?.[0]
                            ? `http://localhost:5000${item.product.images[0]}`
                            : item.image
                              ? `http://localhost:5000${item.image}`
                              : "/placeholder.jpg"
                        }
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      />

                      <div className="flex-1">

                        <h3
                          className="font-semibold"
                          style={{ color: "#111827" }}
                        >
                          {item.name}
                        </h3>

                        <p
                          className="text-sm mt-1"
                          style={{ color: "#6b7280" }}
                        >
                          Size: {item.size}
                        </p>

                        <p
                          className="text-sm"
                          style={{ color: "#6b7280" }}
                        >
                          Quantity: {item.quantity}
                        </p>

                        <p
                          className="text-sm"
                          style={{ color: "#6b7280" }}
                        >
                          Price: ₹{item.price}
                        </p>

                        {/* ITEM CANCELLED */}
                        {item.cancelled && (
                          <p
                            className="text-sm font-semibold mt-2"
                            style={{ color: "#d90416" }}
                          >
                            Product Cancelled
                          </p>
                        )}

                        {/* CANCEL PRODUCT */}
                        {order.status === "pending" &&
                          !item.cancelled && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCancelItem(
                                  item._id
                                )
                              }
                              disabled={
                                cancellingItem ===
                                item._id
                              }
                              className="mt-3 border border-red-500 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {cancellingItem ===
                              item._id
                                ? "Cancelling..."
                                : "Cancel Product"}
                            </button>
                          )}

                      </div>

                      <div
                        className="font-semibold"
                        style={{ color: "#111827" }}
                      >
                        ₹{item.total}
                      </div>

                    </div>

                  ))}

                </div>
              </div>

              {/* DELIVERY ADDRESS */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">

                <h2
                  className="text-xl font-semibold mb-5"
                  style={{ color: "#111827" }}
                >
                  Delivery Address
                </h2>

                <div className="space-y-1">

                  <p
                    className="font-semibold"
                    style={{ color: "#111827" }}
                  >
                    {order.address?.name}
                  </p>

                  <p style={{ color: "#4b5563" }}>
                    {order.address?.address}
                  </p>

                  <p style={{ color: "#4b5563" }}>
                    {order.address?.city},{" "}
                    {order.address?.state}
                  </p>

                  <p style={{ color: "#4b5563" }}>
                    PIN: {order.address?.pincode}
                  </p>

                  <p style={{ color: "#4b5563" }}>
                    Phone: {order.address?.phone}
                  </p>

                </div>
              </div>

            </div>

            {/* RIGHT */}
            <div className="lg:col-span-1">

              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">

                <h2
                  className="text-xl font-semibold mb-6"
                  style={{ color: "#111827" }}
                >
                  Order Summary
                </h2>

                <div className="space-y-4">

                  <div className="flex justify-between">
                    <span style={{ color: "#6b7280" }}>
                      Subtotal
                    </span>

                    <span style={{ color: "#111827" }}>
                      ₹{order.subtotal}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span style={{ color: "#6b7280" }}>
                      Discount
                    </span>

                    <span style={{ color: "#111827" }}>
                      ₹{order.discount}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span style={{ color: "#6b7280" }}>
                      Tax
                    </span>

                    <span style={{ color: "#111827" }}>
                      ₹{order.tax}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span style={{ color: "#6b7280" }}>
                      Shipping
                    </span>

                    <span style={{ color: "#111827" }}>
                      ₹{order.shipping}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between">

                    <span
                      className="font-semibold"
                      style={{ color: "#111827" }}
                    >
                      Total
                    </span>

                    <span
                      className="font-bold text-xl"
                      style={{ color: "#111827" }}
                    >
                      ₹{order.finalPrice}
                    </span>

                  </div>

                  <div className="border-t border-gray-200 pt-4">

                    <p
                      className="text-sm"
                      style={{ color: "#6b7280" }}
                    >
                      Payment Method
                    </p>

                    <p
                      className="font-semibold mt-1"
                      style={{ color: "#111827" }}
                    >
                      {order.paymentMethod === "COD"
                        ? "Cash on Delivery"
                        : order.paymentMethod}
                    </p>

                  </div>

                  <div>

                    <p
                      className="text-sm"
                      style={{ color: "#6b7280" }}
                    >
                      Payment Status
                    </p>

                    <p
                      className="font-semibold capitalize mt-1"
                      style={{ color: "#111827" }}
                    >
                      {order.paymentStatus}
                    </p>

                  </div>

                </div>

                {/* CANCEL ORDER */}
                {order.status === "pending" && (
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="w-full mt-4 border border-red-500 text-red-600 hover:bg-red-50 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelling
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                )}

                {/* DOWNLOAD INVOICE */}
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  className="
                    w-full
                    mt-4
                    border
                    border-[#d90416]
                    text-[#d90416]
                    hover:bg-red-50
                    py-3
                    rounded-lg
                    font-semibold
                    transition
                  "
                >
                  Download Invoice
                </button>

                {/* CONTINUE SHOPPING */}
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="w-full mt-4 bg-[#d90416] hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Continue Shopping
                </button>

              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default OrderDetails;