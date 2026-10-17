import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // User who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Unique order ID shown to the user
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    // Products inside the order
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          required: true,
        },

        size: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        price: {
          type: Number,
          required: true,
        },

        originalPrice: {
          type: Number,
        },

        unitDiscount: {
          type: Number,
          default: 0,
        },

        total: {
          type: Number,
          required: true,
        },

        // Item cancellation
        cancelled: {
          type: Boolean,
          default: false,
        },

        cancellationReason: {
          type: String,
          default: "",
        },

        cancelledAt: {
          type: Date,
          default: null,
        },

        isRefunded: {
          type: Boolean,
          default: false,
        },

        refundAmount: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Delivery address snapshot
    address: {
      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    // Payment
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CARD","WALLET"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "Payment Failed",
        "payment_failed",
        "Expired",
        "expired",
        "refunded",
        "partially_refunded",
        "Completed",
        "completed",
        "Pending",
        "Paid",
      ],
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    revenueCredited: {
      type: Boolean,
      default: false,
    },

    revenueCreditedAt: {
      type: Date,
      default: null,
    },

    isRefunded: {
      type: Boolean,
      default: false,
    },

    // Payment retry
    paymentRetryExpiresAt: {
      type: Date,
      default: null,
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    // Price details
    subtotal: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    couponCode: {
      type: String,
      default: null,
    },

    couponDiscount: {
      type: Number,
      default: 0,
    },

    couponMinPurchase: {
      type: Number,
      default: 0,
    },

    couponRevoked: {
      type: Boolean,
      default: false,
    },

    tax: {
      type: Number,
      default: 0,
    },

    shipping: {
      type: Number,
      default: 0,
    },

    shippingFee: {
      type: Number,
      default: 0,
    },

    finalPrice: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      default: 0,
    },

    // Order status
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "Payment Failed",
        "payment_failed",
      ],
      default: "pending",
    },

    // Cancellation
    cancellationReason: {
      type: String,
      default: "",
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    // Return
    returnReason: {
      type: String,
      default: "",
    },

    returnedAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema
  .virtual("orderStatus")
  .get(function () {
    return this.status;
  })
  .set(function (val) {
    this.status = val;
  });

const Order = mongoose.model("Order", orderSchema);

export default Order;