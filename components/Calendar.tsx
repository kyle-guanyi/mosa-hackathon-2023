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
    // constant containing currentUserInfo
    const [userInfo, setUserInfo] = useState();

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


    useEffect(() => {
        try {
            const response = await fetch()
        }
    })

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
