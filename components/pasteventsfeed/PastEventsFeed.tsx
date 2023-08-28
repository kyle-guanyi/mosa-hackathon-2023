"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Card from "../eventfeed/EventCard";
import Select from "react-select";

/**
 * This component is used to render a list of event cards.
 *
 * @param data - A list of event JSONs
 * @constructor - Renders a list of event cards
 * @returns A list of event cards
 */
const EventCardList = ({ data }) => {
  return (
    <div className="grid grid-cols-1 pt-8 gap-y-5">
      {data.map((event) => (
        <Card key={event._id} event={event} />
      ))}
    </div>
  );
};

const sortByAllorYours = [
  { value: "All Past Events", label: "All Past Events" },
  { value: "Your Past Events", label: "Your Past Events" },
];

/**
 * This component is used to render a list of past events.
 *
 * @constructor - Renders a list of past events
 * @returns A list of past events
 */
const PastEventsFeed = ({ allEvents }) => {
  // constant containing JSONs of events
  const [events, setEvents] = useState([]);
  const [pastEventType, setPastEventType] = useState("All Past Events");

  // to obtain session ID
  const { data: session } = useSession();

  const [filteredEvents, setFilteredEvents] = useState([]);

  // // obtains all the event JSONs
  // const fetchEvents = async () => {
  //   const response = await fetch("/api/event");
  //   const data = await response.json();
  //   setEvents(data);
  // };

  useEffect(() => {
    setEvents([...allEvents]);
  }, [allEvents]);

  const [userAttendingEventIDs, setUserAttendingEvents] = useState({
    attendingEvents: [],
  });

  // obtains all the event IDs that the user is attending
  useEffect(() => {
    const getUserAttendingEvents = async () => {
      const response = await fetch(`/api/user/${session?.user.id}`);
      const data = await response.json();

      setUserAttendingEvents({
        attendingEvents: data.attendingEvents,
      });
    };

    // only fetches the user's attending events if the user is logged in
    if (session?.user.id) getUserAttendingEvents();
  }, [session?.user.id, allEvents]);

  useEffect(() => {
    // Function to filter events based on user's attending events and date
    const filterEvents = async () => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Sets the time to midnight to ensure we're comparing just the date
      if (pastEventType === "Your Past Events") {
        const pastEvents = events.filter((event) => {
          const eventDate = new Date(event.startDate);

          if (userAttendingEventIDs.attendingEvents.includes(event._id)) {
            return eventDate < currentDate;
          }
        });
        setFilteredEvents(pastEvents);
      } else if (pastEventType === "All Past Events") {
        const pastEvents = events.filter((event) => {
          const eventDate = new Date(event.startDate);

          return eventDate < currentDate;
        });
        setFilteredEvents(pastEvents);
      }
    };
    filterEvents(); // Call the filter function initially
  }, [userAttendingEventIDs, events, pastEventType]);

  return (
    <section
      id="eventfeed"
      className="w-full border-l-1 border-r-1 border-t-1 border-gray-600"
    >
      <div className="p-4 pt-6 flex space-x-4 justify-center text-center">
        <Select
          isSearchable={false}
          options={sortByAllorYours}
          value={sortByAllorYours.find(
            (choice) => choice.value === pastEventType
          )}
          onChange={(e) => setPastEventType(e.value)}
        />
      </div>
      <EventCardList data={filteredEvents} />
    </section>
  );
};

export default PastEventsFeed;
