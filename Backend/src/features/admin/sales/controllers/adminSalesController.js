import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

import {
  getSalesReport,
} from "../services/adminSalesService.js";


// GET SALES REPORT
export const getSalesReportController = async (
  req,
  res
) => {
  try {
    const {
      startDate,
      endDate,
      period,
    } = req.query;

    const report = await getSalesReport(
      startDate,
      endDate,
      period
    );

    res.status(200).json({
      success: true,
      message:
        "Sales report fetched successfully",
      report,
    });
  } catch (error) {
    console.error(
      "Get sales report error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch sales report",
    });
  }
};



// ======================================================
// DOWNLOAD SALES REPORT PDF
// ======================================================

export const downloadSalesReportPDF =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        period,
      } = req.query;

      const report = await getSalesReport(
        startDate,
        endDate,
        period
      );

      // --------------------------------
      // CREATE PDF
      // --------------------------------

      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
      });

      // --------------------------------
      // RESPONSE HEADERS
      // --------------------------------

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="jhub-sales-report.pdf"'
      );

      doc.pipe(res);

      // --------------------------------
      // COLORS
      // --------------------------------

      const green = "#176B36";
      const darkGreen = "#173B2F";
      const lightGreen = "#F1F8F4";
      const borderGray = "#D9E0E5";
      const textGray = "#64748B";
      const lightGray = "#FAFAFA";
      const red = "#EF4444";

      // --------------------------------
      // REPORT TITLE
      // --------------------------------

      let reportTitle = "SALES REPORT";

      if (period === "daily") {
        reportTitle = "DAY REPORT";
      }

      if (period === "weekly") {
        reportTitle = "WEEK REPORT";
      }

      if (period === "yearly") {
        reportTitle = "YEAR REPORT";
      }

      if (!period && (startDate || endDate)) {
        reportTitle = "CUSTOM REPORT";
      }

      // --------------------------------
      // PERIOD TEXT
      // --------------------------------

      let periodText = "All Orders";

      if (period === "daily") {
        periodText =
          new Date().toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          );
      }

      if (period === "weekly") {
        periodText = "Current Week";
      }

      if (period === "yearly") {
        periodText =
          new Date().getFullYear().toString();
      }

      if (!period && (startDate || endDate)) {
        periodText = `${startDate || "Start"} → ${
          endDate || "End"
        }`;
      }

      // --------------------------------
      // HEADER GREEN LINE
      // --------------------------------

      doc
        .moveTo(40, 40)
        .lineTo(555, 40)
        .lineWidth(7)
        .strokeColor(green)
        .stroke();

      // --------------------------------
      // J-HUB
      // --------------------------------

      doc
        .font("Helvetica-Bold")
        .fontSize(28)
        .fillColor("#222222")
        .text(
          "J-HUB",
          40,
          65
        );

      // --------------------------------
      // REPORT TITLE
      // --------------------------------

      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .fillColor("#475569")
        .text(
          reportTitle,
          365,
          70,
          {
            width: 190,
            align: "right",
          }
        );

      // --------------------------------
      // PERIOD
      // --------------------------------

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(textGray)
        .text(
          `Period: ${periodText}`,
          350,
          94,
          {
            width: 205,
            align: "right",
          }
        );

      // --------------------------------
      // GENERATED DATE
      // --------------------------------

      doc
        .fontSize(9)
        .fillColor("#94A3B8")
        .text(
          `Generated: ${new Date().toLocaleString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          )}`,
          350,
          111,
          {
            width: 205,
            align: "right",
          }
        );

      // --------------------------------
      // SUMMARY VALUES
      // --------------------------------

      const totalOrders =
        Number(
          report.summary.totalOrders || 0
        );

      const totalRevenue =
        Number(
          report.summary.totalSales || 0
        );

      const totalDiscount =
        Number(
          report.summary.totalDiscount || 0
        );

      // --------------------------------
      // UNITS SOLD
      // --------------------------------

      const unitsSold =
        report.orders.reduce(
          (total, order) => {
            if (!order.items) {
              return total;
            }

            return (
              total +
              order.items.reduce(
                (itemTotal, item) =>
                  itemTotal +
                  Number(
                    item.quantity || 0
                  ),
                0
              )
            );
          },
          0
        );

      // --------------------------------
      // SUMMARY CARDS
      // --------------------------------

      const cardY = 155;
      const cardWidth = 117;
      const cardHeight = 70;
      const cardGap = 10;

      const cards = [
        {
          title: "TOTAL ORDERS",
          value:
            totalOrders.toString(),
        },
        {
          title: "TOTAL REVENUE",
          value: `Rs.${totalRevenue.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`,
        },
        {
          title: "TOTAL DISCOUNT",
          value: `Rs.${totalDiscount.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`,
        },
        {
          title: "UNITS SOLD",
          value:
            unitsSold.toString(),
        },
      ];

      cards.forEach(
        (card, index) => {
          const x =
            40 +
            index *
              (cardWidth + cardGap);

          doc
            .roundedRect(
              x,
              cardY,
              cardWidth,
              cardHeight,
              8
            )
            .fillAndStroke(
              "#FAFAF8",
              borderGray
            );

          doc
            .font("Helvetica-Bold")
            .fontSize(8)
            .fillColor("#777777")
            .text(
              card.title,
              x,
              cardY + 17,
              {
                width: cardWidth,
                align: "center",
              }
            );

          doc
            .font("Helvetica-Bold")
            .fontSize(15)
            .fillColor("#222222")
            .text(
              card.value,
              x,
              cardY + 39,
              {
                width: cardWidth,
                align: "center",
              }
            );
        }
      );

      // --------------------------------
      // ORDER DETAILS TITLE
      // --------------------------------

      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .fillColor("#222222")
        .text(
          "Order Details",
          40,
          245
        );

      // --------------------------------
      // TABLE SETTINGS
      // --------------------------------

      const tableX = 40;
      const tableWidth = 515;
      const tableTop = 272;
      const headerHeight = 30;
      const rowHeight = 34;

      // --------------------------------
      // COLUMNS
      // --------------------------------

      const columns = [
        {
          title: "#",
          width: 25,
        },
        {
          title: "Order Number",
          width: 105,
        },
        {
          title: "Date",
          width: 55,
        },
        {
          title: "Qty",
          width: 35,
        },
        {
          title: "Subtotal",
          width: 70,
        },
        {
          title: "Discount",
          width: 65,
        },
        {
          title: "Payment",
          width: 65,
        },
        {
          title: "Total",
          width: 95,
        },
      ];

      // --------------------------------
      // IMPORTANT FIX
      // COLUMN POSITIONS ARE OUTSIDE LOOP
      // --------------------------------

      const col1 = tableX;

      const col2 =
        col1 + columns[0].width;

      const col3 =
        col2 + columns[1].width;

      const col4 =
        col3 + columns[2].width;

      const col5 =
        col4 + columns[3].width;

      const col6 =
        col5 + columns[4].width;

      const col7 =
        col6 + columns[5].width;

      const col8 =
        col7 + columns[6].width;

      // --------------------------------
      // TABLE HEADER
      // --------------------------------

      const drawTableHeader = (
        y
      ) => {
        doc
          .rect(
            tableX,
            y,
            tableWidth,
            headerHeight
          )
          .fill(darkGreen);

        let headerX = tableX;

        columns.forEach(
          (column) => {
            doc
              .font("Helvetica-Bold")
              .fontSize(7.5)
              .fillColor("#FFFFFF")
              .text(
                column.title,
                headerX + 4,
                y + 10,
                {
                  width:
                    column.width - 8,
                  align:
                    column.title === "#"
                      ? "center"
                      : column.title ===
                          "Qty"
                        ? "center"
                        : column.title ===
                            "Total"
                          ? "right"
                          : "left",
                }
              );

            headerX +=
              column.width;
          });
      };

      drawTableHeader(tableTop);

      // --------------------------------
      // TABLE ROWS
      // --------------------------------

      let currentY =
        tableTop + headerHeight;

      let grandSubtotal = 0;
      let grandDiscount = 0;
      let grandTotal = 0;
      let grandQuantity = 0;

      report.orders.forEach(
        (order, index) => {

          // PAGE BREAK
          if (
            currentY >
            doc.page.height - 90
          ) {
            doc.addPage();

            currentY = 50;

            drawTableHeader(
              currentY
            );

            currentY +=
              headerHeight;
          }

          // QUANTITY
          const quantity =
            order.items?.reduce(
              (total, item) =>
                total +
                Number(
                  item.quantity || 0
                ),
              0
            ) || 0;

          // SUBTOTAL
          const subtotal =
            Number(
              order.subtotal || 0
            );

          // DISCOUNT
          const discount =
            Number(
              order.discount || 0
            );

          // TOTAL
          const total =
            Number(
              order.finalPrice || 0
            );

          // GRAND TOTALS
          grandSubtotal +=
            subtotal;

          grandDiscount +=
            discount;

          grandTotal +=
            total;

          grandQuantity +=
            quantity;

          // ROW BACKGROUND
          doc
            .rect(
              tableX,
              currentY,
              tableWidth,
              rowHeight
            )
            .fill(
              index % 2 === 0
                ? "#FFFFFF"
                : lightGray
            );

          // ROW BORDER
          doc
            .moveTo(
              tableX,
              currentY +
                rowHeight
            )
            .lineTo(
              tableX +
                tableWidth,
              currentY +
                rowHeight
            )
            .lineWidth(0.5)
            .strokeColor(
              borderGray
            )
            .stroke();

          // #
          doc
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor("#222222")
            .text(
              index + 1,
              col1 + 4,
              currentY + 11,
              {
                width:
                  columns[0].width - 8,
                align: "center",
              }
            );

          // ORDER NUMBER
          doc
            .font("Helvetica-Bold")
            .fontSize(7.5)
            .fillColor("#222222")
            .text(
              order.orderId ||
                order._id.toString(),
              col2 + 4,
              currentY + 11,
              {
                width:
                  columns[1].width - 8,
              }
            );

          // DATE
          doc
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor("#444444")
            .text(
              new Date(
                order.createdAt
              ).toLocaleDateString(
                "en-IN",
                {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }
              ),
              col3 + 3,
              currentY + 11,
              {
                width:
                  columns[2].width - 6,
              }
            );

          // QUANTITY
          doc
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor("#222222")
            .text(
              quantity.toString(),
              col4,
              currentY + 11,
              {
                width:
                  columns[3].width,
                align: "center",
              }
            );

          // SUBTOTAL
          doc
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor("#222222")
            .text(
              `Rs.${subtotal.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}`,
              col5 + 3,
              currentY + 11,
              {
                width:
                  columns[4].width - 6,
              }
            );

          // DISCOUNT
          doc
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor(red)
            .text(
              `Rs.${discount.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}`,
              col6 + 3,
              currentY + 11,
              {
                width:
                  columns[5].width - 6,
              }
            );

          // PAYMENT
          doc
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor("#222222")
            .text(
              order.paymentMethod ||
                "-",
              col7 + 3,
              currentY + 11,
              {
                width:
                  columns[6].width - 6,
              }
            );

          // TOTAL
          doc
            .font("Helvetica-Bold")
            .fontSize(7.5)
            .fillColor("#222222")
            .text(
              `Rs.${total.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}`,
              col8 + 3,
              currentY + 11,
              {
                width:
                  columns[7].width - 6,
                align: "right",
              }
            );

          currentY +=
            rowHeight;
        }
      );

      // --------------------------------
      // GRAND TOTAL
      // --------------------------------

      doc
        .rect(
          tableX,
          currentY,
          tableWidth,
          rowHeight
        )
        .fill(lightGreen);

      doc
        .moveTo(
          tableX,
          currentY
        )
        .lineTo(
          tableX +
            tableWidth,
          currentY
        )
        .lineWidth(1.5)
        .strokeColor(green)
        .stroke();

      // GRAND TOTAL
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(green)
        .text(
          "GRAND TOTAL",
          tableX + 4,
          currentY + 12,
          {
            width: 130,
          }
        );

      // GRAND QUANTITY
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(green)
        .text(
          grandQuantity.toString(),
          col4,
          currentY + 12,
          {
            width:
              columns[3].width,
            align: "center",
          }
        );

      // GRAND SUBTOTAL
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(green)
        .text(
          `Rs.${grandSubtotal.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`,
          col5 + 3,
          currentY + 12,
          {
            width:
              columns[4].width - 6,
          }
        );

      // GRAND DISCOUNT
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(green)
        .text(
          `Rs.${grandDiscount.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`,
          col6 + 3,
          currentY + 12,
          {
            width:
              columns[5].width - 6,
          }
        );

      // GRAND TOTAL PRICE
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(green)
        .text(
          `Rs.${grandTotal.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`,
          col8 + 3,
          currentY + 12,
          {
            width:
              columns[7].width - 6,
            align: "right",
          }
        );

      // --------------------------------
      // FOOTER
      // --------------------------------

      const footerY =
        doc.page.height - 35;

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor("#94A3B8")
        .text(
          "J-HUB • Sales Report",
          40,
          footerY,
          {
            width: 515,
            align: "center",
          }
        );

      // --------------------------------
      // END PDF
      // --------------------------------

      doc.end();

    } catch (error) {
      console.error(
        "Download PDF error:",
        error
      );

      // Prevent another response after
      // PDF stream has already started
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message:
            error.message ||
            "Failed to download PDF",
        });
      }
    }
  };


  // ======================================================
// DOWNLOAD SALES REPORT EXCEL
// ======================================================

export const downloadSalesReportExcel =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        period,
      } = req.query;

      const report = await getSalesReport(
        startDate,
        endDate,
        period
      );

      const workbook =
        new ExcelJS.Workbook();

      const worksheet =
        workbook.addWorksheet(
          "Sales Report"
        );


      // --------------------------------
      // TITLE
      // --------------------------------

      worksheet.mergeCells(
        "A1:F1"
      );

      worksheet.getCell("A1").value =
        "J-HUB Sales Report";

      worksheet.getCell(
        "A1"
      ).font = {
        bold: true,
        size: 18,
      };

      worksheet.getCell(
        "A1"
      ).alignment = {
        horizontal: "center",
      };


      // --------------------------------
      // REPORT PERIOD
      // --------------------------------

      let reportPeriod = "All Orders";

      if (period === "daily") {
        reportPeriod = "Daily";
      }

      if (period === "weekly") {
        reportPeriod = "Weekly";
      }

      if (period === "yearly") {
        reportPeriod = "Yearly";
      }

      if (!period && (startDate || endDate)) {
        reportPeriod = `${startDate || "Start"} - ${
          endDate || "End"
        }`;
      }


      worksheet.addRow([]);

      worksheet.addRow([
        "Report Period",
        reportPeriod,
      ]);


      worksheet.addRow([]);


      // --------------------------------
      // SUMMARY
      // --------------------------------

      worksheet.addRow([
        "Total Orders",
        report.summary.totalOrders,
      ]);

      worksheet.addRow([
        "Total Sales",
        report.summary.totalSales,
      ]);

      worksheet.addRow([
        "Total Discount",
        report.summary.totalDiscount,
      ]);

      worksheet.addRow([
        "Total Tax",
        report.summary.totalTax,
      ]);

      worksheet.addRow([
        "Total Shipping",
        report.summary.totalShipping,
      ]);

      worksheet.addRow([
        "Average Order Value",
        report.summary.averageOrderValue,
      ]);


      worksheet.addRow([]);


      // --------------------------------
      // ORDER HEADER
      // --------------------------------

      worksheet.addRow([
        "Order ID",
        "Date",
        "Status",
        "Payment Method",
        "Discount",
        "Final Price",
      ]);


      const headerRow =
        worksheet.lastRow;


      headerRow.font = {
        bold: true,
      };


      // --------------------------------
      // ORDERS
      // --------------------------------

      report.orders.forEach(
        (order) => {
          worksheet.addRow([
            order.orderId ||
              order._id.toString(),

            new Date(
              order.createdAt
            ).toLocaleDateString(
              "en-IN"
            ),

            order.status,

            order.paymentMethod ||
              "N/A",

            Number(
              order.discount || 0
            ),

            Number(
              order.finalPrice || 0
            ),
          ]);
        }
      );


      // --------------------------------
      // COLUMN WIDTH
      // --------------------------------

      worksheet.columns = [
        {
          width: 30,
        },

        {
          width: 18,
        },

        {
          width: 15,
        },

        {
          width: 20,
        },

        {
          width: 18,
        },

        {
          width: 18,
        },
      ];


      // --------------------------------
      // EXCEL RESPONSE
      // --------------------------------

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="jhub-sales-report.xlsx"'
      );


      await workbook.xlsx.write(
        res
      );

      res.end();

    } catch (error) {
      console.error(
        "Download Excel error:",
        error
      );

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message:
            error.message ||
            "Failed to download Excel",
        });
      }
    }
  };