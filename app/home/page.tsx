"use client";

import EventFeed from "../../components/eventfeed/EventFeed";
import Calendar from "../../components/Calendar";
import AttendingFeed from "../../components/attendingfeed/AttendingFeed";
import PastEventsFeed from "@/components/pasteventsfeed/PastEventsFeed";
import { Divider, Center } from "@chakra-ui/react";
import { useState } from "react";
import { Heading } from "@chakra-ui/react";

/**
 * This is the home page. It is displayed when the user is logged in.
 * It displays the events the user is attending and the events the user can attend.
 *
 * @constructor - The home page
 * @returns - The home page
 */
const Home = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Handles the date selected by the user
  const handleDate = (nextValue) => {
    if (nextValue == null) {
      setSelectedDate(null);
    } else {
      const date = new Date(nextValue);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      // Output: "2023-08-09"
      const formattedDate = `${year}-${month}-${day}`;
      setSelectedDate(formattedDate);
    }
  };

  return (
    <div className="h-full w-full flex">
      <div
        style={{
          background: "#60759f", // Set the background color
          backgroundSize: "cover",
          height: "100%",
          width: "100%", // Set the background image to cover the entire viewport
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          top: "0",
          left: "0",
          position: "absolute",
          opacity: "80%",
          zIndex: "-9999",
        }}
      />
      <div className="w-1/5">
        <Center className="w-full h-flex flex items-center justify-center">
          <Calendar handleDate={handleDate} />
        </Center>
        <div className=" w-full h-1/2">
          <Divider />
          <Heading className="pt-4 text-center">Your Upcoming Events</Heading>
          <AttendingFeed />
        </div>
      </div>
      <Center className="v-full">
        <Divider orientation="vertical" borderWidth="2px" />
      </Center>
      <div className="w-3/5">
        <div className=" w-full v-full ">
          <EventFeed selectedDate={selectedDate} />
        </div>
      </div>
      <Center className="v-full">
        <Divider orientation="vertical" borderWidth="2px" />
      </Center>
      <div className="w-1/5 hidden md:block ">
        <Heading className="pt-4 text-center">Past Events</Heading>
        <PastEventsFeed />
      </div>
    </div>
  );
};

export default Home;
