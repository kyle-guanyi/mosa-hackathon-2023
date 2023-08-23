import Link from "next/link";
import Dropdown from "./Dropdown";
import React, { useState, useEffect } from "react";
import Select from "react-select";


const Timezones = [
  { value: "UTC-12:00 - International Date Line West (IDLW)", label: "UTC-12:00 - International Date Line West (IDLW)"},
  { value: "UTC-11:00 - Niue Time (NUT), Samoa Standard Time (SST)", label: "UTC-11:00 - Niue Time (NUT), Samoa Standard Time (SST)"},
  { value: "UTC-09:30 - Marquesas Islands Time (MART)", label: "UTC-09:30 - Marquesas Islands Time (MART)"},
  { value: "UTC-09:00 - Alaska Standard Time (AKST)", label: "UTC-09:00 - Alaska Standard Time (AKST)"},
  { value: "UTC-08:00 - Pacific Standard Time (PST)", label: "UTC-08:00 - Pacific Standard Time (PST)"},
  { value: "UTC-07:00 - Mountain Standard Time (MST)", label: "UTC-07:00 - Mountain Standard Time (MST)"},
  { value: "UTC-06:00 - Central Standard Time (CST)", label: "UTC-06:00 - Central Standard Time (CST)"},
  { value: "UTC-05:00 - Eastern Standard Time (EST)", label: "UTC-05:00 - Eastern Standard Time (EST)"},
  { value: "UTC-04:00 - Atlantic Standard Time (AST)", label: "UTC-04:00 - Atlantic Standard Time (AST)"},
  { value: "UTC-03:30 - Newfoundland Standard Time (NST)", label: "UTC-03:30 - Newfoundland Standard Time (NST)"},
  { value: "UTC-03:00 - Amazon Standard Time (AMT)", label: "UTC-03:00 - Amazon Standard Time (AMT)"},
  { value: "UTC-02:00 - Fernando de Noronha Time (FNT)", label: "UTC-02:00 - Fernando de Noronha Time (FNT)"},
  { value: "UTC-01:00 - Azores Standard Time (AZOST)", label: "UTC-01:00 - Azores Standard Time (AZOST)"},
  { value: "UTC+00:00 - Greenwich Mean Time (GMT)", label: "UTC+00:00 - Greenwich Mean Time (GMT)"},
  { value: "UTC+01:00 - Central European Time (CET)", label: "UTC+01:00 - Central European Time (CET)"},
  { value: "UTC+02:00 - Eastern European Time (EET)", label: "UTC+02:00 - Eastern European Time (EET)"},
  { value: "UTC+03:00 - Moscow Standard Time (MSK)", label: "UTC+03:00 - Moscow Standard Time (MSK)"},
  { value: "UTC+03:30 - Iran Standard Time (IRST)", label: "UTC+03:30 - Iran Standard Time (IRST)"},
  { value: "UTC+04:00 - Gulf Standard Time (GST)", label: "UTC+04:00 - Gulf Standard Time (GST)"},
  { value: "UTC+04:30 - Afghanistan Time (AFT)", label: "UTC+04:30 - Afghanistan Time (AFT)"},
  { value: "UTC+05:00 - Pakistan Standard Time (PKT)", label: "UTC+05:00 - Pakistan Standard Time (PKT)"},
  { value: "UTC+05:30 - Indian Standard Time (IST)", label: "UTC+05:30 - Indian Standard Time (IST)"},
  { value: "UTC+05:45 - Nepal Time (NPT)", label: "UTC+05:45 - Nepal Time (NPT)"},
  { value: "UTC+06:00 - Bangladesh Time (BST)", label: "UTC+06:00 - Bangladesh Time (BST)"},
  { value: "UTC+06:30 - Myanmar Time (MMT)", label: "UTC+06:30 - Myanmar Time (MMT)"},
  { value: "UTC+07:00 - Indochina Time (ICT)", label: "UTC+07:00 - Indochina Time (ICT)"},
  { value: "UTC+08:00 - China Standard Time (CST)", label: "UTC+08:00 - China Standard Time (CST)"},
  { value: "UTC+08:45 - Southeastern Western Australia Standard Time (CWST)", label: "UTC+08:45 - Southeastern Western Australia Standard Time (CWST)"},
  { value: "UTC+09:00 - Japan Standard Time (JST)", label: "UTC+09:00 - Japan Standard Time (JST)"},
  { value: "UTC+09:30 - Australian Central Standard Time (ACST)", label: "UTC+09:30 - Australian Central Standard Time (ACST)"},
  { value: "UTC+10:00 - Japan Standard Time(JST), Korea Standard Time (KST)", label: "UTC+10:00 - Japan Standard Time(JST), Korea Standard Time (KST)"},
  { value: "UTC+10:30 - Lord Howe Standard Time (LHST)", label: "UTC+10:30 - Lord Howe Standard Time (LHST)"},
  { value: "UTC+11:00 - Solomon Islands Time (SBT)", label: "UTC+11:00 - Solomon Islands Time (SBT)"},
  { value: "UTC+11:30 - Norfolk Island Time (NFT)", label: "UTC+11:30 - Norfolk Island Time (NFT)"},
  { value: "UTC+12:00 - New Zealand Standard Time (NZST)", label: "UTC+12:00 - New Zealand Standard Time (NZST)"},
  { value: "UTC+12:45 - Chatham Standard Time (CHAST)", label: "UTC+12:45 - Chatham Standard Time (CHAST)"},
  { value: "UTC+13:00 - Tonga Time (TOT)", label: "UTC+13:00 - Tonga Time (TOT)"},
  { value: "UTC+14:00 - Line Island Time (LINT)", label: "UTC+14:00 - Line Island Time (LINT)"},

];

const ClosestCity = [
  { value: "Africa", label: "Africa"},
  { value: "Alberta", label: "Alberta"},
  { value: "Atlanta", label: "Atlanta"},
  { value: "Austin", label: "Austin"},
  { value: "Australia", label: "Australia"},
  { value: "Bay Area", label: "Bay Area"},
  { value: "Berlin", label: "Berlin"},
  { value: "Boston", label: "Boston"},
  { value: "CDMX", label: "CDMX"},
  { value: "Chicago", label: "Chicago"},
  { value: "China", label: "China"},
  { value: "Connecticut", label: "Connecticut"},
  { value: "DC", label: "DC"},
  { value: "Colorado", label: "Colorado"},
  { value: "DFW", label: "DFW"},
  { value: "Europe", label: "Europe"},
  { value: "Florida", label: "Florida"},
  { value: "Hong Kong", label: "Hong Kong"},
  { value: "Houston", label: "Houston"},
  { value: "India", label: "India"},
  { value: "Indonesia", label: "Indonesia"},
  { value: "Japan", label: "Japan"},
  { value: "Korea", label: "Korea"},
  { value: "Latin America", label: "Latin America"},
  { value: "London", label: "London"},
  { value: "Los Angeles", label: "Los Angeles"},
  { value: "Midwest", label: "Midwest"},
  { value: "Montreal", label: "Montreal"},
  { value: "Nankai", label: "Nankai"},
  { value: "New Jersey", label: "New Jersey"},
  { value: "New Zealand", label: "New Zealand"},
  { value: "NYC", label: "NYC"},
  { value: "Philippines", label: "Philippines"},
  { value: "Philly", label: "Philly"},
  { value: "Portland PDX", label: "Portland PDX"},
  { value: "Salt Lake City", label: "Salt Lake City"},
  { value: "Seattle", label: "Seattle"},
  { value: "Singapore", label: "Singapore"},
  { value: "Toronto", label: "Toronto"},
  { value: "Vancouver", label: "Vancouver"},
  { value: "Vietnam", label: "Vietnam"},

]; 


// @ts-ignore
const EventForm = ({ type, event, setEvent, submitting, handleSubmit }) => {

  return (
    <section className="w-full max-w-full flex-start flex-col mx-auto">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Post </span>
      </h1>
      <p className="desc text-left max-w-md">{type} your event here.</p>
      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Event Name
          </span>
          <input
            value={event.eventName}
            onChange={(e) => setEvent({ ...event, eventName: e.target.value })}
            placeholder="Write your event name here..."
            required
            className="form_input"
          />
        </label>

        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Event Description
          </span>
          <textarea
            value={event.eventDescription}
            onChange={(e) =>
              setEvent({ ...event, eventDescription: e.target.value })
            }
            placeholder="Write your event description here..."
            required
            className="form_textarea"
          />
        </label>

        <div className="checkbox-container flex gap-4">
          <label>
            <input
              type="checkbox"
              checked={event.isVirtual}
              onChange={(e) =>
                setEvent({ ...event, isVirtual: e.target.checked })
              }
            />
            <span className="font-satoshi text-gray-700 ml-2">
              Virtual Event
            </span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={event.isPublic}
              onChange={(e) =>
                setEvent({ ...event, isPublic: e.target.checked })
              }
            />
            <span className="font-satoshi text-gray-700 ml-2">
              Public Event
            </span>
          </label>
        </div>

        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Location
          </span>
          <input
            type="text"
            value={event.location}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
            placeholder="Enter event location"
            required={!event.isVirtual} // Make the field required only when isVirtual is false
            disabled={event.isVirtual} // Disable the input when isVirtual is true
            className={event.isVirtual ? "form_input disabled" : "form_input"}
          />
        </label>

        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Closest City
          </span>
          <Select options={ClosestCity} onChange={(selectedOption) => setEvent({ ...event, closestCity: selectedOption.value })} />
        </label>


        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Virtual Meeting Link
          </span>
          <input
            type="text"
            value={event.zoomLink}
            onChange={(e) => setEvent({ ...event, zoomLink: e.target.value })}
            placeholder="Enter zoom link"
            required={event.isVirtual} // Make the field required only when isVirtual is false
            disabled={!event.isVirtual} // Disable the input when isVirtual is true
            className={event.isVirtual ? "form_input" : "form_input disabled"}
          />
        </label>

        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Start Date
          </span>
          <input
            type="date"
            value={event.startDate}
            onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
            required
            className="form_input"
          />
        </label>

        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Start Time
          </span>
          <input
            type="time"
            value={event.startTime}
            onChange={(e) => setEvent({ ...event, startTime: e.target.value })}
            required
            className="form_input"
          />
        </label>

        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Time Zone
          </span>
          <Select options ={Timezones} onChange={(selectedOption) => setEvent({ ...event, timeZone: selectedOption.value })} />
          </label>

        <div className="flex-end mx-3 mb-5 gap-4">
          <Link href="/" className="text-gray-500 text-sm">
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
          >
            {submitting ? `Creating...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EventForm;
