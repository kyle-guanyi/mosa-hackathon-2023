// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SmallerEventCard from "../eventfeed/SmallerEventCard";

/**
 * This component is used to render a list of event cards.
 * It takes in a list of event JSONs and renders an event card for each event.
 *
 * @param data - A list of event JSONs
 * @constructor - Renders a list of event cards
 * @returns A list of event cards
 */
const EventCardList = ({ data }) => {
  return (
    <div className="grid grid-cols-1 pt-8 gap-y-5">
      {data.map((event) => (
        <SmallerEventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

/**
 * This component is used to render a list of events that the user is attending.
 * It takes in a list of event JSONs and renders an event card for each event.
 *
 * @constructor - Renders a list of event cards
 * @returns A list of event cards
 */
const AttendingFeed = ({ allEvents }) => {
  // constant containing JSONs of events
  const [events, setEvents] = useState([]);

  // to obtain session ID
  const { data: session } = useSession();

  // console.log(session?.user.id);

  const [filteredEvents, setFilteredEvents] = useState([]);

  // obtains all the current event JSONs

  useEffect(() => {
    const fetchCurrentEvents = async () => {
      const currentDate = new Date();
      const currentEvents = allEvents.filter((event) => {
        const eventDate = new Date(event.startDate);
        return eventDate >= currentDate;
      });

      setEvents([...currentEvents]);
    };

    fetchCurrentEvents();
  }, [allEvents]);

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
  }, [session?.user.id, allEvents]);

  useEffect(() => {
    // Function to filter events based on user's attending events
    const filterEvents = () => {
      if (userAttendingEventIDs.attendingEvents.length > 0) {
        const filtered = events.filter((event) =>
          userAttendingEventIDs.attendingEvents.includes(event._id)
        );
        setFilteredEvents(filtered);
        // console.log("These are the filtered events if I had events");
        // console.log(filtered);
      } else {
        // If user is not attending any events, set filteredEvents to the same as events
        console.log("success2 No attending events");
      }
    };

    filterEvents(); // Call the filter function initially
  }, [userAttendingEventIDs, events]);
  return <EventCardList data={filteredEvents} />;
};

export default AttendingFeed;
