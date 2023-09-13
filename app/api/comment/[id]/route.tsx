// @ts-nocheck
import { connectToDB } from "../../../../utils/database";
import Comment from "../../../../models/comment";

/**
 * This function fetches all comments for a given post.
 *
 * @param request - The incoming request object
 * @param params - The route parameters
 * @constructor - The function that is called when the route is visited
 * @returns - A response object
 */
export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    // populate used for filtering events => use for location?
    const comments = await Comment.find({ post: params?.id });

    if (!comments || comments.length === 0) return new Response("Message comments not found", { status: 404 });

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch message comments", { status: 500 });
  }
};

/**
 * This function update a comment's contents.
 *
 * @param request - The incoming request object
 * @param params - The route parameters
 * @constructor - The function that is called when the route is visited
 * @returns - A response object
 */
export const PATCH = async (request, { params }) => {
  // Get the new comment's contents from the body of the request
  const { content } = await request.json();

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

/**
 * This function deletes a comment.
 *
 * @param request - The incoming request object
 * @param params - The route parameters
 * @constructor - The function that is called when the route is visited
 * @returns - A response object
 */
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

