import Order from "../../../order/models/Order.js";

// GET SALES REPORT
export const getSalesReport = async (
  startDate,
  endDate,
  period
) => {
  const filter = {};

  // ONLY SUCCESSFUL ORDERS
  filter.status = {
    $in: ["delivered"],
  };

  // PERIOD FILTER
  if (period) {
    const now = new Date();

    if (period === "daily") {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    if (period === "weekly") {
      const startOfWeek = new Date(now);

      const day = startOfWeek.getDay();

      const difference =
        day === 0 ? 6 : day - 1;

      startOfWeek.setDate(
        startOfWeek.getDate() - difference
      );

      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);

      endOfWeek.setDate(
        endOfWeek.getDate() + 6
      );

      endOfWeek.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: startOfWeek,
        $lte: endOfWeek,
      };
    }

    if (period === "yearly") {
      const startOfYear = new Date(
        now.getFullYear(),
        0,
        1
      );

      startOfYear.setHours(0, 0, 0, 0);

      const endOfYear = new Date(
        now.getFullYear(),
        11,
        31
      );

      endOfYear.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: startOfYear,
        $lte: endOfYear,
      };
    }
  }

  // CUSTOM DATE FILTER
  if (!period && (startDate || endDate)) {
    filter.createdAt = {};

    if (startDate) {
      filter.createdAt.$gte = new Date(
        `${startDate}T00:00:00.000Z`
      );
    }

    if (endDate) {
      filter.createdAt.$lte = new Date(
        `${endDate}T23:59:59.999Z`
      );
    }
  }

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  const totalOrders = orders.length;

  const totalSales = orders.reduce(
    (total, order) =>
      total + Number(order.finalPrice || 0),
    0
  );

  const totalDiscount = orders.reduce(
    (total, order) =>
      total + Number(order.discount || 0),
    0
  );

  const totalTax = orders.reduce(
    (total, order) =>
      total + Number(order.tax || 0),
    0
  );

  const totalShipping = orders.reduce(
    (total, order) =>
      total + Number(order.shipping || 0),
    0
  );

  const averageOrderValue =
    totalOrders > 0
      ? totalSales / totalOrders
      : 0;

  return {
    summary: {
      totalOrders,
      totalSales,
      totalDiscount,
      totalTax,
      totalShipping,
      averageOrderValue,
    },

    orders,
  };
};