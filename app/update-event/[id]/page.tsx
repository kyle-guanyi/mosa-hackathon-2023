'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import EventForm from "components/EventForm";

/**
 * This is the page for updating an event.
 *
 * @param params - The event id
 * @constructor - The update event page
 * @returns - The update event page
 */
const UpdateEvent = ({ params }) => {
  const router = useRouter();
  const { data: session } = useSession();

  // The event details
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

  /**
   * This function fetches the event details from the database and displays them.
   */
  const getEventDetails = async () => {
    const response = await fetch(`/api/event/${params.id}`);
    const data = await response.json();

    // Set the event details
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

    // Check if the user is the creator of the event
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

  /**
   * This function updates the event details in the database.
   *
   * @param e - The event
   * @returns - The updated event page
   */
  const updateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if the event name is empty
    if (!params.id) return alert("Missing Event Id!");

    // Update the event details in the database
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

  /**
   * This function updates the event image in the database.
   *
   * @param newEventImage - The new event image
   * @returns - The updated event page
   */
  const updateEventImage = async (newEventImage) => {
    setIsSubmitting(true);

    // Check if the event name is empty
    if (!params.id) return alert("Missing Event Id!");

    // Update the event image in the database
    try {
      await fetch(`/api/event/${params.id}?type=eventImage`, {
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

  /**
   * This function handles the keys array.
   *
   * @param keysArray - The keys array
   * @returns - The updated event page
   */
  const handleKeysArray = async (keysArray) => {
    updateEventImage(keysArray[0]);
  }

  // Display the event form
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
