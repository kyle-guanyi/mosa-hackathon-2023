// @ts-nocheck
import { connectToDB } from "utils/database";
import Message from "models/message";
import Comment from "models/comment";

/**
 * This function fetches all messages for a given event.
 *
 * @param request - The incoming request object
 * @param params - The route parameters
 * @constructor - The function that is called when the route is visited
 * @returns - A response object
 */
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

/**
 * This function update a message's contents.
 *
 * @param request - The incoming request object
 * @param params - The route parameters
 * @constructor - The function that is called when the route is visited
 * @returns - A response object
 */

/**
 * This function updates a message's contents or uploaded pictures based on the "type" query parameter.
 *
 * @param request - The incoming request object
 * @param params - The route parameters
 * @returns - A response object
 */
export const PATCH = async (request, { params }) => {
  try {
    await connectToDB();

    const existingMessage = await Message.findById(params?.id);

    if (!existingMessage) {
      return new Response("Message not found", { status: 404 });
    }

    const { content, uploadedMessagePictures } = await request.json();
    const patchType = request.nextUrl.searchParams.get("type");

    if (patchType === "pic") {
      existingMessage.uploadedMessagePictures = uploadedMessagePictures;
      await existingMessage.save();
      return new Response("Successfully updated messages's uploaded pictures", { status: 200 });
    } else {
      existingMessage.content = content;
      existingMessage.uploadedMessagePictures = uploadedMessagePictures;
      await existingMessage.save();
      return new Response("Successfully updated message", { status: 200 });
    }

  } catch (error) {
    console.error("Error updating message", error);
    return new Response("Error updating message", { status: 500 });
  }
};



/**
 * This function deletes a message and its associated comments.
 *
 * @param request - The incoming request object
 * @param params - The route parameters
 * @constructor - The function that is called when the route is visited
 * @returns - A response object
 */
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB;

    // Find the existing message by ID
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


