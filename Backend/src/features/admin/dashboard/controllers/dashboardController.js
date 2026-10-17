import Order from "../../../order/models/Order.js";
import User from "../../../auth/models/User.js";
import Product from "../../../product/models/Product.js";

// GET /api/admin/dashboard-stats
export const getDashboardStats = async (req, res) => {
  try {
    const timeRange = (req.query.timeRange || "monthly").toLowerCase();

    // 1. KPI Filter for valid paid / completed orders (exclude cancelled or returned)
    const validOrderFilter = {
      status: { $nin: ["cancelled", "returned"] },
      $or: [
        {
          paymentStatus: {
            $in: [
              "paid",
              "Completed",
              "completed",
              "Paid",
              "partially_refunded",
            ],
          },
        },
        { status: "delivered" },
      ],
    };

    // 2. Total Revenue (sum of final amounts on valid orders)
    const revenueAgg = await Order.aggregate([
      { $match: validOrderFilter },
      {
        $project: {
          amount: {
            $ifNull: [
              "$finalAmount",
              { $ifNull: ["$finalPrice", "$totalAmount"] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);
    const totalRevenue =
      revenueAgg.length > 0
        ? Math.round(revenueAgg[0].totalRevenue * 100) / 100
        : 0;

    // 3. Total Orders & Status Breakdown
    const totalOrders = await Order.countDocuments();

    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
      out_for_delivery: 0,
    };

    const statusAgg = await Order.aggregate([
      {
        $group: {
          _id: { $toLower: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    statusAgg.forEach((s) => {
      const key = s._id?.toLowerCase();
      if (key && statusCounts.hasOwnProperty(key)) {
        statusCounts[key] = s.count;
      }
    });

    const orderStatus = [
      { name: "Pending", count: statusCounts.pending },
      { name: "Processing", count: statusCounts.processing },
      { name: "Shipped", count: statusCounts.shipped + statusCounts.out_for_delivery },
      { name: "Delivered", count: statusCounts.delivered },
      { name: "Cancelled", count: statusCounts.cancelled },
    ];

    // 4. Products Count
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({
      isListed: true,
      isBlocked: false,
    });

    // 5. Users Count
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      isBlocked: { $ne: true },
    });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    // 6. Time-based Sales & Revenue Chart Data
    const now = new Date();
    let chartLabels = [];
    let chartData = [];

    if (timeRange === "weekly") {
      // Current week: Monday to Sunday
      const currentDay = now.getDay();
      const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      const weeklyAgg = await Order.aggregate([
        {
          $match: {
            ...validOrderFilter,
            createdAt: { $gte: monday, $lte: sunday },
          },
        },
        {
          $project: {
            dayOfWeek: { $dayOfWeek: "$createdAt" }, // 1=Sun, 2=Mon... 7=Sat
            amount: {
              $ifNull: [
                "$finalAmount",
                { $ifNull: ["$finalPrice", "$totalAmount"] },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$dayOfWeek",
            revenue: { $sum: "$amount" },
          },
        },
      ]);

      const dayMapping = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 1: 6 };
      const values = new Array(7).fill(0);
      weeklyAgg.forEach((item) => {
        const idx = dayMapping[item._id];
        if (idx !== undefined) {
          values[idx] = Math.round(item.revenue * 100) / 100;
        }
      });
      chartData = values;
    } else if (timeRange === "yearly") {
      // Last 5 years
      const currentYear = now.getFullYear();
      const startYear = currentYear - 4;
      const startOfPeriod = new Date(startYear, 0, 1, 0, 0, 0, 0);
      const endOfPeriod = new Date(currentYear, 11, 31, 23, 59, 59, 999);

      for (let y = startYear; y <= currentYear; y++) {
        chartLabels.push(String(y));
      }

      const yearlyAgg = await Order.aggregate([
        {
          $match: {
            ...validOrderFilter,
            createdAt: { $gte: startOfPeriod, $lte: endOfPeriod },
          },
        },
        {
          $project: {
            year: { $year: "$createdAt" },
            amount: {
              $ifNull: [
                "$finalAmount",
                { $ifNull: ["$finalPrice", "$totalAmount"] },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$year",
            revenue: { $sum: "$amount" },
          },
        },
      ]);

      const values = new Array(chartLabels.length).fill(0);
      const yearMap = {};
      chartLabels.forEach((yr, idx) => {
        yearMap[yr] = idx;
      });

      yearlyAgg.forEach((item) => {
        const idx = yearMap[String(item._id)];
        if (idx !== undefined) {
          values[idx] = Math.round(item.revenue * 100) / 100;
        }
      });
      chartData = values;
    } else {
      // Monthly (Current year: Jan to Dec)
      const currentYear = now.getFullYear();
      const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0, 0);
      const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

      chartLabels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const monthlyAgg = await Order.aggregate([
        {
          $match: {
            ...validOrderFilter,
            createdAt: { $gte: startOfYear, $lte: endOfYear },
          },
        },
        {
          $project: {
            month: { $month: "$createdAt" }, // 1 to 12
            amount: {
              $ifNull: [
                "$finalAmount",
                { $ifNull: ["$finalPrice", "$totalAmount"] },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$month",
            revenue: { $sum: "$amount" },
          },
        },
      ]);

      const values = new Array(12).fill(0);
      monthlyAgg.forEach((item) => {
        const monthIdx = item._id - 1;
        if (monthIdx >= 0 && monthIdx < 12) {
          values[monthIdx] = Math.round(item.revenue * 100) / 100;
        }
      });
      chartData = values;
    }

    const salesOverview = chartLabels.map((label, idx) => ({
      day: label,
      label,
      value: chartData[idx] || 0,
    }));

    const highestSales = Math.max(...chartData, 0);
    const totalPeriodRevenue = chartData.reduce((acc, curr) => acc + curr, 0);

    // 7. Top 10 Best-Selling Products
    const topProducts = await Order.aggregate([
      { $match: validOrderFilter },
      { $unwind: "$items" },
      {
        $match: {
          "items.cancelled": { $ne: true },
        },
      },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          image: { $first: "$items.image" },
          unitsSold: { $sum: "$items.quantity" },
          revenueGenerated: {
            $sum: {
              $ifNull: [
                "$items.total",
                { $multiply: ["$items.price", "$items.quantity"] },
              ],
            },
          },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDoc",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          unitsSold: 1,
          revenueGenerated: { $round: ["$revenueGenerated", 2] },
          image: {
            $ifNull: [
              "$image",
              { $arrayElemAt: ["$productDoc.images", 0] },
            ],
          },
          category: { $arrayElemAt: ["$productDoc.category", 0] },
        },
      },
    ]);

    // 8. Top Categories
    const topCategories = await Order.aggregate([
      { $match: validOrderFilter },
      { $unwind: "$items" },
      {
        $match: {
          "items.cancelled": { $ne: true },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: {
          path: "$productInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: { $ifNull: ["$productInfo.category", "General"] },
          unitsSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: {
              $ifNull: [
                "$items.total",
                { $multiply: ["$items.price", "$items.quantity"] },
              ],
            },
          },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          name: "$_id",
          category: "$_id",
          unitsSold: 1,
          totalRevenue: { $round: ["$totalRevenue", 2] },
          orderCount: 1,
        },
      },
    ]);

    // Calculate percentage share for categories
    const categoryRevenueSum = topCategories.reduce(
      (sum, c) => sum + (c.totalRevenue || 0),
      0
    );
    const enrichedTopCategories = topCategories.map((c) => ({
      ...c,
      share:
        categoryRevenueSum > 0
          ? Math.round((c.totalRevenue / categoryRevenueSum) * 100)
          : 0,
    }));

    // 9. Recent Orders (Latest 7)
    const rawRecentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(7)
      .lean();

    const recentOrders = rawRecentOrders.map((order) => ({
      id: order.orderId || String(order._id),
      _id: order._id,
      customer: order.user?.name || order.address?.name || "Customer",
      email: order.user?.email || "",
      amount: order.finalAmount || order.finalPrice || order.totalAmount || 0,
      paymentMethod: order.paymentMethod || "COD",
      paymentStatus: order.paymentStatus || "pending",
      status: order.status || "pending",
      date: order.createdAt,
    }));

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        revenue: totalRevenue,
        totalOrders,
        orders: totalOrders,
        totalProducts,
        products: totalProducts,
        activeProducts,
        totalUsers,
        users: totalUsers,
        activeUsers,
        blockedUsers,
      },
      orderStatus,
      statusBreakdown: statusCounts,
      salesChart: {
        timeRange,
        labels: chartLabels,
        data: chartData,
        highestSales,
        totalPeriodRevenue,
      },
      salesData: salesOverview,
      topProducts,
      topCategories: enrichedTopCategories,
      recentOrders,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard statistics",
    });
  }
};
