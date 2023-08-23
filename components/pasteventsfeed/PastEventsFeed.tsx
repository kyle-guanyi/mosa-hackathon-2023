"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Card from "../eventfeed/Card";

const EventCardList = ({ data }) => {
    return (
        <div className="flex-col">
            {data.map((event) => (
                <Card key={event._id} event={event} />
            ))}
        </div>
    );
};

const PastEventsFeed = () => {
    // constant containing JSONs of events
    const [events, setEvents] = useState([]);
    const [pastEventType, setPastEventType] = useState("All Past Events");

    // to obtain session ID
    const { data: session } = useSession();

    console.log(session?.user.id);

    const [filteredEvents, setFilteredEvents] = useState([]);

    // obtains all the event JSONs
    const fetchEvents = async () => {
        const response = await fetch("/api/event");
        const data = await response.json();
        setEvents(data);
    };
    useEffect(() => {
        fetchEvents();
    }, []);

    const [userAttendingEventIDs, setUserAttendingEvents] = useState({
        attendingEvents: [],
    });

    useEffect(() => {
        const getUserAttendingEvents = async () => {
            const response = await fetch(`/api/user/${session?.user.id}`);
            const data = await response.json();

            setUserAttendingEvents({
                attendingEvents: data.attendingEvents,
            });
        };

        if (session?.user.id) getUserAttendingEvents();
    }, [session?.user.id]);

    useEffect(() => {
        // Function to filter events based on user's attending events and date
        const filterEvents = async () => {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);  // Sets the time to midnight to ensure we're comparing just the date
            if (pastEventType === "Your Past Events") {
                const pastEvents = events.filter((event) => {
                    const eventDate = new Date(event.startDate);

                    if (userAttendingEventIDs.attendingEvents.includes(event._id)) {
                        return eventDate < currentDate;
                    }

                })
                setFilteredEvents(pastEvents);
            }
            else if (pastEventType === "All Past Events"){
                const pastEvents = events.filter((event) => {
                    const eventDate = new Date(event.startDate);

                    return eventDate < currentDate;
                })
                setFilteredEvents(pastEvents);
            }
        };
        filterEvents(); // Call the filter function initially

    }, [userAttendingEventIDs, events, pastEventType]);

    return (
        <section id="eventfeed" className="w-full border-l-1 border-r-1 border-t-1 border-gray-600">
            <div className="p-4 flex space-x-4">
                <select
                    value={pastEventType}
                    onChange={(e) => setPastEventType(e.target.value)}
                    className="block appearance-none w-3/5 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="Your Past Events">Your Past Events</option>
                    <option value="All Past Events">All Past Events</option>
                </select>
            </div>
        <EventCardList data={filteredEvents} />
            </section>
        )
}

export default PastEventsFeed;
