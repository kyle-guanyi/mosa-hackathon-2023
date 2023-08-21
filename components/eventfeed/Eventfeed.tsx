'use client';
import React, { useState, useEffect } from "react";
import Card from "./Card";

const EventCardList = ({data}) => {
    return (
        <div className="mt-16 prompt_layout">
            {data.map((event) => (
                <Card
                    key={event._id}
                    event={event}
                />
            ))}
        </div>
    );
}

const Eventfeed = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [filterCity, setFilterCity] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterVirtual, setFilterVirtual] = useState('');

    const fetchEvents = async () => {
        const response = await fetch('/api/event');
        const data = await response.json();
        setEvents(data);
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        Object.values(events).forEach(event => {
            console.log("this is the event start date")
            console.log(event.startDate.substring(0,10));
            console.log("this is the filtered date")
            console.log(filterDate);
        
            // You can perform further actions here using event.startDate and filterDate
            // For example, compare the dates and decide what to do with the event
          });

        const results = Object.values(events).filter(event =>
            event.closestCity.includes(filterCity) &&
            (!filterDate || event.startDate.substring(0,10) === filterDate) &&
            (filterVirtual === '' || event.isVirtual.toString() === filterVirtual)
        );
        setFilteredEvents(results);
    }, [events, filterCity, filterDate, filterVirtual]);

        return (
            <section id="eventfeed" className="w-full border-l-1 border-r-1 border-t-1 border-gray-600">
                <div className="p-4 flex space-x-4">
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
                        <option value="">Select City</option>
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
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="appearance-none block w-1/4 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <EventCardList data={filteredEvents} />
            </section>
        );
    }

    export default Eventfeed;

