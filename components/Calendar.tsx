"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Center, Button } from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons"

/**
 * This component is used to render a calendar.
 *
 * @param handleDate - A function to handle the date
 * @constructor - Renders a calendar
 * @returns A calendar
 */
const Calendar = ( { handleDate, allEvents }) => {
  // constant containing JSONs of events
  const [events, setEvents] = useState([]);

  // to obtain session ID
  const [value, setValue] = useState(null);

  /**
   * This function is used to render an event dot.
   *
   * @param date - A date
   * @returns An event dot
   */
  const renderEventDot = (date) => {
    const dateString = date.toISOString().split("T")[0];

    if (filteredEvents.some((event) => new Date(event.startDate).toISOString().split("T")[0] === dateString)) {
      return <div className="relative justify-center items-center ">
          <div className="event-dot"> </div>
        </div>
    }
    
    return null;
  };

  /**
   * This function is used to change the value of the calendar.
   *
   * @param nextValue - A date
   * @returns A calendar
   */
  function onChange(nextValue) {
    setValue(nextValue);
  }

  /**
   * This function is used to reset the calendar.
   */
  function resetCalendar() {
    setValue(null);
    handleDate(null);
  }

  // to obtain session ID
  const { data: session } = useSession();

  const [filteredEvents, setFilteredEvents] = useState([]);

  /**
   * This function is used to fetch events.
   */
  useEffect(() => {
    setEvents([...allEvents]);
  }, [allEvents]);

  /**
   * This function is used to fetch user attending events.
   */
  const [userAttendingEvents, setUserAttendingEvents] = useState({
    attendingEvents: [],
  });

  useEffect(() => {
    /**
     * This function is used to get user attending events.
     */
    const getUserAttendingEvents = async () => {
      const response = await fetch(`/api/user/${session?.user.id}`);
      const data = await response.json();

      setUserAttendingEvents({
        attendingEvents: data.attendingEvents,
      });
    };
    // If user is logged in, get their attending events
    if (session?.user.id) getUserAttendingEvents();
  }, [session?.user.id, allEvents]);

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
