"use client";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Card = ({event} ) => {

  const startDate = new Date(event.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const router = useRouter();

  const handleEventClick = () => {
    router.push(`/event/${event._id}`)
  };

  return (
    <div className="prompt_card cursor-pointer" onClick={handleEventClick}>
      <div className = "flex justify-between items-start gap-5">
        <div className = "flex flex-col">
          <h3 className = "font-satoshi font-semibold">
            {event.eventName}
          </h3>
          <p className = "text-xs">
            {event.location || "Virtual Event"} 
          </p>
          <div className = "text-xs justify-between flex">
          <p>
            {startDate} 
          </p>
          <p>
            {event.startTime} {event.timeZone}
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card
