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
export const PATCH = async (request, { params }) => {
  const { content } = await request.json();

  if (request.nextUrl.searchParams.get("type") === "pic") {
    return PATCH_MESSAGE_PICTURES(request, {params});
  }

  try {
    await connectToDB();

    // Find the existing event by ID
    const existingMessage = await Message.findById(params?.id);

    if (!existingMessage) {
      return new Response("Message not found", { status: 404 });
    }

    // update event's attendees
    existingMessage.content = content;

    await existingMessage.save();

    return new Response("Successfully updated message", { status: 200 });
  } catch (error) {
    console.error("Error updating message", error); // Log the error for debugging
    return new Response("Error updating message's contents", { status: 500 });
  }
};

export const PATCH_MESSAGE_PICTURES = async (request, { params }) => {
  const { uploadedMessagePictures } = await request.json();

  try {
    await connectToDB();

    const existingMessage = await Message.findById(params.id);

    if (!existingMessage) {
      return new Response("Message not found", { status: 404 });
    }

    existingMessage.uploadedMessagePictures = uploadedMessagePictures;

    await existingMessage.save();

    return new Response("Successfully updated messages's uploaded pictures", { status: 200 });
  } catch (error) {
    console.error("Error updating message's uploaded pictures", error); // Log the error for debugging
    return new Response("Error updating message's uploaded pictures", { status: 500 });
  }
};

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


