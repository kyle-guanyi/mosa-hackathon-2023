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

        // Now fetch creator and attendees information
        const creatorResponse = await fetch(`/api/user/${eventData.creator}`);
        const creatorData = await creatorResponse.json();

        const attendeesData = await Promise.all(
          eventData.attendees.map(async (attendeeId) => {
            const attendeeResponse = await fetch(`/api/user/${attendeeId}`);
            return await attendeeResponse.json();
          })
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