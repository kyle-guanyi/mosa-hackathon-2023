import { connectToDB } from 'utils/database';
import Event from 'models/event';

export const POST = async (request) => {
    const { eventName,
        eventDescription,
        userId,
        attendees,
        interested,
        isPublic,
        isVirtual,
        location,
        closestCity,
        zoomLink,
        startDate,
        startTime,
        timeZone,
        isCompleted,
        eventImage } = await request.json();

    try {
        await connectToDB();
        const newEvent = new Event({
            eventName,
            eventDescription,
            creator: userId,
            attendees,
            interested,
            isPublic,
            isVirtual,
            location,
            closestCity,
            zoomLink,
            startDate,
            startTime,
            timeZone,
            isCompleted,
            eventImage,
        })

        await newEvent.save();

        return new Response(JSON.stringify(newEvent), { status: 201 })
    } catch (error) {
        console.log(error);
        return new Response("Failed to create a new event", { status: 500 });
    }
}



