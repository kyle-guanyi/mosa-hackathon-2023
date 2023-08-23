import { connectToDB } from "utils/database";
import Comment from "models/comment";

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
