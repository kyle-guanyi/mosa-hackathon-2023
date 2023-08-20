"use client";

import EventPageFormat from "components/eventpage/EventPageFormat";
import { useState, useEffect } from "react";

const Event = ({ params }) => {
  const [eventDetails, setEventDetails] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/event/${params?.id}`);
        const data = await response.json();
        setEventDetails(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };
    if (params?.id) {
      fetchEventDetails();
    }
  }, [params.id]);

  return <EventPageFormat eventDetails={eventDetails} />;
};
export default Event;
