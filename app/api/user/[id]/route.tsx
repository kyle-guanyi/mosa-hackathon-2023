import { connectToDB } from "utils/database";
import User from "models/user";


/**
 * This function fetches a user by ID.
 *
 * @param request - The incoming request object
 * @param params - The route parameters
 * @constructor - The function that is called when the route is visited
 * @returns - A response object
 */
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

/**
 * This function updates a user.
 *
 * @param request - The incoming request object
 * @param params - The route parameters
 * @constructor - The function that is called when the route is visited
 * @returns - A response object
 */
export const PATCH = async (request, { params }) => {
  // Get the new user's contents from the body of the request
  if (request.nextUrl.searchParams.get("type") === "attending") {
    return PATCH_ATTENDING(request, {params});

  } else if (request.nextUrl.searchParams.get("type") === "pic") {
    return PATCH_PROFILE_PIC(request, {params});
  }
  const { firstName, lastName, closestMainCity, timeZone, gender, bio, classesTaken, fieldOfInterest } = await request.json();

  try {
    await connectToDB();

    // Find the existing user by ID
    const existingUser = await User.findById(params.id);

    if (!existingUser) {
      return new Response("User not found", { status: 404 });
    }

    // Update the user with new data
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

/**
 * This function updates a user's attending events.
 *
 * @param request - The incoming request object
 * @param params - The route parameters
 * @constructor - The function that is called when the route is visited
 * @returns - A response object
 */
export const PATCH_ATTENDING = async (request, { params }) => {
  const { attendingEvents } = await request.json();

  try {
    await connectToDB();

    // Find the existing user by ID
    const existingUser = await User.findById(params.id);

    if (!existingUser) {
      return new Response("User not found", { status: 404 });
    }

    // update user's attending events array
    existingUser.attendingEvents = attendingEvents;

    await existingUser.save();

    return new Response("Successfully updated user's attending events", { status: 200 });
  } catch (error) {
    console.error("Error updating user's attending events:", error); // Log the error for debugging
    return new Response("Error updating user's attending events", { status: 500 });
  }
};

/**
 * This function updates a user's profile pic.
 *
 * @param request - The incoming request object
 * @param params - The route parameters
 * @constructor - The function that is called when the route is visited
 * @returns - A response object
 */
export const PATCH_PROFILE_PIC = async (request, { params }) => {
  const { userUpdatedProfileImage } = await request.json();

  try {
    await connectToDB();

    // Find the existing user by ID
    const existingUser = await User.findById(params.id);

    if (!existingUser) {
      return new Response("User not found", { status: 404 });
    }

    // update user's attending events array
    existingUser.userUpdatedProfileImage = userUpdatedProfileImage;

    await existingUser.save();

    return new Response("Successfully updated user's profile pic", { status: 200 });
  } catch (error) {
    console.error("Error updating user's profile pic:", error); // Log the error for debugging
    return new Response("Error updating user's profile pic", { status: 500 });
  }
};
