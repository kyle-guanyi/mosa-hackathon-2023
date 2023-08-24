"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import EventForm from "components/EventForm";

const UpdateEvent = ({ params }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [event, setEvent] = useState({
    eventName: "",
    eventDescription: "",
    location: "",
    zoomLink: "",
    isPublic: false,
    isVirtual: false,
    startDate: new Date(),
    startTime: "",
    timeZone: "",
    closestCity: "",
  });

  const [submitting, setIsSubmitting] = useState(false);

  const [isCreator, setIsCreator] = useState(false);

  const getEventDetails = async () => {
    const response = await fetch(`/api/event/${params.id}`);
    const data = await response.json();
    console.log(data);

    setEvent({
      eventName: data.eventName,
      eventDescription: data.eventDescription,
      location: data.location,
      zoomLink: data.zoomLink,
      isPublic: data.isPublic,
      isVirtual: data.isVirtual,
      startDate: data.startDate,
      startTime: data.startTime,
      timeZone: data.timeZone,
      closestCity: data.closestCity,
    });

    if (data.creator === session?.user?.id) {
      setIsCreator(true);
    }
  };

  useEffect(() => {
    if (session) {
      if (params.id) getEventDetails();
    }
  }, [params.id, session]);

  if (!isCreator) {
    return <div>You are not the creator of this event.</div>;
  }

  const updateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("this is the updated event stuff: ", event)
    if (!params.id) return alert("Missing Event Id!");

    try {
      const response = await fetch(`/api/event/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify({
            eventName: event.eventName,
            eventDescription: event.eventDescription,
            location: event.location,
            zoomLink: event.zoomLink,
            isPublic: event.isPublic,
            isVirtual: event.isVirtual,
            startDate: event.startDate,
            startTime: event.startTime,
            timeZone: event.timeZone,
            closestCity: event.closestCity,
        }),
      });

      if (response.ok) {
        router.push(`/event/${params.id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const updateEventImage = async (newEventImage) => {
    setIsSubmitting(true);

    if (!params.id) return alert("Missing Event Id!");

    console.log(newEventImage)
    try {
      const response = await fetch(`/api/event/${params.id}?type=eventImage`, {
        method: "PATCH",
        body: JSON.stringify({
          eventImage: newEventImage,
        }),
      });

    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeysArray = async (keysArray) => {
    updateEventImage(keysArray[0]);
  }

  return (
    <EventForm
      type="Update"
      event={event}
      setEvent={setEvent}
      submitting={submitting}
      handleSubmit={updateEvent}
      handleKeysArray={handleKeysArray}
    />
  );
};

export default UpdateEvent;
