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
  try {
    await connectToDB();

    const commentId = params?.id;
    const newContent = JSON.parse(request.body).content; // Extract the updated content from the request body

    // Find and update the comment by ID
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content: newContent },
      { new: true } // Return the updated comment
    );

    if (!updatedComment) {
      return new Response("Comment not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedComment), { status: 200 });
  } catch (error) {
    console.error("Error updating comment", error); // Log the error for debugging
    return new Response("Failed to update comment", { status: 500 });
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