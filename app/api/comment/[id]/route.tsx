import { connectToDB } from "utils/database";
import Comment from "models/comment";

//GET (read)
export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const comments = await Comment.find({ post: params?.id });

    if (!comments || comments.length === 0) return new Response("Message comments not found", { status: 404 });

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch message comments", { status: 500 });
  }
};

//PATCH (update)
export const PATCH = async (request, { params }) => {
  const { content } = await request.json();

  if (request.nextUrl.searchParams.get("type") === "pic") {
    return PATCH_COMMENT_PICTURES(request, {params});
  }

  try {
    await connectToDB();

    // Find the existing event by ID
    const existingComment = await Comment.findById(params?.id);

    if (!existingComment) {
      return new Response("Comment not found", { status: 404 });
    }

    // update event's attendees
    existingComment.content = content;

    await existingComment.save();

    return new Response("Successfully updated comment", { status: 200 });
  } catch (error) {
    console.error("Error updating comment", error); // Log the error for debugging
    return new Response("Error updating comment's contents", { status: 500 });
  }
};

export const PATCH_COMMENT_PICTURES = async (request, { params }) => {
  const { uploadedCommentPictures } = await request.json();

  try {
    await connectToDB();

    const existingComment = await Comment.findById(params.id);

    if (!existingComment) {
      return new Response("Comment not found", { status: 404 });
    }

    existingComment.uploadedCommentPictures = uploadedCommentPictures;

    await existingComment.save();

    return new Response("Successfully updated comment's updated pictures", { status: 200 });
  } catch (error) {
    console.error("Error updating comment's updated pictures", error); // Log the error for debugging
    return new Response("Error updating comment's updated pictures", { status: 500 });
  }
};

//DELETE (delete)
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Find the existing comment by ID
    const commentId = params?.id;
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return new Response("Comment not found", {status: 404});
    }
    return new Response("Successfully deleted the comment", {status: 200});
  } catch (error) {
    console.error("Error deleting comment", error); // Log the error for debugging
    return new Response("Failed to delete comment", {status: 500});
  }
}

