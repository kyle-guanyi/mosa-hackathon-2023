// @ts-nocheck
import { connectToDB } from "utils/database";
import Message from "models/message";

/**
 * This function fetches all messages for a given event.
 *
 * @param request - The incoming request object
 * @constructor - The function that is called when the route is visited
 * @returns - A response object
 */
export const POST = async (request) => {
  const { event, author, content, createdAt, uploadedMessagePictures } = await request.json();

  try {
    await connectToDB();
    const newMessage = new Message({
      event,
      author,
      content,
      createdAt,
      uploadedMessagePictures, 
    });

    await newMessage.save();

    return new Response(JSON.stringify(newMessage), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create a new message", { status: 500 });
  }
};
