"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import EventForm from "components/EventForm";

const CreateEvent = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState({
    eventName: "",
    eventDescription: "",
    location: "",
    zoomLink: "",
    isPublic: false,
    isVirtual: false,
    isCompleted: false,
    interested: [],
    startDate: null,
    startTime: "",
    timeZone: "",
    closestCity: "",
    eventImage: null,
  });

  const [user, setUser] = useState({
    attendingEvents: [],
  });
  
  const createEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    console.log(event);

    try {
      const response = await fetch("/api/event/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
          eventName: event.eventName,
          eventDescription: event.eventDescription,
          attendees: [session?.user.id],
          interested: event.interested,
          isPublic: event.isPublic,
          isVirtual: event.isVirtual,
          startDate: event.startDate,
          startTime: event.startTime,
          timeZone: event.timeZone,
          location: event.location,
          closestCity: event.closestCity,
          zoomLink: event.zoomLink,
          isCompleted: event.isCompleted,
          eventImage: event.eventImage,
        }),
      });

      if (response.ok) {
        const responseData = await response.json(); // Parse the response JSON
        const eventId = responseData._id;
  
        const userDataResponse = await fetch(`/api/user/${session?.user.id}`);
        const userData = await userDataResponse.json();
  
        setUser({
          attendingEvents: userData.attendingEvents,
        });
  
        const updatedAttendingEvents = [...user.attendingEvents, eventId];
  
        const userResponse = await fetch(
          `/api/user/${session?.user.id}?type=attending`,
          {
            method: "PATCH",
            body: JSON.stringify({
              attendingEvents: updatedAttendingEvents,
            }),
          }
        );

        if (userResponse.ok) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeysArray = async (keysArray) => {
    setEvent({ ...event, eventImage: keysArray[0] });
  };

  return (
    <EventForm
      type="Create"
      event={event}
      setEvent={setEvent}
      submitting={submitting}
      handleSubmit={createEvent}
      handleKeysArray={handleKeysArray}
    />
  );
};

export default CreateEvent;
