import { connectToDB } from "utils/database";
import Event from "models/event";


//GET (read)
export const GET = async (request, { params }) => {
  try {
    await connectToDB;

    const event = await Event.findByID(params.id).
    populate('creator');
    if(!event) return new Response("Prompt not found", {status: 404});

    return new Response(JSON.stringify(event), {status: 200})
  } catch (error) {
    return new Response("Failed to fetch prompt", { status: 500 })
  }
}




//PATCH (update)

//DELETE (delete)


