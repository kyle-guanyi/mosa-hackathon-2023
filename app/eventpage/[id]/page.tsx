'use client';
import React from 'react'

import EventPageFormat from "components/eventpage/EventPageFormat";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const EventPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const[event, setEvent] = useState(null); // start with null because fetching single event
    const eventId = searchParams.get('id');


    useEffect(() => {
        const getEventDetails = async () => {
            try {
                const response = await fetch (`/api/event/${eventId}`)
                const data = await response.json();
                setEvent(data)

            } catch (error) {
                console.error("Error fetching event details:", error);
            }
            
           
        };
        if(eventId)  {
            getEventDetails()
        }
    }, [eventId])

    return (
        <section id="eventpage" className="w-full border-l-1 border-r-1 border-t-1 border-gray-600">
            {event && (
                <EventPageFormat
                    event={event}
            // Pass any additional props or handlers here
                />
        )}
      </section>
    );
        
};
export default EventPage;