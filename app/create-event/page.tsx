"use client";
import React from 'react';
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Form from "components/Form";

const createEvent = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState({eventName: "", eventDescription: "", location: "", zoomLink:"", isPublic: false, isVirtual: false, isCompleted: false, attending:[], interested:[]});

  const createPrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/event/new", {
        method: "POST",
        body: JSON.stringify({
          creator: session?.user.id,
          eventName: event.eventName,
          eventDescription: event.eventDescription,
          attending: event.attending,
          interested: event.interested,
          isPublic: event.isPublic,
          isVirtual: event.isVirtual,
          startDate: new Date(), // Example value, you may adjust this as needed
          startTime: "12:00 PM", // Example value, you may adjust this as needed
          location: event.location,
          zoomLink: event.zoomLink,
          isCompleted: event.isCompleted,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      type="Create"
      event={event}
      setEvent={setEvent}
      submitting={submitting}
      handleSubmit={createEvent}
    />
  );
};

export default createEvent;
