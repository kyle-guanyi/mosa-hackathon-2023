// @ts-nocheck
import { connectToDB } from '../../../utils/database';
import Event from '../../../models/event';

/**
 * This function fetches all events.
 *
 * @constructor - The function that is called when the route is visited
 * @returns - A response object
 */
export const GET = async () => {
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