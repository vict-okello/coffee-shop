import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    weight: {
      type: String,
      default: "500 gm",
    },

    categories: {
      type: [String],
      default: ["popular"],
    },

    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    stockQty: {
      type: Number,
      default: 0,
      min: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.index({
  name: "text",
  description: "text",
  categories: "text",
});

export default mongoose.model("Product", productSchema);
