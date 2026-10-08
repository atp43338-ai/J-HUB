import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
  getSalesReport,
  downloadSalesReportPDF,
  downloadSalesReportExcel,
} from "../services/adminSalesService";


const SalesReport = () => {
  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [period, setPeriod] = useState("");


  const [report, setReport] = useState({
    summary: {
      totalOrders: 0,
      totalSales: 0,
      totalDiscount: 0,
      totalTax: 0,
      totalShipping: 0,
      averageOrderValue: 0,
    },

    orders: [],
  });


  const [loading, setLoading] = useState(false);

  const [pdfLoading, setPdfLoading] =
    useState(false);

  const [excelLoading, setExcelLoading] =
    useState(false);


  // FETCH SALES REPORT
  const fetchSalesReport = async (
    selectedStartDate = startDate,
    selectedEndDate = endDate,
    selectedPeriod = period
  ) => {
    try {
      setLoading(true);

      const data = await getSalesReport(
        selectedStartDate,
        selectedEndDate,
        selectedPeriod
      );

      setReport(data.report);
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to fetch sales report"
      );
    } finally {
      setLoading(false);
    }
  };


  // INITIAL LOAD
  useEffect(() => {
    fetchSalesReport("", "", "");
  }, []);


  // DAILY / WEEKLY / YEARLY
  const handlePeriodChange = (
    selectedPeriod
  ) => {
    setPeriod(selectedPeriod);

    // Clear custom date filter
    setStartDate("");
    setEndDate("");

    fetchSalesReport(
      "",
      "",
      selectedPeriod
    );
  };


  // CUSTOM DATE FILTER
  const handleFilter = () => {
    if (
      startDate &&
      endDate &&
      startDate > endDate
    ) {
      toast.error(
        "Start date cannot be after end date"
      );

      return;
    }

    // Clear selected period
    setPeriod("");

    fetchSalesReport(
      startDate,
      endDate,
      ""
    );
  };


  // CLEAR FILTER
  const handleClear = () => {
    setStartDate("");

    setEndDate("");

    setPeriod("");

    fetchSalesReport(
      "",
      "",
      ""
    );
  };


  // DOWNLOAD PDF
  const handleDownloadPDF = async () => {
    try {
      setPdfLoading(true);

      await downloadSalesReportPDF(
        startDate,
        endDate,
        period
      );

      toast.success(
        "Sales report PDF downloaded successfully"
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to download PDF"
      );
    } finally {
      setPdfLoading(false);
    }
  };


  // DOWNLOAD EXCEL
  const handleDownloadExcel = async () => {
    try {
      setExcelLoading(true);

      await downloadSalesReportExcel(
        startDate,
        endDate,
        period
      );

      toast.success(
        "Sales report Excel downloaded successfully"
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to download Excel"
      );
    } finally {
      setExcelLoading(false);
    }
  };


  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // FORMAT PRICE
  const formatPrice = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-2xl font-bold text-gray-900">
          Sales Report
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View your sales performance and completed orders.
        </p>

      </div>


      {/* REPORT PERIOD */}
      <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

        <p className="mb-3 text-sm font-medium text-gray-700">
          Report Period
        </p>

        <div className="flex flex-wrap gap-3">

          {/* DAILY */}
          <button
            type="button"
            onClick={() =>
              handlePeriodChange("daily")
            }
            disabled={loading}
            className={`
              rounded-lg
              px-5
              py-2.5
              text-sm
              font-medium
              transition
              disabled:opacity-50
              ${
                period === "daily"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            Daily
          </button>


          {/* WEEKLY */}
          <button
            type="button"
            onClick={() =>
              handlePeriodChange("weekly")
            }
            disabled={loading}
            className={`
              rounded-lg
              px-5
              py-2.5
              text-sm
              font-medium
              transition
              disabled:opacity-50
              ${
                period === "weekly"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            Weekly
          </button>


          {/* YEARLY */}
          <button
            type="button"
            onClick={() =>
              handlePeriodChange("yearly")
            }
            disabled={loading}
            className={`
              rounded-lg
              px-5
              py-2.5
              text-sm
              font-medium
              transition
              disabled:opacity-50
              ${
                period === "yearly"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            Yearly
          </button>

        </div>

      </div>


      {/* DATE FILTER */}
      <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

        <div className="flex flex-wrap items-end gap-4">

          {/* START DATE */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-500"
            />

          </div>


          {/* END DATE */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-500"
            />

          </div>


          {/* FILTER */}
          <button
            type="button"
            onClick={handleFilter}
            disabled={loading}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading
              ? "Loading..."
              : "Filter"}
          </button>


          {/* CLEAR */}
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Clear
          </button>

        </div>

      </div>


      {/* DOWNLOAD BUTTONS */}
      <div className="mb-6 flex flex-wrap gap-3">

        {/* PDF */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={
            pdfLoading ||
            excelLoading ||
            loading
          }
          className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pdfLoading
            ? "Downloading PDF..."
            : "Download PDF"}
        </button>


        {/* EXCEL */}
        <button
          type="button"
          onClick={handleDownloadExcel}
          disabled={
            pdfLoading ||
            excelLoading ||
            loading
          }
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {excelLoading
            ? "Downloading Excel..."
            : "Download Excel"}
        </button>

      </div>


      {/* SUMMARY CARDS */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        {/* TOTAL ORDERS */}
        <div className="rounded-xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {report.summary.totalOrders}
          </h2>

        </div>


        {/* TOTAL SALES */}
        <div className="rounded-xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Sales
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {formatPrice(
              report.summary.totalSales
            )}
          </h2>

        </div>


        {/* DISCOUNT */}
        <div className="rounded-xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Discount
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {formatPrice(
              report.summary.totalDiscount
            )}
          </h2>

        </div>


        {/* TAX */}
        <div className="rounded-xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Tax
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {formatPrice(
              report.summary.totalTax
            )}
          </h2>

        </div>


        {/* SHIPPING */}
        <div className="rounded-xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Shipping
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {formatPrice(
              report.summary.totalShipping
            )}
          </h2>

        </div>


        {/* AVERAGE ORDER */}
        <div className="rounded-xl bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Average Order
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {formatPrice(
              report.summary.averageOrderValue
            )}
          </h2>

        </div>

      </div>


      {/* ORDERS TABLE */}
      <div className="rounded-xl bg-white shadow-sm">

        <div className="border-b border-gray-200 p-5">

          <h2 className="text-lg font-semibold text-gray-900">
            Sales Details
          </h2>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead>

              <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">

                <th className="px-5 py-4">
                  Order ID
                </th>

                <th className="px-5 py-4">
                  Date
                </th>

                <th className="px-5 py-4">
                  Payment
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Discount
                </th>

                <th className="px-5 py-4">
                  Tax
                </th>

                <th className="px-5 py-4">
                  Shipping
                </th>

                <th className="px-5 py-4">
                  Total
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Loading sales report...
                  </td>

                </tr>

              ) : report.orders.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No sales found.
                  </td>

                </tr>

              ) : (

                report.orders.map(
                  (order) => (

                    <tr
                      key={order._id}
                      className="border-b border-gray-100 text-sm hover:bg-gray-50"
                    >

                      <td className="px-5 py-4 font-medium text-gray-900">
                        {order.orderId ||
                          order._id}
                      </td>


                      <td className="px-5 py-4 text-gray-600">
                        {formatDate(
                          order.createdAt
                        )}
                      </td>


                      <td className="px-5 py-4 text-gray-600">
                        {order.paymentMethod ||
                          "-"}
                      </td>


                      <td className="px-5 py-4">

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          {order.status}
                        </span>

                      </td>


                      <td className="px-5 py-4 text-gray-600">
                        {formatPrice(
                          order.discount
                        )}
                      </td>


                      <td className="px-5 py-4 text-gray-600">
                        {formatPrice(
                          order.tax
                        )}
                      </td>


                      <td className="px-5 py-4 text-gray-600">
                        {formatPrice(
                          order.shipping
                        )}
                      </td>


                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {formatPrice(
                          order.finalPrice
                        )}
                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};


export default SalesReport;