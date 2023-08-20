import { connectToDB } from "utils/database";
import User from "models/user";


//GET (read)
export const GET = async (request, { params }) => {
  try {
    // connects to DB
    await connectToDB();
    // uses param ID to search for user in User database
    const user = await User.findById(params?.id);
    
    if(!user) return new Response("User not found", {status: 404});

    return new Response(JSON.stringify(user), {status: 200})
  } catch (error) {
    return new Response("Failed to fetch user", { status: 500 })
  }
}

//PATCH (update)

export const PATCH = async (request, { params }) => {
  const { firstName, lastName, closestMainCity, timeZone, gender, bio, classesTaken, fieldOfInterest } = await request.json();

  try {
    await connectToDB();

    // Find the existing prompt by ID
    const existingUser = await User.findById(params.id);

    if (!existingUser) {
      return new Response("User not found", { status: 404 });
    }

    // Update the prompt with new data
    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.closestMainCity = closestMainCity;
    existingUser.timeZone = timeZone;
    existingUser.gender = gender;
    existingUser.bio = bio;
    existingUser.classesTaken = classesTaken;
    existingUser.fieldOfInterest = fieldOfInterest;

    await existingUser.save();

    return new Response("Successfully updated the User", { status: 200 });
  } catch (error) {
    return new Response("Error Updating User", { status: 500 });
  }
};
