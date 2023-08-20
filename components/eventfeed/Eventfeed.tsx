//turn event feed into a client component
'use client';
import React from "react";
import Card from "./Card";
import { useState, useEffect } from 'react';

const EventCardList = ({data}) => {
    return (
        <div className = "mt-16 prompt_layout">
            {data.map((event) => (
                <Card
                key={event._id}
                event = {event}
                />
            ))}
        </div> 
    )
}

const Eventfeed = () => {

    const[events, setEvents] = useState([]);

    const fetchEvents = async () => {
        const response = await fetch('/api/event');
        const data = await response.json();
        setEvents(data); 
    }
    // fetches data from database and set it to empty array 'events'
    useEffect(() => {
        fetchEvents();
    }, []);
    


    return (
        <section
        id ="eventfeed"
        className="w-full border-l-1 border-r-1 border-t-1 border-gray-600">
            <EventCardList
                data={events}
            />
        </section>
    )
}

export default Eventfeed;