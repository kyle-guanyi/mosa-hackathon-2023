"use client"

import EventFeed from "../../components/eventfeed/EventFeed";
import Calendar from "../../components/Calendar";
import AttendingFeed from "../../components/attendingfeed/AttendingFeed";
import Feed from '../../components/search/Feed';
import PastEventsFeed from "@/components/pasteventsfeed/PastEventsFeed";

import { useState } from "react";

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
    <div className="h-screen w-full bg-red-500 flex">
      <div className="w-1/5 bg-blue-500">
        <div className="w-full h-1/2 bg-yellow-500"><Calendar handleDate={handleDate} /></div>
        <div className=" w-full h-1/2 bg-orange-500"><AttendingFeed /></div>
      </div>
      <div className="w-3/5 bg-green-700 flex-grow">
        <div className="w-full h-1/10 bg-green-500"></div>
        <div className=" w-full h-5/6 bg-blue-500"><EventFeed selectedDate={selectedDate}/></div>
      </div>
      <div className="w-1/5 bg-purple-700 hidden md:block "><PastEventsFeed /></div>
    </div>
  );
};

export default Home;
