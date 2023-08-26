"use client";

// components/Calendar.tsx
import React, { useEffect, useState } from "react";
// (session?.user.id)
import { useSession } from "next-auth/react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Center, Button } from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons"

const Calendar = ( { handleDate }) => {
  // constant containing JSONs of events
  const [events, setEvents] = useState([]);

  const [value, setValue] = useState(null);

  

  // eventDot
  const renderEventDot = (date) => {
    const dateString = date.toISOString().split("T")[0];

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
      } else {
        // If user is not attending any events, set filteredEvents to the same as events
        console.log("No attending events");
      }
    };

    filterEvents(); // Call the filter function initially
  }, [userAttendingEvents, events]);

  return (
    <Center className="flex-col gap-2 pb-4 pt-4">
      <ReactCalendar onChange={(nextValue) => {
        onChange(nextValue);
        handleDate(nextValue);
      }}
        value={value} 
        tileContent={({ date }) => renderEventDot(date)}/>
      <Button onClick={resetCalendar} className="hover:opacity-80" colorScheme="facebook" rightIcon={<RepeatClockIcon/>}
                          isActive="true" >
        Reset Calendar
      </Button>
    </Center>
  );
};

export default Calendar;
