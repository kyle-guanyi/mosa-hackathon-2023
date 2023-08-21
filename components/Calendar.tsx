'use client'

// components/Calendar.tsx
import React, { useEffect, useState } from 'react';
// (session?.user.id)
import { useSession } from "next-auth/react";

import Event from '../models/Event';

type EventDocument = {
    startDate: Date;
    name: string;
    description?: string;
}

const Calendar: React.FC = () => {
    // constant containing JSONs of events
    const [events, setEvents] = useState([]);
  
    // to obtain session ID
    const { data:session } = useSession();

    console.log(session?.user.id);

    const[filteredEvents, setFilteredEvents] = useState([]);

    // obtains all the event JSONs
    const fetchEvents = async () => {
        const response = await fetch('/api/event');
        const data = await response.json();
        setEvents(data);
    }
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
            const filtered = events.filter(event =>
              userAttendingEvents.attendingEvents.includes(event._id)
            );
            setFilteredEvents(filtered);
            console.log("These are the filtered events if I had events");
            console.log(filtered);
          } else {
            // If user is not attending any events, set filteredEvents to the same as events
            console.log("No attending events")
          }
        };
    
        filterEvents(); // Call the filter function initially
      }, [userAttendingEvents, events]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Events Calendar</h1>
            <div className="grid grid-cols-7 gap-4">
                {/* For simplicity, assuming fixed days. You can expand to render a full grid */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-medium">{day}</div>
                ))}
                {events.map(event => (
                    <div key={event._id} className="bg-blue-200 p-2 rounded">
                        {event.name}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Calendar;
