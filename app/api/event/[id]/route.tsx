import { connectToDB } from "utils/database";
import Event from "models/event";


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

  if (request.nextUrl.searchParams.get("type") === "attendees") {
    return PATCH_ATTENDEES(request, {params});
  } else if (request.nextUrl.searchParams.get("type") === "interested") {
    return PATCH_ATTENDEES(request, {params});
  }

  const { isPublic, eventName, isVirtual, location, zoomLink, startDate, startTime, timeZone, eventDescription } = await request.json();

  try {
    await connectToDB();

    // Find the existing event by ID
    const existingEvent = await Event.findById(params?.id);

    if (!existingEvent) {
      return new Response("Event not found", { status: 404 });
    }

    // Update the user with new data
    existingEvent.isPublic = isPublic;
    existingEvent.eventName = eventName;
    existingEvent.isVirtual = isVirtual;
    existingEvent.location = location;
    existingEvent.zoomLink = zoomLink;
    existingEvent.startDate = startDate;
    existingEvent.startTime = startTime;
    existingEvent.timeZone = timeZone;
    existingEvent.eventDescription = eventDescription;

    await existingEvent.save();

    return new Response("Successfully updated the Event", { status: 200 });
  } catch (error) {
    return new Response("Error Updating Event", { status: 500 });
  }
};

export const PATCH_ATTENDEES = async (request, { params }) => {
  const { attendees } = await request.json();

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
//DELETE (delete)


