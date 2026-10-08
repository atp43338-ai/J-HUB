import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

// import AdminMenu from "../../../components/AdminMenu";
import OrderSearchSort from "../components/OrderSearchSort";
import OrderFilters from "../components/OrderFilters";
import OrderTable from "../components/OrderTable";
import OrderPagination from "../components/OrderPagination";

function OrderManagement() {
  const navigate = useNavigate();

  // Real order data
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 5;

  // Fetch real orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("adminToken");

        if (!token) {
          toast.error("Admin login required");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/admin/orders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch orders"
          );
        }

        // Convert backend order data
        // into the format used by existing components
        const formattedOrders = (data.orders || []).map(
          (order) => ({
            id: order.orderId,

            date: order.createdAt,

            user: {
              name: order.user?.name || "Unknown User",
              email: order.user?.email || "No email",
            },

            amount: order.finalPrice,

            status:
              order.status === "out_for_delivery"
                ? "Out for Delivery"
                : order.status.charAt(0).toUpperCase() +
                  order.status.slice(1),
          })
        );

        setOrders(formattedOrders);
      } catch (error) {
        console.error(
          "Failed to fetch admin orders:",
          error
        );

        toast.error(
          error.message || "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Clear search, sort and filter
  const clearFilters = () => {
    setSearch("");
    setSort("");
    setStatus("");
    setCurrentPage(1);
  };

  // Search + filter + sort
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search
    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter(
        (order) =>
          order.id
            .toLowerCase()
            .includes(searchValue) ||
          order.user.name
            .toLowerCase()
            .includes(searchValue) ||
          order.user.email
            .toLowerCase()
            .includes(searchValue)
      );
    }

    // Status filter
    if (status) {
      result = result.filter(
        (order) => order.status === status
      );
    }

    // Sort
    if (sort === "dateDesc") {
      result.sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );
    }

    if (sort === "dateAsc") {
      result.sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      );
    }

    if (sort === "amountHigh") {
      result.sort(
        (a, b) => b.amount - a.amount
      );
    }

    if (sort === "amountLow") {
      result.sort(
        (a, b) => a.amount - b.amount
      );
    }

    return result;
  }, [orders, search, status, sort]);

  // Pagination
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* <AdminMenu /> */}

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">
            <span className="text-black">
              Order{" "}
            </span>

            <span className="text-[#d90416]">
              Management
            </span>
          </h1>

          <p className="mt-1 text-gray-500">
            Manage customer orders and order status
          </p>

        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <h2 className="text-2xl font-bold !text-black mt-2">
              {orders.length}
            </h2>

          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Pending
            </p>

            <h2 className="text-2xl font-bold !text-yellow-600 mt-2">
              {
                orders.filter(
                  (order) =>
                    order.status === "Pending"
                ).length
              }
            </h2>

          </div>

          {/* Shipped */}
          <div className="bg-white rounded-xl shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Shipped
            </p>

            <h2 className="text-2xl font-bold !text-blue-600 mt-2">
              {
                orders.filter(
                  (order) =>
                    order.status === "Shipped"
                ).length
              }
            </h2>

          </div>

          {/* Delivered */}
          <div className="bg-white rounded-xl shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <h2 className="text-2xl font-bold !text-green-600 mt-2">
              {
                orders.filter(
                  (order) =>
                    order.status === "Delivered"
                ).length
              }
            </h2>

          </div>

        </div>

        {/* Main Order Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

            <div>

              <h2 className="text-xl font-semibold !text-black">
                Orders
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filteredOrders.length} orders found
              </p>

            </div>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="py-16 text-center">

              <p className="text-gray-500">
                Loading orders...
              </p>

            </div>
          ) : (
            <>
              {/* Search + Sort */}
              <OrderSearchSort
                search={search}
                setSearch={setSearch}
                sort={sort}
                setSort={setSort}
                setCurrentPage={setCurrentPage}
              />

              {/* Filters */}
              <OrderFilters
                status={status}
                setStatus={setStatus}
                setCurrentPage={setCurrentPage}
                clearFilters={clearFilters}
              />

              {/* No Orders */}
              {paginatedOrders.length === 0 ? (
                <div className="py-16 text-center">

                  <p className="text-gray-500">
                    No orders found
                  </p>

                </div>
              ) : (
                <>
                  {/* Table */}
                  <OrderTable
                    orders={paginatedOrders}
                    onViewDetails={(id) =>
                      navigate(
                        `/admin/orders/${id}`
                      )
                    }
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <OrderPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={
                        setCurrentPage
                      }
                    />
                  )}
                </>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}

export default OrderManagement;