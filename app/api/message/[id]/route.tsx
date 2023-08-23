import { connectToDB } from "utils/database";
import Message from "models/message";

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


