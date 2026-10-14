import { api } from "../../../../services/api";

export const getDashboardStats = async (timeRange = "monthly") => {
  const token = localStorage.getItem("adminToken");

  return api(`/admin/dashboard-stats?timeRange=${encodeURIComponent(timeRange)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
