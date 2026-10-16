import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["credit", "debit", "Credit", "Debit"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    reason: {
      type: String,
      default: function () {
        return this.description || "Wallet transaction";
      },
    },

    description: {
      type: String,
      default: function () {
        return this.reason || "Wallet transaction";
      },
    },

    status: {
      type: String,
      default: "Completed",
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    // RETURN REQUEST REFERENCE
    returnRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Return",
      default: null,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      sparse: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      sparse: true,
      index: true,
    },

    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    transactions: {
      type: [walletTransactionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;