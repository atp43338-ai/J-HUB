import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      default: "Unisex",
    },

    collection: {
    type: [String],
    required: true,
    enum: ["Club", "National", "Legends", "New Season"],
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      required: true,
    },

    variants: [
  {
    size: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
],

    discount: {
      type: Number,
      default: 0,
    },

    isListed: {
      type: Boolean,
      default: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;