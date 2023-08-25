import { connectToDB } from "utils/database";
import Event from "models/event";
import Message from "models/message";
import Comment from "models/comment";

//GET (read)
export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const event = await Event.findById(params?.id);

    if(!event) return new Response("Event not found", {status: 404});

    return new Response(JSON.stringify(event), {status: 200})
  } catch (error) {
    return new Response("Failed to fetch event", { status: 500 })
  }
}

//PATCH (update)

export const PATCH = async (request, { params }) => {

  if (request.nextUrl.searchParams.get("type") === "attending") {
    return PATCH_ATTENDEES(request, {params});
  } else if (request.nextUrl.searchParams.get("type") === "interested") {
    return PATCH_INTERESTED(request, {params});
  } else if (request.nextUrl.searchParams.get("type") === "eventImage") {
    return PATCH_EVENT_IMAGE(request, {params});
  } else if (request.nextUrl.searchParams.get("type") === "uploadedPictures") {
    return PATCH_UPLOADED_PICTURES(request, {params});
  }

  const { isPublic, eventName, isVirtual, location, zoomLink, startDate, startTime, timeZone, eventDescription, closestCity } = await request.json();

  console.log("this is the request: ", new Date(startDate))

  try {
    await connectToDB();


    // Find the existing event by ID
    const existingEvent = await Event.findById(params?.id);

    console.log("this is the existing event:", existingEvent);
    if (!existingEvent) {
      return new Response("Event not found", { status: 404 });
    }

    // Update the event with new data
    existingEvent.isPublic = isPublic;
    existingEvent.eventName = eventName;
    existingEvent.isVirtual = isVirtual;
    existingEvent.location = location;
    existingEvent.zoomLink = zoomLink;
    existingEvent.startDate = new Date(startDate);
    existingEvent.startTime = startTime;
    existingEvent.timeZone = timeZone;
    existingEvent.eventDescription = eventDescription;
    existingEvent.closestCity = closestCity;
    existingEvent.lastEdited = Date.now();

    await existingEvent.save();

    return new Response("Successfully updated the Event", { status: 200 });
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    return new Response("Error Updating Event", { status: 500 });
  }
};

export const PATCH_ATTENDEES = async (request, { params }) => {
  const { attendees } = await request.json();

  console.log("EVENT PATCH ATTENDEES?")
  console.log(attendees)

  try {
    await connectToDB();

    // Find the existing event by ID
    const existingEvent = await Event.findById(params?.id);

    if (!existingEvent) {
      return new Response("Event not found", { status: 404 });
    }

    // update event's attendees
    existingEvent.attendees = attendees;

    await existingEvent.save();

    return new Response("Successfully updated event's attendees", { status: 200 });
  } catch (error) {
    console.error("Error updating event's attendees", error); // Log the error for debugging
    return new Response("Error updating event's attendees", { status: 500 });
  }
};

export const PATCH_INTERESTED = async (request, { params }) => {
  const { interested } = await request.json();

  console.log(interested)

  try {
    await connectToDB();

    // Find the existing event by ID
    const existingEvent = await Event.findById(params?.id);

    if (!existingEvent) {
      return new Response("Event not found", { status: 404 });
    }

    // update event's attendees
    existingEvent.interested = interested;

    await existingEvent.save();

    return new Response("Successfully updated event's interested users", { status: 200 });
  } catch (error) {
    console.error("Error updating event's interested users", error); // Log the error for debugging
    return new Response("Error updating event's interested users", { status: 500 });
  }
};

export const PATCH_EVENT_IMAGE = async (request, { params }) => {
  const { eventImage } = await request.json();

  try {
    await connectToDB();

    // Find the existing event by ID
    const existingEvent = await Event.findById(params?.id);

    if (!existingEvent) {
      return new Response("Event not found", { status: 404 });
    }

    // update event's banner image
    existingEvent.eventImage = eventImage;

    await existingEvent.save();

    return new Response("Successfully updated event's image", { status: 200 });
  } catch (error) {
    console.error("Error updating event's image", error); // Log the error for debugging
    return new Response("Error updating event's image", { status: 500 });
  }
};

export const PATCH_UPLOADED_PICTURES = async (request, { params }) => {
  const { uploadedPictures, originalPictures } = await request.json();

  try {
    await connectToDB();

    // Find the existing event by ID
    const existingEvent = await Event.findById(params?.id);

    if (!existingEvent) {
      return new Response("Event not found", { status: 404 });
    }
    console.log("these are the new pictures", uploadedPictures)
    console.log("these are the existing pictures", existingEvent.uploadedPictures)
    console.log("these are the pictures to be filtered out", existingEvent.originalPictures)
    // filter our old images
    existingEvent.uploadedPictures = existingEvent.uploadedPictures.filter(picture => !originalPictures.includes(picture));
    console.log("after filtering", existingEvent.uploadedPictures)
    // update event's uploaded pictures
    existingEvent.uploadedPictures.push(...uploadedPictures);
    console.log("after adding", existingEvent.uploadedPictures)

    await existingEvent.save();

    return new Response("Successfully updated event's uploaded pictures", { status: 200 });
  } catch (error) {
    console.error("Error updating event's uploaded pictures", error); // Log the error for debugging
    return new Response("Error updating event's uploaded pictures", { status: 500 });
  }
};


//DELETE (delete)
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Find the existing event by ID
    const existingEvent = await Event.findById(params?.id);

    if (!existingEvent) {
      return new Response("Event not found", { status: 404 });
    }

    const messages = await Message.find({ event: existingEvent._id });

    for (const message of messages) {
      await Comment.deleteMany({ message: message._id });
      await message.deleteOne();
    }

    // Delete the event
    await existingEvent.deleteOne();

    return new Response("Successfully deleted the event", { status: 200 });
  } catch (error) {
    console.error("Error deleting event", error); // Log the error for debugging
    return new Response("Error deleting event", { status: 500 });
  }
};

