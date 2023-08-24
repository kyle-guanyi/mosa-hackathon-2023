"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { DateTime } from "luxon"

const Card = ({ event }) => {
  const router = useRouter();

  const handleEventClick = () => {
    router.push(`/event/${event._id}`);
  };

  const [userEventDateTime, setUserEventDateTime] = useState(null);

  const { data: session } = useSession();

  useEffect(() => {
      if (session?.user.id) {
        const dateTimeObject = DateTime.fromISO(event.UTCEventTime);
        const userTimezone = DateTime.local().zoneName;
        const userEventDateTime = dateTimeObject.setZone(userTimezone);
        setUserEventDateTime(userEventDateTime);
      }
  }, [session?.user.id]);

  return (
    <div className="prompt_card cursor-pointer" onClick={handleEventClick}>
      <div className="flex justify-between items-start gap-5">
        <div className="flex flex-col">
          <h3 className="font-satoshi font-semibold">{event.eventName}</h3>
          <p className="text-xs">{event.location || "Virtual Event"}</p>
          <div className="text-xs justify-between flex">
            <p>{event.startDate.substring(0, 10)}</p>
            <p>
              {event.startTime} {event.timeZone}
            </p>
            <p>
              Event Date: {userEventDateTime?.toFormat("cccc, LLLL d, yyyy")}
            </p>
            <p>Start Time: {userEventDateTime?.toFormat("hh:mm a")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
