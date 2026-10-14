import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

import OrderStatus from "../components/OrderStatus";

import {
  getAdminOrderById,
  updateAdminOrderStatus,
} from "../services/adminOrderService";


function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status update states
  const [selectedStatus, setSelectedStatus] =
    useState("");

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  // ==================================================
  // IMAGE URL
  // ==================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http://localhost:5000")) {
      return image.replace("http://localhost:5000", "https://api.afsal.online");
    }

    // Already complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Example:
    // /uploads/image.jpg
    if (image.startsWith("/")) {
      return `https://api.afsal.online${image}`;
    }

    // Example:
    // 1759123456789-image.jpg
    return `https://api.afsal.online/uploads/${image}`;
  };


  // ==================================================
  // FORMAT ORDER STATUS
  // ==================================================

  const formatStatus = (status) => {
    if (!status) {
      return "";
    }

    const s = String(status).toLowerCase().trim();
    if (s === "pending") return "Pending";
    if (s === "processing") return "Processing";
    if (s === "shipped") return "Shipped";
    if (s === "delivered") return "Delivered";
    if (s === "cancelled" || s === "canceled") return "Cancelled";
    if (s === "out_for_delivery") return "Shipped";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
  };


  // ==================================================
  // FORMAT PAYMENT METHOD
  // ==================================================

  const formatPaymentMethod = (
    paymentMethod
  ) => {
    if (!paymentMethod) {
      return "";
    }

    if (paymentMethod === "COD") {
      return "Cash on Delivery";
    }

    if (paymentMethod === "UPI") {
      return "UPI";
    }

    if (paymentMethod === "CARD") {
      return "Credit / Debit Card";
    }

    return paymentMethod;
  };


  // ==================================================
  // FORMAT PAYMENT STATUS
  // ==================================================

  const formatPaymentStatus = (
    paymentStatus
  ) => {
    if (!paymentStatus) {
      return "";
    }

    return (
      paymentStatus.charAt(0).toUpperCase() +
      paymentStatus.slice(1)
    );
  };


  // ==================================================
  // FETCH REAL ORDER
  // ==================================================

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setOrder(null);
      return;
    }

    let isMounted = true;

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);

        const res = await getAdminOrderById(id);

        if (!isMounted) return;

        if (res && res.order) {
          setOrder(res.order);
          setSelectedStatus(res.order.status || "");
        } else {
          setOrder(null);
          toast.error(res?.message || "Order not found");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to load order:", error);
          setOrder(null);
          toast.error(error.message || "Failed to load order details");
        }
      } finally {
        if (isMounted) {
          setLoading(false); // ALWAYS unset loading
        }
      }
    };

    fetchOrderDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);


  // ==================================================
  // UPDATE ORDER STATUS
  // ==================================================

  const handleUpdateStatus = async () => {
    if (!order) return;

    const currentNorm = String(order.status || "").toLowerCase().trim();
    if (["delivered", "cancelled", "returned"].includes(currentNorm)) {
      toast.error("This order is closed and its status cannot be modified");
      return;
    }

    if (!selectedStatus) {
      toast.error("Please select an order status");
      return;
    }

    const selectedNorm = String(selectedStatus).toLowerCase().trim();

    // No change
    if (selectedNorm === currentNorm) {
      toast.error("Please select a different next status");
      return;
    }

    try {
      setUpdatingStatus(true);

      const targetId = order.orderId || order._id || id;
      const data = await updateAdminOrderStatus(
        targetId,
        selectedNorm
      );

      // Update order with backend response
      if (data?.order) {
        setOrder(data.order);
        setSelectedStatus(data.order.status || "");
      }

      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Failed to update order status:", error);

      toast.error(
        error.message || "Failed to update order status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };



  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">

        <p className="text-gray-500">
          Loading order details...
        </p>

      </div>
    );
  }


  // ==================================================
  // ORDER NOT FOUND
  // ==================================================

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">

        <p className="text-gray-500 mb-4">
          Order not found
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/orders")
          }
          className="px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
        >
          Back to Orders
        </button>

      </div>
    );
  }


  // ==================================================
  // UI
  // ==================================================

  const currentOrderStatus = String(order?.status || "").toLowerCase().trim();
  const isTerminalStatus = [
    "delivered",
    "cancelled",
    "returned",
  ].includes(currentOrderStatus);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/orders")
              }
              className="text-sm text-gray-500 hover:text-black mb-2"
            >
              ← Back to Orders
            </button>

            <h1 className="text-3xl font-bold text-black">
              Order Details
            </h1>

          </div>

          <OrderStatus
            status={formatStatus(order.status)}
          />

        </div>


        {/* Order Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Order Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-semibold text-black mb-5">
                Order Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Order ID */}
                <div>

                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <p className="font-semibold text-black mt-1">
                    #{order.orderId}
                  </p>

                </div>


                {/* Order Date */}
                <div>

                  <p className="text-sm text-gray-500">
                    Order Date
                  </p>

                  <p className="font-semibold text-black mt-1">

                    {new Date(
                      order.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}

                  </p>

                </div>


                {/* Payment Method */}
                <div>

                  <p className="text-sm text-gray-500">
                    Payment Method
                  </p>

                  <p className="font-semibold text-black mt-1">

                    {formatPaymentMethod(
                      order.paymentMethod
                    )}

                  </p>

                </div>


                {/* Payment Status */}
                <div>

                  <p className="text-sm text-gray-500">
                    Payment Status
                  </p>

                  <p className="font-semibold text-black mt-1">

                    {formatPaymentStatus(
                      order.paymentStatus
                    )}

                  </p>

                </div>

              </div>

            </div>


            {/* Products */}
            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-semibold text-black mb-5">
                Products
              </h2>

              <div className="space-y-5">

                {order.items.map(
                  (item, index) => (

                    <div
                      key={
                        item._id || index
                      }
                      className="flex gap-4 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                    >

                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">

                        {item.image ? (

                          <img
                            src={getImageUrl(
                              item.image
                            )}
                            alt={item.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />

                        ) : (

                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>

                        )}

                      </div>


                      {/* Product Details */}
                      <div className="flex-1">

                        <h3 className="font-semibold text-black">
                          {item.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Size: {item.size}
                        </p>

                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                        <p className="font-semibold text-black mt-2">

                          ₹
                          {item.price.toLocaleString(
                            "en-IN"
                          )}

                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>


              {/* Total */}
              <div className="border-t border-gray-200 mt-6 pt-5 flex justify-between">

                <span className="font-semibold text-black">
                  Total Amount
                </span>

                <span className="text-xl font-bold text-black">

                  ₹
                  {order.finalPrice.toLocaleString(
                    "en-IN"
                  )}

                </span>

              </div>

            </div>

          </div>


          {/* RIGHT */}
          <div className="space-y-6">

            {/* Customer */}
            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-semibold text-black mb-5">
                Customer
              </h2>

              <div className="space-y-3">

                {/* Name */}
                <div>

                  <p className="text-sm text-gray-500">
                    Name
                  </p>

                  <p className="font-medium text-black">
                    {order.user?.name ||
                      "Unknown User"}
                  </p>

                </div>


                {/* Email */}
                <div>

                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="font-medium text-black break-all">
                    {order.user?.email ||
                      "No email"}
                  </p>

                </div>


                {/* Phone */}
                <div>

                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-medium text-black">
                    {order.user?.phone ||
                      "No phone"}
                  </p>

                </div>

              </div>

            </div>


            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-semibold text-black mb-5">
                Shipping Address
              </h2>

              <div className="text-gray-600 leading-7">

                <p className="font-semibold text-black">
                  {order.address?.name}
                </p>

                <p>
                  {order.address?.address}
                </p>

                <p>
                  {order.address?.city},{" "}
                  {order.address?.state}
                </p>

                <p>
                  PIN: {order.address?.pincode}
                </p>

                <p>
                  {order.address?.phone}
                </p>

              </div>

            </div>


            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-semibold text-black mb-5">
                Order Status
              </h2>

              {/* Status Select */}
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value)
                }
                disabled={
                  isTerminalStatus || updatingStatus
                }
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#d90416] transition ${
                  isTerminalStatus
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black"
                }`}
              >
                {/* PENDING: Allowed -> Processing, Cancelled */}
                {currentOrderStatus === "pending" && (
                  <>
                    <option value="pending" disabled>
                      Pending (Current)
                    </option>
                    <option value="processing">
                      Processing
                    </option>
                    <option value="cancelled">
                      Cancelled
                    </option>
                  </>
                )}

                {/* PROCESSING: Allowed -> Shipped, Cancelled */}
                {currentOrderStatus === "processing" && (
                  <>
                    <option value="processing" disabled>
                      Processing (Current)
                    </option>
                    <option value="shipped">
                      Shipped
                    </option>
                    <option value="cancelled">
                      Cancelled
                    </option>
                  </>
                )}

                {/* SHIPPED: Allowed -> Delivered */}
                {currentOrderStatus === "shipped" && (
                  <>
                    <option value="shipped" disabled>
                      Shipped (Current)
                    </option>
                    <option value="delivered">
                      Delivered
                    </option>
                  </>
                )}

                {/* OUT FOR DELIVERY (legacy support) */}
                {currentOrderStatus === "out_for_delivery" && (
                  <>
                    <option value="out_for_delivery" disabled>
                      Out for Delivery (Current)
                    </option>
                    <option value="delivered">
                      Delivered
                    </option>
                  </>
                )}

                {/* DELIVERED (terminal) */}
                {currentOrderStatus === "delivered" && (
                  <option value="delivered">
                    Delivered (Completed)
                  </option>
                )}

                {/* CANCELLED (terminal) */}
                {currentOrderStatus === "cancelled" && (
                  <option value="cancelled">
                    Cancelled (Closed)
                  </option>
                )}

                {/* Other fallback */}
                {![
                  "pending",
                  "processing",
                  "shipped",
                  "out_for_delivery",
                  "delivered",
                  "cancelled",
                ].includes(currentOrderStatus) && (
                  <option value={order.status}>
                    {formatStatus(order.status)}
                  </option>
                )}
              </select>

              {/* Update Button */}
              <button
                type="button"
                onClick={
                  handleUpdateStatus
                }
                disabled={
                  isTerminalStatus ||
                  updatingStatus ||
                  selectedStatus === currentOrderStatus
                }
                className="
                  w-full
                  mt-4
                  py-3
                  bg-[#d90416]
                  text-white
                  rounded-lg
                  font-semibold
                  hover:bg-[#b90312]
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {updatingStatus ? (
                  <>
                    <span
                      className="
                        w-5
                        h-5
                        border-2
                        border-white/40
                        border-t-white
                        rounded-full
                        animate-spin
                        [animation-duration:1s]
                      "
                    />
                    <span>
                      Updating...
                    </span>
                  </>
                ) : isTerminalStatus ? (
                  currentOrderStatus === "delivered"
                    ? "Order Delivered (Locked)"
                    : "Order Cancelled (Locked)"
                ) : (
                  "Update Status"
                )}
              </button>

              {isTerminalStatus && (
                <p className="mt-3 text-xs text-center text-gray-500">
                  This order is {currentOrderStatus === "delivered" ? "delivered" : "cancelled"} and its status cannot be modified.
                </p>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default OrderDetails;