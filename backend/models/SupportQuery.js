// models/SupportQuery.js
import mongoose from "mongoose";

const supportQuerySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
    status: {
      type: String,
      enum: ["open", "replied", "closed"],
      default: "open",
    },
    adminReply: {
      type: String,
    },
  },
  { timestamps: true }
);

const SupportQuery = mongoose.model("SupportQuery", supportQuerySchema);
export default SupportQuery;
