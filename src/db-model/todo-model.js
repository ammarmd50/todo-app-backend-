import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    taskId : {
      type: String,
      require: true,
    },
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",  
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "done"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const todoModel = mongoose.model("todos", todoSchema);
