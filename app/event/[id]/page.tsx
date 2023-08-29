// @ts-nocheck
"use client";

import EventPage from "components/eventpage/EventPage";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";

/**
 * This is the page for a specific event.
 * It fetches the event details from the database, creator and attendees' details and displays them.
 * It also allows the user to add or remove the event from their attending events.
 * It also allows the user to edit or delete the event if they are the creator.
 * It also allows the user to add images to the event.
 *
 * @param params - The event id
 * @constructor - The event page
 * @returns - The event page
 */
const Event = ({ params }) => {
  const [eventDetails, setEventDetails] = useState([]);
  const [creatorInfo, setCreatorInfo] = useState();
  const [attendeesInfo, setAttendeesInfo] = useState<any[]>([]);

  // Fetches the event details from the database, creator and attendees' details
  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`/api/event/${params?.id}`);
      const eventData = await response.json();
      const [creatorResponse, ...attendeesResponses] = await Promise.all([
        fetch(`/api/user/${eventData.creator}`),
        ...eventData.attendees.map((attendeeId) =>
          fetch(`/api/user/${attendeeId}`)
        ),
      ]);

      const creatorData = await creatorResponse.json();
      const attendeesData = await Promise.all(
        attendeesResponses.map((response) => response.json())
      );

      setEventDetails(eventData);
      setCreatorInfo(creatorData);
      setAttendeesInfo(attendeesData);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  // Fetches the event details from the database, creator and attendees' details
  useEffect(() => {
    if (params?.id) {
      fetchEventDetails();
    }
  }, [params.id]);

  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState({
    attendingEvents: [],
  });

  // Fetches the user's attending events
  useEffect(() => {
    const getUserAttendingEvents = async () => {
      const response = await fetch(`/api/user/${session?.user.id}`);
      const data = await response.json();

      setUser({
        attendingEvents: data.attendingEvents,
      });
    };
    // If the user is logged in, fetch their attending events
    if (session?.user.id) getUserAttendingEvents();
  }, [session?.user.id]);

  /**
   * Adds the event to the user's attending events
   *
   * @param eventId - The event id
   * @returns - The updated user's attending events
   */
  const handleAdd = async (eventId) => {
    if (!session?.user.id)
      return alert("User is not logged in and does not have a current session");

    if (user.attendingEvents.includes(eventId)) {
      console.log("Event is already added to user's attending events");
      return;
    }

    try {
      const updatedAttendingEvents = [...user.attendingEvents, eventId];
      const updatedAttendees = [...eventDetails.attendees, session?.user.id];
      await fetch(`/api/user/${session?.user.id}?type=attending`, {
        method: "PATCH",
        body: JSON.stringify({
          attendingEvents: updatedAttendingEvents,
        }),
      });
      await fetch(`/api/event/${eventDetails._id}?type=attending`, {
        method: "PATCH",
        body: JSON.stringify({
          attendees: updatedAttendees,
        }),
      });
      setUser({
        attendingEvents: updatedAttendingEvents,
      });

      setEventDetails((prevEventDetails) => ({
        ...prevEventDetails,
        attendees: updatedAttendees,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      fetchEventDetails();
    }
  };

  const toast = useToast();

  /**
   * Removes the event from the user's attending events
   *
   * @param eventId - The event id
   * @returns - The updated user's attending events
   */
  const handleRemove = async (eventId) => {
    if (!session?.user.id)
      return alert("User is not logged in and does not have a current session");

    if (!user.attendingEvents.includes(eventId)) {
      console.log("Event is already not in user's attending events");
      return;
    }

    if (session?.user.id === creatorInfo._id) {
      toast({
        title: "Unable to remove yourself (the host) from the event",
        description: "To proceed, you need to delete the event",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      const updatedAttendingEvents = user.attendingEvents.filter(
        (id) => id !== eventId
      );

      const updatedAttendees = eventDetails.attendees.filter(
        (id) => id !== session?.user.id
      );

      // Update the user's attending events and the event's attendees
      await fetch(`/api/user/${session?.user.id}?type=attending`, {
        method: "PATCH",
        body: JSON.stringify({
          attendingEvents: updatedAttendingEvents,
        }),
      });
      await fetch(`/api/event/${eventDetails._id}?type=attending`, {
        method: "PATCH",
        body: JSON.stringify({
          attendees: updatedAttendees,
        }),
      });
      setUser({
        attendingEvents: updatedAttendingEvents,
      });

      setEventDetails((prevEventDetails) => ({
        ...prevEventDetails,
        attendees: updatedAttendees,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      fetchEventDetails();
    }
  };

  /**
   * Redirects the user to the edit event page
   *
   * @param eventId - The event id
   * @returns - The edit event page
   */
  const handleEdit = (eventId) => {
    router.push(`/update-event/${eventId}`);
  };

  // Deletes the event
  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(`/api/event/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh comments after deletion
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Adds the images to the event
   *
   * @param keysArray - The array of image keys
   * @returns - The updated event details
   */
  const addImagesToEvent = async (keysArray) => {
    if (eventDetails.uploadedPictures) {
      const updatedPictures = [...eventDetails.uploadedPictures, ...keysArray];
      setEventDetails({ ...eventDetails, uploadedPictures: updatedPictures });
    } else {
      setEventDetails({ ...eventDetails, uploadedPictures: keysArray });
    }
  };

  /**
   * Updates the event uploaded images
   */
  const updateEventUploadedImages = async () => {
    await fetch(`/api/event/${eventDetails._id}?type=uploadedPictures`, {
      method: "PATCH",
      body: JSON.stringify({
        uploadedPictures: eventDetails.uploadedPictures,
      }),
    });
  };

  // Updates the event uploaded images
  useEffect(() => {
    if (eventDetails?.uploadedPictures) {
      updateEventUploadedImages();
    }
  }, [eventDetails?.uploadedPictures]);

  return (
    <EventPage
      eventDetails={eventDetails}
      creatorInfo={creatorInfo}
      attendeesInfo={attendeesInfo}
      user={user}
      handleAdd={handleAdd}
      handleRemove={handleRemove}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      addImagesToEvent={addImagesToEvent}
      fetchEventDetails={fetchEventDetails}
    />
  );
};
export default Event;
