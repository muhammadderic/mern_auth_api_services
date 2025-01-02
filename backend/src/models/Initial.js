import mongoose from "mongoose";

const initialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export const Initial = mongoose.model("Initial", initialSchema);