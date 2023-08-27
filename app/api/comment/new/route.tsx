import { connectToDB } from "utils/database";
import Comment from "models/comment";

/**
 * This function fetches all comments for a given post.
 *
 * @param request - The incoming request object
 * @constructor - The function that is called when the route is visited
 * @returns - A response object
 */
export const POST = async (request) => {
  const { post, author, content, createdAt } = await request.json();

  try {
    await connectToDB();
    const newComment = new Comment({
      post,
      author,
      content,
      createdAt,
    });

    await newComment.save();

    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create a new comment", { status: 500 });
  }
};
