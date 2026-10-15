import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();

  // COMPANY HEADER
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("J-HUB", 20, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Unisex Jerseys", 20, 32);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 150, 25);

  // INVOICE INFORMATION
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const orderId =
    order?.orderId ||
    order?._id ||
    "N/A";

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  doc.text(`Order ID: ${orderId}`, 150, 33);
  doc.text(`Date: ${orderDate}`, 150, 40);

  // CUSTOMER DETAILS
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To", 20, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const address =
    order?.shippingAddress ||
    order?.address ||
    {};

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

  let addressY = 70;
  if (address?.address) {
    doc.text(address.address, 20, addressY);
    addressY += 7;
  }

  if (address?.city) {
    doc.text(
      `${address.city}${
        address.state ? `, ${address.state}` : ""
      }`,
      20,
      addressY
    );
    addressY += 7;
  }

  if (address?.pincode) {
    doc.text(`PIN: ${address.pincode}`, 20, addressY);
    addressY += 7;
  }

  if (phone) {
    doc.text(`Phone: ${phone}`, 20, addressY);
    addressY += 7;
  }

  if (email) {
    doc.text(`Email: ${email}`, 20, addressY);
    addressY += 7;
  }

  // ORDER ITEMS
  const items =
    order?.items ||
    order?.products ||
    [];

  const finalAmount = Number(
    order?.finalAmount ?? order?.totalAmount ?? order?.finalPrice ?? 0
  );

  const shippingFee = Number(
    order?.shippingFee ??
    order?.shipping ??
    order?.shippingCharge ??
    order?.deliveryCharge ??
    0
  );

  const couponDiscount = Number(order?.couponDiscount || 0);
  const orderProductDiscount = Number(order?.discount || 0);

  // Bind directly to snapshot fields: name, size, quantity, price, total
  const processedItems = items.map((item, index) => {
    const productName =
      item?.name ||
      item?.product?.name ||
      "Product";

    const size =
      item?.size ||
      item?.variant?.size ||
      "-";

    const quantity = Number(item?.quantity) || 1;

    // Unit price: actual billing unit price from snapshot
    const unitPrice = Number(item?.price ?? item?.product?.price ?? 0);

    // Item Total: strictly equals unitPrice * quantity
    const itemTotal = Math.round(unitPrice * quantity * 100) / 100;

    return {
      index: index + 1,
      name: productName,
      size,
      quantity,
      unitPrice,
      total: itemTotal,
    };
  });

  const tableData = processedItems.map((item) => [
    item.index,
    item.name,
    item.size,
    item.quantity,
    `Rs. ${item.unitPrice.toFixed(2)}`,
    `Rs. ${item.total.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: Math.max(addressY + 8, 110),

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
      font: "helvetica",
    },

    headStyles: {
      fillColor: [23, 107, 54],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },

    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      1: { cellWidth: "auto", halign: "left" },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 18, halign: "center" },
      4: { cellWidth: 32, halign: "right" },
      5: { cellWidth: 35, halign: "right" },
    },
  });

  // SUMMARY BREAKDOWN & TOTALS
  // Subtotal = sum of all item row totals
  const subtotal = processedItems.reduce(
    (sum, item) => sum + item.total,
    0
  );

  // Check whether table items are original MRP or selling prices:
  // If subtotal - couponDiscount + shippingFee matches finalAmount,
  // selling price is already reflected in the line items table (no duplicate product discount).
  const diffWithoutProductDiscount = Math.abs(
    (subtotal - couponDiscount + shippingFee) - finalAmount
  );
  const diffWithProductDiscount = Math.abs(
    (subtotal - orderProductDiscount - couponDiscount + shippingFee) - finalAmount
  );

  let showProductDiscount = false;
  let productDiscount = 0;

  if (
    orderProductDiscount > 0 &&
    diffWithProductDiscount < diffWithoutProductDiscount &&
    diffWithProductDiscount < 0.5
  ) {
    showProductDiscount = true;
    productDiscount = orderProductDiscount;
  }

  const totalDiscount =
    (showProductDiscount ? productDiscount : 0) + couponDiscount;

  const grandTotal =
    finalAmount > 0
      ? finalAmount
      : Math.round((subtotal - totalDiscount + shippingFee) * 100) / 100;

  let finalY = doc.lastAutoTable.finalY + 12;

  if (finalY > 235) {
    doc.addPage();
    finalY = 25;
  }

  // PAYMENT INFORMATION (Left Column at X = 20)
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const paymentMethod =
    order?.paymentMethod ||
    "COD";

  const paymentStatus = order?.paymentStatus
    ? order.paymentStatus.charAt(0).toUpperCase() +
      order.paymentStatus.slice(1)
    : "Pending";

  const status = order?.status
    ? order.status.charAt(0).toUpperCase() +
      order.status.slice(1)
    : "Pending";

  doc.text(`Payment Method: ${paymentMethod}`, 20, finalY);
  doc.text(`Payment Status: ${paymentStatus}`, 20, finalY + 7);
  doc.text(`Order Status: ${status}`, 20, finalY + 14);

  // SUMMARY BREAKDOWN (Right Column at X = 135)
  let summaryY = finalY;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Subtotal: Rs. ${Number(subtotal).toFixed(2)}`,
    135,
    summaryY
  );
  summaryY += 7;

  if (showProductDiscount && productDiscount > 0) {
    doc.text(
      `Product Discount: -Rs. ${Number(productDiscount).toFixed(2)}`,
      135,
      summaryY
    );
    summaryY += 7;
  }

  if (couponDiscount > 0) {
    const couponCode =
      order?.couponCode ||
      order?.coupon?.code;

    const couponText = couponCode
      ? `Coupon Discount (${couponCode}): -Rs. ${Number(couponDiscount).toFixed(2)}`
      : `Coupon Discount: -Rs. ${Number(couponDiscount).toFixed(2)}`;

    doc.text(couponText, 135, summaryY);
    summaryY += 7;
  }

  doc.text(
    `Shipping Fee: Rs. ${Number(shippingFee).toFixed(2)}`,
    135,
    summaryY
  );
  summaryY += 9;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.text(
    `Grand Total: Rs. ${Number(grandTotal).toFixed(2)}`,
    135,
    summaryY
  );

  // FOOTER
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

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

  // DOWNLOAD
  doc.save(
    `J-HUB-Invoice-${orderId}.pdf`
  );
};