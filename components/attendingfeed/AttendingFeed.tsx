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

const AttendingFeed = () => {
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
    // Function to filter events based on user's attending events
    const filterEvents = () => {
      if (userAttendingEventIDs.attendingEvents.length > 0) {
        const filtered = events.filter((event) =>
          userAttendingEventIDs.attendingEvents.includes(event._id)
        );
        setFilteredEvents(filtered);
        console.log("These are the filtered events if I had events");
        console.log(filtered);
      } else {
        // If user is not attending any events, set filteredEvents to the same as events
        console.log("No attending events");
      }
    };

    filterEvents(); // Call the filter function initially
  }, [userAttendingEventIDs, events]);
  return <EventCardList data={filteredEvents} />;
};

export default AttendingFeed;