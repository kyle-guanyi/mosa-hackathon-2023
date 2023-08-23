import { Schema, model, models, Document, Types } from "mongoose";

const commentSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: "Message",
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
});

const Comment = models.Comment || model("Comment", commentSchema);

export default Comment;
