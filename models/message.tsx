import { Schema, model, models } from "mongoose";

/**
 * Message Schema
 */
const messageSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastEdited: {
    type: Date,
    default: Date.now,
  },
  uploadedMessagePictures: {
    type: [String],
  },
});

// Export the model and return your IUser interface
const Message = models.Message || model("Message", messageSchema);

export default Message;
