import { connectToDB } from "utils/database";
import User from "models/user";


//GET (read)
export const GET = async (request, { params }) => {
  try {
    // connects to DB
    await connectToDB;
    // uses param ID to search for user in User database
    const user = await User.findById(params?.id);
    
    if(!user) return new Response("User not found", {status: 404});

    return new Response(JSON.stringify(user), {status: 200})
  } catch (error) {
    return new Response("Failed to fetch user", { status: 500 })
  }
}
