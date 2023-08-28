import { Schema, model, models, Document, Types } from "mongoose";

/**
 * Comment Schema
 */
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
  lastEdited: {
    type: Date,
    default: Date.now,
  },
  uploadedCommentPictures: {
    type: [String], // Array of strings
  },
});

// Export the model and return your IUser interface
const Comment = models.Comment || model("Comment", commentSchema);

export default Comment;
