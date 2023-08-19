"use client";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Card = ({event, handleTagClick, handleEdit, handleDelete} ) => {

  const startDate = new Date(event.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const redirectToEventPage = () => {
    handleTagClick(event);
  };

  return (
    <div className="prompt_card" onClick={redirectToEventPage}>
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
            {event.startTime}
          </p>
          </div>
          

        </div>
      </div>
    </div>
  );
}

export default Card
