import { connectToDB } from "utils/database";
import Message from "models/message";

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
