"use client";

// components/Calendar.tsx
import React, { useEffect, useState } from "react";
// (session?.user.id)
import { useSession } from "next-auth/react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import Event from "../models/Event";

type EventDocument = {
  startDate: Date;
  name: string;
  description?: string;
};

const Calendar = ( { handleDate }) => {
  // constant containing JSONs of events
  const [events, setEvents] = useState([]);

  const [value, setValue] = useState(null);

  // eventDot
  const renderEventDot = (date) => {
    const dateString = date.toISOString().split("T")[0];

    console.log("This is the dateString")
    console.log(dateString); // Add this line
    
    console.log("This is the filteredEvents map")
    console.log(filteredEvents.map(event => new Date(event.startDate).toISOString().split("T")[0])); // Add this line

    if (filteredEvents.some((event) => new Date(event.startDate).toISOString().split("T")[0] === dateString)) {
      return <div className="relative justify-center items-center ">
          <div className="event-dot"> </div>
        </div>
       // CSS class for blue dot
    }
    
    return null;
  };

  function onChange(nextValue) {
    setValue(nextValue);
  }

  function resetCalendar() {
    setValue(null);
    handleDate(null);
  }

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

  const [userAttendingEvents, setUserAttendingEvents] = useState({
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
      if (userAttendingEvents.attendingEvents.length > 0) {
        const filtered = events.filter((event) =>
          userAttendingEvents.attendingEvents.includes(event._id)
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
  }, [userAttendingEvents, events]);

  return (
    <div>
      <ReactCalendar onChange={(nextValue) => {
        onChange(nextValue);
        handleDate(nextValue);
      }}
        value={value} 
        tileContent={({ date }) => renderEventDot(date)}/>
      <button onClick={resetCalendar} className="blue_btn">
        Reset Calendar
      </button>
    </div>
  );
};

export default Calendar;
