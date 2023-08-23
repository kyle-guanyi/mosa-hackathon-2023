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

    // useEffect(() => {
    //     const getUserAttendingEvents = async () => {
    //         const response = await fetch(`/api/user/${session?.user.id}`);
    //         const data = await response.json();
    //
    //         setUserAttendingEvents({
    //             attendingEvents: data.attendingEvents,
    //         });
    //     };
    //
    //     if (session?.user.id) getUserAttendingEvents();
    // }, [session?.user.id]);

    // useEffect(() => {
    //     // Function to filter events based on user's attending events
    //     const filterEvents = () => {
    //         if (userAttendingEventIDs.attendingEvents.length > 0) {
    //             const filtered = events.filter((event) =>
    //                 userAttendingEventIDs.attendingEvents.includes(event._id)
    //             );
    //             setFilteredEvents(filtered);
    //             console.log("These are the filtered events if I had events");
    //             console.log(filtered);
    //         } else {
    //             // If user is not attending any events, set filteredEvents to the same as events
    //             console.log("No attending events");
    //         }
    //     };
    //
    //     filterEvents(); // Call the filter function initially
    // }, [userAttendingEventIDs, events]);

    useEffect(() => {
        // Function to filter events based on user's attending events and date
        const filterEvents = async () => {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);  // Sets the time to midnight to ensure we're comparing just the date
            console.log("Current date:", currentDate)
            const pastEvents = events.filter((event) => {
                const eventDate = new Date(event.startDate);
                console.log("Event date:", eventDate)
                return eventDate < currentDate;
            })
            setFilteredEvents(pastEvents);
                // const eventDate = new Date(eventDateStr);
                //
                // console.log("Event date what is eventDATE:", eventDateStr)
                // // convert 2023-08-09T00:00:00.000+00:00 to date object
                // const timestampString = '2023-08-09T00:00:00.000+00:00';
                // const convertedDate = new Date(timestampString); // The converted date
                // console.log("Converted Date", convertedDate);
                // console.log("EVENT DATE", eventDate);
                // if (eventDate < currentDate) {
                //     console.log("Event is in the past", eventDate);
                // }
                // return eventDate < currentDate;

            };

        //     if (userAttendingEventIDs.attendingEvents.length > 0) {
        //         const filtered = events.filter((event) =>
        //             userAttendingEventIDs.attendingEvents.includes(event._id)
        //         );
        //
        //         // Find events that need to be updated in the DB
        //         const eventsToUpdate = filtered.filter(event => isEventInPast(event.date) && !event.isComplete);
        //         await Promise.all(eventsToUpdate.map(updateEventInDB));
        //
        //         setFilteredEvents(filtered.filter(event => isEventInPast(event.date)));
        //         // console.log("These are the filtered events if I had events");
        //         // console.log(filtered);
        //     } else {
        //         // If user is not attending any events, set filteredEvents to the same as events
        //         // console.log("No attending events");
        //     }
        // };

        // Function to update an event in the database
        // const updateEventInDB = async (event) => {
        //     try {
        //         await fetch(`/api/event/${event._id}`, {
        //             method: 'PUT',
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify({
        //                 isComplete: true
        //             })
        //         });
        //     } catch (error) {
        //         console.error("Error updating event:", error);
        //     }
        // };

        filterEvents(); // Call the filter function initially
    }, [userAttendingEventIDs, events]);



    return <EventCardList data={filteredEvents} />;
};



export default PastEventsFeed;
