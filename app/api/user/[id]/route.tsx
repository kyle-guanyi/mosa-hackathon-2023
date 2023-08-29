// @ts-nocheck
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
  try {
    await connectToDB();
    const existingUser = await User.findById(params.id);
    if (!existingUser) {
      return new Response("User not found", { status: 404 });
    }

    const type = request.nextUrl.searchParams.get("type");
    const requestData = await request.json();

    switch (type) {
      case "attending":
        existingUser.attendingEvents = requestData.attendingEvents;
        break;
      case "pic":
        existingUser.userUpdatedProfileImage = requestData.userUpdatedProfileImage;
        break;
      default:
        Object.assign(existingUser, {
          firstName: requestData.firstName,
          lastName: requestData.lastName,
          closestMainCity: requestData.closestMainCity,
          timeZone: requestData.timeZone,
          gender: requestData.gender,
          bio: requestData.bio,
          classesTaken: requestData.classesTaken,
          fieldOfInterest: requestData.fieldOfInterest,
        });
    }

    await existingUser.save();

    return new Response(`Successfully updated user${type ? `'s ${type}` : ''}`, { status: 200 });
  } catch (error) {
    console.error(`Error updating user${type ? `'s ${type}` : ''}`, error);
    return new Response(`Error updating user${type ? `'s ${type}` : ''}`, { status: 500 });
  }
};

