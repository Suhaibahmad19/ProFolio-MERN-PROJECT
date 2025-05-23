import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderName: {
    type: String,
    minLength: [3, "Name should have at least 3 characters"],
  },
  subject: {
    type: String,
    minLength: [3, "subject should have at least 3 characters"],
  },
  message: {
    type: String,
    minLength: [3, "Message should have at least 3 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Message = mongoose.model("Message", messageSchema);
