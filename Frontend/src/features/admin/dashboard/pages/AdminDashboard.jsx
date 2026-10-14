import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { getDashboardStats } from "../services/adminDashboardService";

function AdminDashboard() {
  const navigate = useNavigate();

  // Time range filter for chart: "weekly" | "monthly" | "yearly"
  const [timeRange, setTimeRange] = useState("monthly");
  const [distributionTab, setDistributionTab] = useState("status"); // "status" | "category"
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  // Dashboard data states
  const [stats, setStats] = useState({
    users: 0,
    activeUsers: 0,
    blockedUsers: 0,
    products: 0,
    activeProducts: 0,
    orders: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [chartSummary, setChartSummary] = useState({
    highestSales: 0,
    totalPeriodRevenue: 0,
  });
  const [orderStatus, setOrderStatus] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);

  // Fetch all stats (or update chart on timeRange change)
  const fetchStats = async (selectedRange = timeRange, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setChartLoading(true);

      const data = await getDashboardStats(selectedRange);

      if (data && data.success) {
        setStats(data.stats || {});
        setRecentOrders(data.recentOrders || []);
        setSalesData(data.salesData || []);
        setChartSummary({
          highestSales: data.salesChart?.highestSales || 0,
          totalPeriodRevenue: data.salesChart?.totalPeriodRevenue || 0,
        });
        setOrderStatus(data.orderStatus || []);
        setTopProducts(data.topProducts || []);
        setTopCategories(data.topCategories || []);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(timeRange, true);
  }, []);

  const handleTimeRangeChange = (newRange) => {
    if (newRange === timeRange) return;
    setTimeRange(newRange);
    fetchStats(newRange, false);
  };

  // Helper for Status Badge Styling
  const getStatusStyle = (status) => {
    const s = (status || "").toLowerCase().replace(/[\s_-]+/g, "");
    if (s === "delivered") {
      return "bg-green-100 text-green-800 border border-green-200";
    }
    if (s === "shipped") {
      return "bg-purple-100 text-purple-800 border border-purple-200";
    }
    if (s === "processing") {
      return "bg-blue-100 text-blue-800 border border-blue-200";
    }
    if (s === "cancelled" || s === "canceled") {
      return "bg-red-100 text-red-800 border border-red-200";
    }
    if (s === "returned") {
      return "bg-orange-100 text-orange-800 border border-orange-200";
    }
    return "bg-yellow-100 text-yellow-800 border border-yellow-200";
  };

  // Helper for Product Image URLs
  const getProductImage = (img) => {
    if (!img) return null;
    if (typeof img !== "string") return null;
    if (img.startsWith("http")) {
      return img.replace("http://localhost:5000", "https://api.afsal.online");
    }
    return `https://api.afsal.online${img.startsWith("/") ? "" : "/"}${img}`;
  };

  // Max value in salesData for proportional bar heights
  const maxSales = Math.max(
    ...salesData.map((item) => Number(item.value) || 0),
    1
  );

  // Status color map for Donut Chart & Legend
  const statusColors = {
    Delivered: { bg: "#10b981", class: "bg-emerald-500" },
    Shipped: { bg: "#8b5cf6", class: "bg-purple-500" },
    Processing: { bg: "#3b82f6", class: "bg-blue-500" },
    Pending: { bg: "#f59e0b", class: "bg-amber-500" },
    Cancelled: { bg: "#ef4444", class: "bg-red-500" },
    "Out for Delivery": { bg: "#8b5cf6", class: "bg-purple-500" },
  };

  // Category color palette for Donut Chart
  const categoryPalette = [
    { bg: "#d90416", class: "bg-[#d90416]" },
    { bg: "#2563eb", class: "bg-blue-600" },
    { bg: "#059669", class: "bg-emerald-600" },
    { bg: "#d97706", class: "bg-amber-600" },
    { bg: "#7c3aed", class: "bg-purple-600" },
  ];

  // Calculate slices for SVG Donut (circumference = 100 on r = 15.915494309)
  const totalStatusOrders = orderStatus.reduce((acc, curr) => acc + (curr.count || 0), 0);
  let statusAccumulator = 0;
  const statusSlices = orderStatus.map((item) => {
    const count = Number(item.count) || 0;
    const percent = totalStatusOrders > 0 ? (count / totalStatusOrders) * 100 : 0;
    const offset = 100 - statusAccumulator + 25;
    statusAccumulator += percent;
    return {
      ...item,
      percent: Math.round(percent),
      dashArray: `${percent} ${100 - percent}`,
      dashOffset: offset,
      color: statusColors[item.name]?.bg || "#9ca3af",
      colorClass: statusColors[item.name]?.class || "bg-gray-400",
    };
  });

  const totalCatRevenue = topCategories.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0);
  let catAccumulator = 0;
  const categorySlices = topCategories.map((cat, idx) => {
    const rev = Number(cat.totalRevenue) || 0;
    const percent = totalCatRevenue > 0 ? (rev / totalCatRevenue) * 100 : 0;
    const offset = 100 - catAccumulator + 25;
    catAccumulator += percent;
    const colorObj = categoryPalette[idx % categoryPalette.length];
    return {
      ...cat,
      percent: Math.round(percent),
      dashArray: `${percent} ${100 - percent}`,
      dashOffset: offset,
      color: colorObj.bg,
      colorClass: colorObj.class,
    };
  });

  return (
    <div className="min-h-screen bg-[#fffafa] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* =========================================================================
          DASHBOARD HEADER
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Admin <span className="text-[#d90416]">Dashboard</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Real-time analytics, revenue tracking, and order distribution
          </p>
        </div>

        {/* Refresh Action */}
        <button
          type="button"
          onClick={() => fetchStats(timeRange, false)}
          disabled={loading || chartLoading}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-3.5 h-3.5 text-[#d90416] ${chartLoading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Refresh Live Data</span>
        </button>
      </div>

      {/* =========================================================================
          ROW 1: TOP KPI METRIC CARDS (4 Cols Desktop, 2 Tablet, 1 Mobile)
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* TOTAL REVENUE */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Total Revenue
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1.5 truncate">
                {loading ? (
                  <div className="h-8 w-28 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  `₹${Number(stats.revenue || 0).toLocaleString("en-IN")}`
                )}
              </h2>
              <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                <span>✓</span> Completed & paid orders
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-50 text-[#d90416] flex items-center justify-center text-lg font-bold shrink-0">
              ₹
            </div>
          </div>
        </div>

        {/* TOTAL ORDERS */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Total Orders
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1.5 truncate">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  stats.orders || 0
                )}
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-2">
                All-time customer purchases
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-50 text-[#d90416] flex items-center justify-center text-lg shrink-0">
              📦
            </div>
          </div>
        </div>

        {/* TOTAL PRODUCTS */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Total Products
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1.5 truncate">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  stats.products || 0
                )}
              </h2>
              <p className="text-xs text-emerald-600 font-medium mt-2 truncate">
                {stats.activeProducts || stats.products || 0} active in catalog
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-50 text-[#d90416] flex items-center justify-center text-lg shrink-0">
              👕
            </div>
          </div>
        </div>

        {/* TOTAL USERS */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Total Customers
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1.5 truncate">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  stats.users || 0
                )}
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-2 truncate">
                {stats.activeUsers || stats.users || 0} active ({stats.blockedUsers || 0} blocked)
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-50 text-[#d90416] flex items-center justify-center text-lg shrink-0">
              👥
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: ANALYTICS & PERFORMANCE (8 cols Left / 4 cols Right on lg/xl)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT CARD: SALES & REVENUE PERFORMANCE CHART (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div>
            {/* Header + Period Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Sales & Revenue Performance
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Aggregate revenue trends across completed transactions
                </p>
              </div>

              {/* Period Filter Tabs */}
              <div className="inline-flex bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-semibold self-start sm:self-auto">
                {["weekly", "monthly", "yearly"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleTimeRangeChange(tab)}
                    className={`px-3.5 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                      timeRange === tab
                        ? "bg-[#d90416] text-white shadow-xs"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Bar Chart Container */}
            <div className="min-h-[250px] sm:min-h-[280px] flex items-end justify-between gap-2 sm:gap-3 border-b border-gray-100 pt-6 px-1 relative">
              {chartLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-xs z-10 rounded-xl">
                  <div className="w-7 h-7 border-2 border-[#d90416] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {salesData.length === 0 ? (
                <div className="w-full h-full min-h-[240px] flex items-center justify-center text-gray-400 text-xs">
                  No sales data recorded for this time range.
                </div>
              ) : (
                salesData.map((item, index) => {
                  const val = Number(item.value) || 0;
                  const heightPercent = maxSales > 0 ? (val / maxSales) * 100 : 0;
                  const renderedHeight = val > 0 ? Math.max(heightPercent, 7) : 3;

                  return (
                    <div
                      key={item.label || item.day || index}
                      className="flex flex-col items-center justify-end h-full flex-1 gap-2 group relative"
                    >
                      {/* Tooltip on Hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-gray-900 text-white text-[11px] font-medium px-2 py-1 rounded-md shadow-md pointer-events-none whitespace-nowrap z-20">
                        ₹{val.toLocaleString("en-IN")}
                      </div>

                      {/* Bar */}
                      <div className="flex items-end h-full w-full justify-center">
                        <div
                          className={`w-full max-w-[38px] rounded-t-md transition-all duration-300 ${
                            val > 0
                              ? "bg-[#d90416] hover:bg-[#b90312]"
                              : "bg-gray-100"
                          }`}
                          style={{
                            height: `${renderedHeight}%`,
                          }}
                        />
                      </div>

                      {/* X-axis Label */}
                      <span className="text-[11px] font-medium text-gray-500 truncate max-w-[44px] text-center mb-1">
                        {item.label || item.day}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Bottom Stat Row Aligned Cleanly */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <div>
              <p className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                Peak Period Sales
              </p>
              <p className="text-sm sm:text-base font-bold text-gray-900 mt-0.5">
                ₹{Number(chartSummary.highestSales || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                Total Period Revenue
              </p>
              <p className="text-sm sm:text-base font-bold text-[#d90416] mt-0.5">
                ₹{Number(chartSummary.totalPeriodRevenue || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: CATEGORY & STATUS DISTRIBUTION (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div>
            {/* Header + Switcher */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Store Distribution
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Volume breakdown
                </p>
              </div>

              {/* Toggle Tab */}
              <div className="inline-flex bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setDistributionTab("status")}
                  className={`px-2 py-1 rounded-md transition cursor-pointer ${
                    distributionTab === "status"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Status
                </button>
                <button
                  type="button"
                  onClick={() => setDistributionTab("category")}
                  className={`px-2 py-1 rounded-md transition cursor-pointer ${
                    distributionTab === "category"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Categories
                </button>
              </div>
            </div>

            {/* Circular Donut Visual & Highlights */}
            {distributionTab === "status" ? (
              <div>
                {/* SVG Donut Center */}
                <div className="flex items-center justify-center my-2">
                  <div className="relative w-36 h-36">
                    <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                      {/* Background Ring */}
                      <circle
                        cx="21"
                        cy="21"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="#f3f4f6"
                        strokeWidth="5"
                      />
                      {/* Slices */}
                      {totalStatusOrders > 0 &&
                        statusSlices.map((slice, i) => (
                          <circle
                            key={slice.name || i}
                            cx="21"
                            cy="21"
                            r="15.91549430918954"
                            fill="transparent"
                            stroke={slice.color}
                            strokeWidth="5"
                            strokeDasharray={slice.dashArray}
                            strokeDashoffset={slice.dashOffset}
                            className="transition-all duration-500"
                          />
                        ))}
                    </svg>

                    {/* Donut Center Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-extrabold text-gray-900 leading-none">
                        {totalStatusOrders}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">
                        Orders
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ranked List */}
                <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                  {statusSlices.slice(0, 4).map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.colorClass}`}></span>
                        <span className="text-gray-700 font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="text-gray-900">{item.count}</span>
                        <span className="text-gray-400 text-[11px] w-8 text-right">
                          ({item.percent}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {/* SVG Donut for Categories */}
                <div className="flex items-center justify-center my-2">
                  <div className="relative w-36 h-36">
                    <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                      <circle
                        cx="21"
                        cy="21"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="#f3f4f6"
                        strokeWidth="5"
                      />
                      {totalCatRevenue > 0 &&
                        categorySlices.map((slice, i) => (
                          <circle
                            key={slice.category || i}
                            cx="21"
                            cy="21"
                            r="15.91549430918954"
                            fill="transparent"
                            stroke={slice.color}
                            strokeWidth="5"
                            strokeDasharray={slice.dashArray}
                            strokeDashoffset={slice.dashOffset}
                            className="transition-all duration-500"
                          />
                        ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-lg font-extrabold text-gray-900 leading-none">
                        {topCategories.length}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">
                        Categories
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ranked Category List */}
                <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                  {topCategories.length === 0 ? (
                    <p className="text-center text-gray-400 text-xs py-2">No category data</p>
                  ) : (
                    categorySlices.slice(0, 4).map((cat) => (
                      <div key={cat.category} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-2 h-2 rounded-full ${cat.colorClass} shrink-0`}></span>
                          <span className="text-gray-700 font-medium truncate max-w-[120px]">
                            {cat.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-semibold shrink-0">
                          <span className="text-gray-900">
                            ₹{Number(cat.totalRevenue || 0).toLocaleString("en-IN")}
                          </span>
                          <span className="text-gray-400 text-[11px] w-8 text-right">
                            ({cat.percent}%)
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 text-right border-t border-gray-50">
            <span className="text-[10px] text-gray-400">
              Live database distribution
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 3: DATA & ACTIVITY (7 cols Recent Orders / 5 cols Best-Sellers)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CARD 1: RECENT ORDERS TABLE (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Orders
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Latest customer purchases
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/orders")}
                className="text-xs text-[#d90416] font-semibold hover:underline cursor-pointer"
              >
                View All Orders →
              </button>
            </div>

            {/* Table */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="h-10 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                No orders recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      <th className="pb-3 pr-2">Order ID</th>
                      <th className="pb-3 px-2">Customer</th>
                      <th className="pb-3 px-2">Amount</th>
                      <th className="pb-3 px-2">Payment</th>
                      <th className="pb-3 pl-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.slice(0, 5).map((order) => (
                      <tr
                        key={order.id || order._id}
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="hover:bg-red-50/20 transition cursor-pointer"
                      >
                        <td className="py-3 pr-2 font-semibold text-gray-900 whitespace-nowrap">
                          {order.id}
                        </td>
                        <td className="py-3 px-2">
                          <p className="font-medium text-gray-800 truncate max-w-[130px]">
                            {order.customer}
                          </p>
                        </td>
                        <td className="py-3 px-2 font-bold text-gray-900 whitespace-nowrap">
                          ₹{Number(order.amount || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-2 whitespace-nowrap">
                          <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-medium">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 pl-2 text-right whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status?.replace(/_/g, " ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
            <span>Displaying up to 5 latest orders</span>
            <button
              type="button"
              onClick={() => navigate("/admin/orders")}
              className="text-[#d90416] hover:underline font-medium cursor-pointer"
            >
              Manage all →
            </button>
          </div>
        </div>

        {/* CARD 2: TOP BEST-SELLING PRODUCTS (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Top Best-Selling Products
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ranked by units sold
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                Top Sellers
              </span>
            </div>

            {/* Itemized List */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                No product sales recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {topProducts.slice(0, 5).map((prod, idx) => {
                  const imgSrc = getProductImage(prod.image);
                  return (
                    <div
                      key={prod._id || idx}
                      className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Rank Pill */}
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold shrink-0 ${
                            idx === 0
                              ? "bg-amber-100 text-amber-800"
                              : idx === 1
                              ? "bg-gray-200 text-gray-800"
                              : idx === 2
                              ? "bg-amber-700/10 text-amber-900"
                              : "text-gray-400 bg-gray-50"
                          }`}
                        >
                          {idx + 1}
                        </span>

                        {/* Thumbnail */}
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={prod.name}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                            className="w-10 h-10 rounded-lg object-contain bg-gray-50 border border-gray-100 p-0.5 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-[10px] shrink-0 font-medium">
                            N/A
                          </div>
                        )}

                        {/* Name & Category */}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate max-w-[140px] sm:max-w-[170px]" title={prod.name}>
                            {prod.name}
                          </p>
                          <span className="text-[10px] text-gray-400 block truncate">
                            {prod.category || "Catalog Item"}
                          </span>
                        </div>
                      </div>

                      {/* Units & Revenue */}
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-gray-900">
                          ₹{Number(prod.revenueGenerated || 0).toLocaleString("en-IN")}
                        </p>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {prod.unitsSold} sold
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-50 text-right">
            <span className="text-xs text-gray-400">
              Aggregated from completed orders
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;