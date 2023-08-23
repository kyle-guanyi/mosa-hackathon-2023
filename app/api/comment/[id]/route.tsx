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

//DELETE (delete)
