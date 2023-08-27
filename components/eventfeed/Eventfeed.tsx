"use client";
import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { Heading } from "@chakra-ui/react";

const EventCardList = ({ data }) => {
  return (
    <div className="mt-8 gap-y-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {data.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

const EventFeed = ({ selectedDate, allEvents }) => {
  const [fetchedAllEvents, setFetchedAllEvents] = useState(allEvents);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterCity, setFilterCity] = useState("");
  const [filterVirtual, setFilterVirtual] = useState("");
  const [sortOption, setSortOption] = useState(true);

  useEffect(() => {
    setFetchedAllEvents(allEvents);
  }, [allEvents])

  useEffect(() => {
    console.log("All the events:", allEvents);
  }, [allEvents]); // Add allEvents as a dependency

  useEffect(() => {
    console.log("All the pass into events:", allEvents);
  }, [fetchedAllEvents]); // Add allEvents as a dependency

  // const fetchEvents = async () => {
  //   const response = await fetch("/api/event");
  //   const data = await response.json();
  //   const currentDate = new Date();
  //   const currentEvents = data.filter((event) => {
  //     const eventDate = new Date(event.startDate);
  //     return eventDate >= currentDate;
  //   });
  //   setEvents(currentEvents);
  // };

  // useEffect(() => {
  //   fetchEvents();
  // }, []);


  const filterCurrentEvents = async () => {
    const currentDate = new Date();
    const currentEvents = fetchedAllEvents.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate >= currentDate;
    });
    setCurrentEvents(currentEvents);
  }

  useEffect(() => {
    filterCurrentEvents();
  }, [fetchedAllEvents]);

  // useEffect(() => {
  //   const results = Object.values(currentEvents).filter((event) => {
  //     const isDateMatching =
  //       !selectedDate || event.startDate.substring(0, 10) === selectedDate;
  //     // console.log("This is the event date:", event.startDate.substring(0, 10));
  //     // console.log("This is my selected date:", selectedDate);

  //     if (
  //       event.closestCity.includes(filterCity) &&
  //       isDateMatching &&
  //       (filterVirtual === "" || event.isVirtual.toString() === filterVirtual)
  //     ) {
  //       return true;
  //     }
  //   });

  //   if (sortOption) {
  //     const sortedEvents = [...results].sort((a, b) => {
  //       const dateA = new Date(a.startDate);
  //       const dateB = new Date(b.startDate);
  //       return dateA - dateB;
  //     });
  //     setFilteredEvents(sortedEvents);
  //   } else {
  //     const sortedEvents = [...results].reverse();
  //     setFilteredEvents(sortedEvents);
  //   }
  // }, [currentEvents, filterCity, selectedDate, filterVirtual, sortOption]);

  return (
    <section
      id="eventfeed"
      className="w-full border-l-1 border-r-1 border-t-1 border-gray-600"
    >
      <Heading className="justify-center text-center pb-4 pt-4"> Event Feed </Heading>
      <div className="flex space-x-8 justify-center text-center">
        <select
          value={filterVirtual}
          onChange={(e) => setFilterVirtual(e.target.value)}
          className="block appearance-none w-1/4 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Event Type</option>
          <option value="true">Virtual Event</option>
          <option value="false">In-Person Event</option>
        </select>
        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="block appearance-none w-1/4 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select City/Major Region</option>
          <option value="Africa">Africa</option>
          <option value="Atlanta">Atlanta</option>
          <option value="Austin">Austin</option>
          <option value="Australia">Australia</option>
          <option value="Bay Area">Bay Area</option>
          <option value="Berlin">Berlin</option>
          <option value="Boston">Boston</option>
          <option value="CDMX">CDMX</option>
          <option value="Chicago">Chicago</option>
          <option value="China">China</option>
          <option value="Colorado">Colorado</option>
          <option value="DC">DC</option>
          <option value="DFW">DFW</option>
          <option value="Europe">Europe</option>
          <option value="Florida">Florida</option>
          <option value="Hong Kong">Hong Kong</option>
          <option value="Houston">Houston</option>
          <option value="India">India</option>
          <option value="Indonesia">Indonesia</option>
          <option value="Japan">Japan</option>
          <option value="Korea">Korea</option>
          <option value="Latin America">Latin America</option>
          <option value="London">London</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="Midwest">Midwest</option>
          <option value="Montreal">Montreal</option>
          <option value="Nankai">Nankai</option>
          <option value="New Jersey">New Jersey</option>
          <option value="New Zealand">New Zealand</option>
          <option value="NYC">NYC</option>
          <option value="Philippines">Philippines</option>
          <option value="Philly">Philly</option>
          <option value="Portland PDX">Portland PDX</option>
          <option value="Salt Lake City">Salt Lake City</option>
          <option value="Seattle">Seattle</option>
          <option value="Singapore">Singapore</option>
          <option value="Toronto">Toronto</option>
          <option value="Vancouver">Vancouver</option>
          <option value="Vietnam">Vietnam</option>
        </select>
        <select
          value={sortOption.toString()}
          onChange={(e) => setSortOption(e.target.value === "true")}
          className="block appearance-none w-1/4 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="true">Upcoming Events</option>
          <option value="false">Recently Added Events</option>
        </select>
      </div>
      <EventCardList data={filteredEvents} />
    </section>
  );
};

export default EventFeed;
