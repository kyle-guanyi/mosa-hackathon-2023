"use client";

import EventPage from "components/eventpage/EventPage";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Event = ({ params }) => {
  const [eventDetails, setEventDetails] = useState([]);
  const [creatorInfo, setCreatorInfo] = useState();
  const [attendeesInfo, setAttendeesInfo] = useState<any[]>([]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`/api/event/${params?.id}`);
      const eventData = await response.json();
      console.log("This is the eventData", eventData)
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

  useEffect(() => {
    const getUserAttendingEvents = async () => {
      const response = await fetch(`/api/user/${session?.user.id}`);
      const data = await response.json();

      setUser({
        attendingEvents: data.attendingEvents,
      });

    };

    if (session?.user.id) getUserAttendingEvents();
  }, [session?.user.id]);

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

      console.log("This is the updated (added) attending events");
      console.log(updatedAttendingEvents);

      const userResponse = await fetch(
        `/api/user/${session?.user.id}?type=attending`,
        {
          method: "PATCH",
          body: JSON.stringify({
            attendingEvents: updatedAttendingEvents,
          }),
        }
      );

      console.log(eventDetails)

      const eventResponse = await fetch(
        `/api/event/${eventDetails._id}?type=attending`,
        {
          method: "PATCH",
          body: JSON.stringify({
            attendees: updatedAttendees,
          }),
        }
      );

      setUser({
        attendingEvents: updatedAttendingEvents,
      });

      setEventDetails(prevEventDetails => ({
        ...prevEventDetails,
        attendees: updatedAttendees,
      }));

    } catch (error) {
      console.log(error);
    } finally {
      fetchEventDetails();
    }
  };

  const handleRemove = async (eventId) => {
    if (!session?.user.id)
      return alert("User is not logged in and does not have a current session");

    if (!user.attendingEvents.includes(eventId)) {
      console.log("Event is already not in user's attending events");
      return;
    }

    try {
      const updatedAttendingEvents = user.attendingEvents.filter(
        (id) => id !== eventId
      );

      const updatedAttendees = eventDetails.attendees.filter(
        (id) => id !== session?.user.id
      );

      console.log("This is the updated (removed) attending events");
      console.log(updatedAttendingEvents);

      const userResponse = await fetch(
        `/api/user/${session?.user.id}?type=attending`,
        {
          method: "PATCH",
          body: JSON.stringify({
            attendingEvents: updatedAttendingEvents,
          }),
        }
      );

      const eventResponse = await fetch(
        `/api/event/${eventDetails._id}?type=attending`,
        {
          method: "PATCH",
          body: JSON.stringify({
            attendees: updatedAttendees,
          }),
        }
      );

      setUser({
        attendingEvents: updatedAttendingEvents,
      });

      setEventDetails(prevEventDetails => ({
        ...prevEventDetails,
        attendees: updatedAttendees,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      fetchEventDetails();
    }
  };

  const handleEdit = (eventId) => {
    router.push(`/update-event/${eventId}`);
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(`/api/event/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh comments after deletion
        router.push("/home")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addImagesToEvent = async (keysArray) => {
    if (eventDetails.uploadedPictures) {
      const updatedPictures = [...eventDetails.uploadedPictures, ...keysArray];
      setEventDetails({ ...eventDetails, uploadedPictures: updatedPictures });
    } else {
      setEventDetails({ ...eventDetails, uploadedPictures: keysArray });
    }
  }

  const updateEventUploadedImages = async () => {
    const response = await fetch(`/api/event/${eventDetails._id}?type=uploadedPictures`, {
      method: "PATCH",
      body: JSON.stringify({
        uploadedPictures: eventDetails.uploadedPictures,
      }),
    });
    
  };

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
    />
  );
};
export default Event;
