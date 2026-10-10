import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import ProfileLayout from "../../profile/components/ProfileLayout";

import OrderSearch from "../components/OrderSearch";
import OrderCard from "../components/OrderCard";
import OrderPagination from "../components/OrderPagination";

import { getOrders } from "../services/orderService";

import toast from "react-hot-toast";

function MyOrders() {
  const navigate = useNavigate();

  // ORDERS FROM BACKEND
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 3;

  // FETCH ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        const data = await getOrders();
        console.log("Latest API response:", data);

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        

        toast.error(
          error.message || "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // SEARCH
  const filteredOrders = useMemo(() => {
    if (!search.trim()) {
      return orders;
    }

    const value = search.toLowerCase();

    return orders.filter((order) =>
      order.orderId.toLowerCase().includes(value)
    );
  }, [orders, search]);

  // PAGINATION
  const totalPages = Math.ceil(
    filteredOrders.length / ordersPerPage
  );

  const startIndex =
    (currentPage - 1) * ordersPerPage;

  const paginatedOrders =
    filteredOrders.slice(
      startIndex,
      startIndex + ordersPerPage
    );

  // LOADING
  if (loading) {
    return (
      <ProfileLayout
        title="My"
        highlight="Orders"
        description="View and manage your orders."
      >
        <div className="min-h-[450px] flex items-center justify-center">
          <p className="text-gray-500">
            Loading orders...
          </p>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout
      title="My"
      highlight="Orders"
      description="View and manage your orders."
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          My <span className="text-[#d90416]">Orders</span>
        </h2>

        <p className="text-gray-500 mt-2">
          View and manage your orders.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <OrderSearch
          search={search}
          setSearch={setSearch}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Orders */}
      <div className="space-y-5">
        {paginatedOrders.length > 0 ? (
          paginatedOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={{
                ...order,
                id: order.orderId,
                date: order.createdAt,
                status: order.status,
                totalAmount: order.finalPrice,
                items: order.items?.map((item) => ({
                  ...item,
                  id: item._id,
                  canCancel:
                    order.status === "pending",
                  canReturn:
                    order.status === "delivered",
                })),
              }}
            />
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl py-20 text-center">
            <div className="text-6xl mb-5">
              📦
            </div>

            <h2 className="text-2xl font-bold">
              No Orders Found
            </h2>

            <p className="text-gray-500 mt-2">
              We couldn't find any orders matching
              your search.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <OrderPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </ProfileLayout>
  );
}

export default MyOrders;