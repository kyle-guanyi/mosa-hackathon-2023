import { Schema, model, models } from "mongoose";

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

const Message = models.Message || model("Message", messageSchema);

export default Message;
