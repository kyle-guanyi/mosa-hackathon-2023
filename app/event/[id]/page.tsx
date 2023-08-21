"use client";

import EventPage from "components/eventpage/EventPage";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
      console.log("This is the current user bout to attend");
      console.log(data);

      setUser({
        attendingEvents: data.attendingEvents,
      });

      console.log(user);
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

      console.log("this is the updated (added) attending events");
      console.log(updatedAttendingEvents);

      const response = await fetch(
        `/api/user/${session?.user.id}?type=attending`,
        {
          method: "PATCH",
          body: JSON.stringify({
            attendingEvents: updatedAttendingEvents,
          }),
        }
      );

      setUser({
        attendingEvents: updatedAttendingEvents,
      });
    } catch (error) {
      console.log(error);
    } finally {
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

      console.log("this is the updated (removed) attending events");
      console.log(updatedAttendingEvents);

      const response = await fetch(
        `/api/user/${session?.user.id}?type=attending`,
        {
          method: "PATCH",
          body: JSON.stringify({
            attendingEvents: updatedAttendingEvents,
          }),
        }
      );

      setUser({
        attendingEvents: updatedAttendingEvents,
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <EventPage
      eventDetails={eventDetails}
      creatorInfo={creatorInfo}
      attendeesInfo={attendeesInfo}
      user={user}
      setUser={setUser}
      handleAdd={handleAdd}
      handleRemove={handleRemove}
    />
  );
};
export default Event;
