'use client';
import React from 'react'

import EventPageFormat from "components/eventpage/EventPageFormat";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const EventPage = ({ params }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const[eventDetails, setEventDetails] = useState(null); // start with null because fetching single event
    const eventId = searchParams.get('id');


    useEffect(() => {
        const getEventDetails = async () => {
            try {
                const response = await fetch (`/api/event/${params?.id}`)
                const data = await response.json();
                setEventDetails(data)

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
            {eventDetails && (
                <EventPageFormat
                    event={eventDetails}
            // Pass any additional props or handlers here
                />
        )}
      </section>
    );
        
};
export default EventPage;