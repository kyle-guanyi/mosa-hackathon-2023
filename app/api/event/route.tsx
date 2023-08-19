import { connectToDB } from 'utils/database';
import Event from 'models/event';

export const GET = async (request) => {
    try {
        await connectToDB();

        // populate used for filtering events => use for location?
        const events = await Event.find({}).populate
        ('creator');

        return new Response(JSON.stringify(events), {
            status: 200 })
    }   catch (error) {
        return new Response("Failed to fetch all events", {
            status: 500 })
    }
 
}