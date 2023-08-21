"use client";

import EventPage from "components/eventpage/EventPage";
import { useState, useEffect } from "react";

const Event = ({ params }) => {
  const [eventDetails, setEventDetails] = useState([]);
  const [creatorInfo, setCreatorInfo] = useState();
  const [attendeesInfo, setAttendeesInfo] = useState<any[]>([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/event/${params?.id}`);
        const eventData = await response.json();

        const [creatorResponse, ...attendeesResponses] = await Promise.all([
          fetch(`/api/user/${eventData.creator}`),
          ...eventData.attendees.map(attendeeId =>
            fetch(`/api/user/${attendeeId}`)
          ),
        ]);
  
        const creatorData = await creatorResponse.json();
        const attendeesData = await Promise.all(
          attendeesResponses.map(response => response.json())
        );

        setEventDetails(eventData);
        setCreatorInfo(creatorData);
        setAttendeesInfo(attendeesData);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };
    if (params?.id) {
      fetchEventDetails();
    }
  }, [params.id]);

  return (
    <EventPage
      eventDetails={eventDetails}
      creatorInfo={creatorInfo}
      attendeesInfo={attendeesInfo}
    />
  );
};
export default Event;