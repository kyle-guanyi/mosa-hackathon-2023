import { connectToDB } from 'utils/database';
import Event from 'models/event';

export const POST = async (req) => {
    const { eventName,
        eventDescription,
        userId,
        attending,
        interested,
        isPublic,
        isVirtual,
        location,
        zoomLink,
        startDate,
        startTime,
        isCompleted } = await req.json();

    try {
        await connectToDB();
        const newEvent = new Event({
            eventName,
            eventDescription,
            creator: userId,
            attending,
            interested,
            isPublic,
            isVirtual,
            location,
            zoomLink,
            startDate,
            startTime,
            isCompleted,
        })

        await newEvent.save();

        return new Response(JSON.stringify(newEvent), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}
