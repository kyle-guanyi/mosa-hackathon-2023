// @ts-nocheck
import { connectToDB } from "../../../../utils/database";
import Event from "../../../../models/event";
import Message from "models/message";
import Comment from "models/comment";

/**
 * This function fetches all events.
 *
 * @param request - The incoming request object
 * @param params - The route parameters
 * @constructor - The function that is called when the route is visited
 * @returns - A response object
 */
export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const event = await Event.findById(params?.id);

    if (!event) return new Response("Event not found", { status: 404 });

    return new Response(JSON.stringify(event), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch event", { status: 500 });
  }
};

/**
 * This function updates an event.
 *
 * @param request - The incoming request object
 * @param params - The route parameters
 * @constructor - The function that is called when the route is visited
 */
export const PATCH = async (request, { params }) => {
  try {
    await connectToDB();

    // Find the existing event by ID
    const existingEvent = await Event.findById(params?.id);
    if (!existingEvent) {
      return new Response("Event not found", { status: 404 });
    }

    const updateType = request.nextUrl.searchParams.get("type");
    const requestData = await request.json();

    // Using a switch statement to handle different types of updates
    switch (updateType) {
      case "attending":
        existingEvent.attendees = requestData.attendees;
        break;
      case "interested":
        existingEvent.interested = requestData.interested;
        break;
      case "eventImage":
        existingEvent.eventImage = requestData.eventImage;
        break;
      case "uploadedPictures":
        if (existingEvent.uploadedPictures && requestData.originalPictures) {
          existingEvent.uploadedPictures =
            existingEvent.uploadedPictures.filter(
              (picture) => !requestData.originalPictures.includes(picture)
            );
          existingEvent.uploadedPictures.push(...requestData.uploadedPictures);
        } else {
          existingEvent.uploadedPictures = requestData.uploadedPictures;
        }
        break;
      case "deletedPictures":
        if (existingEvent.uploadedPictures && requestData.uploadedPictures) {
          existingEvent.uploadedPictures =
            existingEvent.uploadedPictures.filter(
              (picture) => !requestData.uploadedPictures.includes(picture)
            );
        }
        break;
      default:
        Object.assign(existingEvent, {
          isPublic: requestData.isPublic,
          eventName: requestData.eventName,
          isVirtual: requestData.isVirtual,
          location: requestData.location,
          zoomLink: requestData.zoomLink,
          startDate: new Date(requestData.startDate),
          startTime: requestData.startTime,
          timeZone: requestData.timeZone,
          eventDescription: requestData.eventDescription,
          closestCity: requestData.closestCity,
          lastEdited: Date.now(),
        });
        break;
    }

    await existingEvent.save();
    return new Response(`Successfully updated event's ${updateType}`, {
      status: 200,
    });
  } catch (error) {
    console.error(`Error updating event's ${updateType}`, error);
    return new Response(`Error updating event's ${updateType}`, {
      status: 500,
    });
  }
};

/**
 * This function deletes an event.
 *
 * @param request - The incoming request object
 * @param params - The route parameters
 * @constructor - The function that is called when the route is visited
 */
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Find the existing event by ID
    const existingEvent = await Event.findById(params?.id);

    if (!existingEvent) {
      return new Response("Event not found", { status: 404 });
    }

    // const updateType = request.nextUrl.searchParams.get("type");
    // const requestData = await request.json();

    const messages = await Message.find({ event: existingEvent._id });

    for (const message of messages) {
      await Comment.deleteMany({ message: message._id });
      await message.deleteOne();
    }

    // Delete the event
    await existingEvent.deleteOne();

    return new Response("Successfully deleted the event", { status: 200 });
  } catch (error) {
    console.error(`Error deleting event`, error);
    return new Response(`Error deleting event`, { status: 500 });
  }
};
