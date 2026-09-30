import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();

  // =========================
  // COMPANY HEADER
  // =========================

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");

  doc.text("J-HUB", 20, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text("Premium Unisex Jerseys", 20, 32);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");

  doc.text("INVOICE", 150, 25);

  // =========================
  // INVOICE INFORMATION
  // =========================

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const orderId = order?._id || order?.orderId || "N/A";

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  doc.text(`Order ID: ${orderId}`, 150, 33);
  doc.text(`Date: ${orderDate}`, 150, 40);

  // =========================
  // CUSTOMER DETAILS
  // =========================

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.text("Bill To", 20, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const address = order?.shippingAddress || order?.address || {};

  const customerName =
    address?.name ||
    order?.user?.name ||
    "Customer";

  const phone =
    address?.phone ||
    address?.mobile ||
    "";

  const email =
    order?.user?.email ||
    order?.email ||
    "";

  doc.text(customerName, 20, 63);

  if (address?.address) {
    doc.text(address.address, 20, 70);
  }

  if (address?.city) {
    doc.text(
      `${address.city}${address.state ? `, ${address.state}` : ""}`,
      20,
      77
    );
  }

  if (address?.pincode) {
    doc.text(`PIN: ${address.pincode}`, 20, 84);
  }

  if (phone) {
    doc.text(`Phone: ${phone}`, 20, 91);
  }

  if (email) {
    doc.text(`Email: ${email}`, 20, 98);
  }

  // =========================
  // ORDER ITEMS
  // =========================

  const items = order?.items || order?.products || [];

  const tableData = items.map((item, index) => {
    const productName =
      item?.product?.name ||
      item?.name ||
      "Product";

    const size =
      item?.size ||
      item?.variant?.size ||
      "-";

    const quantity =
      item?.quantity ||
      1;

    const price =
      item?.price ||
      item?.product?.price ||
      0;

    const total = quantity * price;

    return [
      index + 1,
      productName,
      size,
      quantity,
      `Rs. ${Number(price).toFixed(2)}`,
      `Rs. ${Number(total).toFixed(2)}`,
    ];
  });

  autoTable(doc, {
    startY: 110,

    head: [
      [
        "#",
        "Product",
        "Size",
        "Qty",
        "Price",
        "Total",
      ],
    ],

    body: tableData,

    theme: "grid",

    styles: {
      fontSize: 9,
      cellPadding: 3,
    },

    headStyles: {
      fontStyle: "bold",
    },
  });

  // =========================
  // TOTALS
  // =========================

  const finalY =
    doc.lastAutoTable.finalY + 15;

  const subtotal =
    order?.subtotal ||
    order?.subTotal ||
    0;

  const discount =
    order?.discount ||
    0;

  const shipping =
    order?.shippingCharge ||
    order?.deliveryCharge ||
    0;

  const total =
    order?.totalAmount ||
    order?.total ||
    order?.grandTotal ||
    items.reduce((sum, item) => {
      const price =
        item?.price ||
        item?.product?.price ||
        0;

      const quantity =
        item?.quantity ||
        1;

      return sum + price * quantity;
    }, 0);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Subtotal: Rs. ${Number(subtotal).toFixed(2)}`,
    140,
    finalY
  );

  doc.text(
    `Discount: Rs. ${Number(discount).toFixed(2)}`,
    140,
    finalY + 7
  );

  doc.text(
    `Shipping: Rs. ${Number(shipping).toFixed(2)}`,
    140,
    finalY + 14
  );

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.text(
    `Grand Total: Rs. ${Number(total).toFixed(2)}`,
    140,
    finalY + 24
  );

  // =========================
  // PAYMENT INFORMATION
  // =========================

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const paymentMethod =
    order?.paymentMethod || "COD";

  const status =
    order?.status || "Pending";

  doc.text(
    `Payment Method: ${paymentMethod}`,
    20,
    finalY + 25
  );

  doc.text(
    `Order Status: ${status}`,
    20,
    finalY + 32
  );

  // =========================
  // FOOTER
  // =========================

  doc.setFontSize(10);

  doc.text(
    "Thank you for shopping with J-HUB!",
    20,
    275
  );

  doc.setFontSize(8);

  doc.text(
    "This is a computer-generated invoice.",
    20,
    282
  );

  // =========================
  // DOWNLOAD
  // =========================

  doc.save(`J-HUB-Invoice-${orderId}.pdf`);
};