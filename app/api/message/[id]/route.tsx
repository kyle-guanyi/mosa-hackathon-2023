import { connectToDB } from "utils/database";
import Message from "models/message";
import Comment from "models/comment";

//GET (read)
export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const messages = await Message.find({ event: params?.id });

    if(!messages || messages.length === 0) return new Response("Event messages not found", {status: 404});

    return new Response(JSON.stringify(messages), {status: 200})
  } catch (error) {
    console.log(error)
    return new Response("Failed to fetch event messages", { status: 500 })
  }
}

//PATCH (update)

//DELETE (delete)

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB;

    
    const messageId = params?.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return new Response("Message not found", {status: 404});
    }

    // Delete associated comments first
    await Comment.deleteMany({ post: messageId });

    // Delete the message
    await message.deleteOne();

    return new Response("Message and associated comments deleted", {status: 200});

  } catch (error) {
    console.error("Error deleting message", error); // Log the error for debugging
    return new Response("Error deleting message", { status: 500 });
  }
}


