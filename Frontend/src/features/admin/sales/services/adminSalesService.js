import { api, API_URL } from "../../../../services/api";

// GET SALES REPORT
export const getSalesReport = async (
  startDate = "",
  endDate = "",
  period = ""
) => {
  const adminToken = localStorage.getItem("adminToken");

  const params = new URLSearchParams();

  if (startDate) {
    params.append("startDate", startDate);
  }

  if (endDate) {
    params.append("endDate", endDate);
  }

  if (period) {
    params.append("period", period);
  }

  const url = params.toString()
    ? `/admin/sales/report?${params.toString()}`
    : `/admin/sales/report`;

  return api(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
};


// DOWNLOAD SALES REPORT
const downloadSalesReport = async (
  type,
  startDate = "",
  endDate = "",
  period = ""
) => {
  const adminToken =
    localStorage.getItem("adminToken");

  const params = new URLSearchParams();

  if (startDate) {
    params.append("startDate", startDate);
  }

  if (endDate) {
    params.append("endDate", endDate);
  }

  if (period) {
    params.append("period", period);
  }

  const url =
    params.toString()
      ? `${API_URL}/admin/sales/report/${type}?${params.toString()}`
      : `${API_URL}/admin/sales/report/${type}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  if (!response.ok) {
    let message =
      "Failed to download sales report";

    try {
      const data =
        await response.json();

      message =
        data.message || message;
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(message);
  }

  const blob =
    await response.blob();

  const downloadUrl =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = downloadUrl;

  link.download =
    type === "pdf"
      ? "sales-report.pdf"
      : "sales-report.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(
    downloadUrl
  );
};


// DOWNLOAD PDF
export const downloadSalesReportPDF =
  async (
    startDate = "",
    endDate = "",
    period = ""
  ) => {
    return downloadSalesReport(
      "pdf",
      startDate,
      endDate,
      period
    );
  };


// DOWNLOAD EXCEL
export const downloadSalesReportExcel =
  async (
    startDate = "",
    endDate = "",
    period = ""
  ) => {
    return downloadSalesReport(
      "excel",
      startDate,
      endDate,
      period
    );
  };