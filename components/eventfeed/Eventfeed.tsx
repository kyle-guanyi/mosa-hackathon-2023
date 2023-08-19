//turn event feed into a client component
'use client';
import React from "react";
import Card from "./Card";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

const PromptCardList = ({data, handleTagClick }) => {
    return (
        <div className = "mt-16 prompt_layout">
            {data.map((event) => (
                <Card
                key={event._id}
                event = {event}
                handleTagClick={handleTagClick}
                />
            ))}
        </div> 
    )
}

const Eventfeed = () => {

    const[events, setEvents] = useState([]);

    // used to route to singular event page
    const router = useRouter();

    // fetches data from database and set it to empty array 'events'
    useEffect(() => {
        const fetchEvents = async () => {
            const response = await fetch('/api/event'); //where are we fetching from?
            const data = await response.json();
            setEvents(data); 
        }
        console.log(events);

        fetchEvents();
    }, []);
    
    // redirect to specialized URL of each event
    const handleLocationClick = (event) => {
        console.log("Location");
    }
    return (
        <section
        id ="eventfeed"
        className="w-full border-l-1 border-r-1 border-t-1 border-gray-600">
            <PromptCardList
                data={events}
                handleLocationClick={handleLocationClick}
            />
        </section>
    )
}

export default Eventfeed;