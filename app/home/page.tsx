"use client";

import EventFeed from "../../components/eventfeed/EventFeed";
import Calendar from "../../components/Calendar";
import AttendingFeed from "../../components/attendingfeed/AttendingFeed";
import Feed from "../../components/search/Feed";
import PastEventsFeed from "@/components/pasteventsfeed/PastEventsFeed";
import { Divider, Center } from "@chakra-ui/react";
import { useState } from "react";
import { Heading } from "@chakra-ui/react";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDate = (nextValue) => {
    if (nextValue == null) {
      setSelectedDate(null);
    } else {
      const date = new Date(nextValue);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;
      console.log(formattedDate); // Output: "2023-08-09"
      setSelectedDate(formattedDate);
    }
  };

  return (
    <div className="h-full w-full flex">
      <div className="w-1/5">
        <Center className="w-full h-flex flex items-center justify-center">
          <Calendar handleDate={handleDate} />
        </Center>
        <div className=" w-full h-1/2">
          <Divider />
          <Heading className="pt-4">Your Upcoming Events</Heading>

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
        <PastEventsFeed />
      </div>
    </div>
  );
};

export default Home;
