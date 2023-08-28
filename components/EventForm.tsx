import Select from "react-select";
import Dropzone from "components/Dropzone";
import React, { useState, useEffect } from "react";

import {
  Stack,
  Box,
  FormLabel,
  Input,
  Textarea,
  FormControl,
} from "@chakra-ui/react";

/**
 * This component is used to render the timezone options in the dropdown menu in event form.
 */
const Timezones = [
  {
    value: "Etc/GMT+12",
    label: "UTC-12:00 - International Date Line West (IDLW)",
  },
  {
    value: "Pacific/Niue",
    label: "UTC-11:00 - Niue Time (NUT), Samoa Standard Time (SST)",
  },
  {
    value: "Pacific/Marquesas",
    label: "UTC-09:30 - Marquesas Islands Time (MART)",
  },
  { value: "America/Adak", label: "UTC-09:00 - Alaska Standard Time (AKST)" },
  {
    value: "America/Los_Angeles",
    label: "UTC-08:00 - Pacific Standard Time (PST)",
  },
  {
    value: "America/Denver",
    label: "UTC-07:00 - Mountain Standard Time (MST)",
  },
  {
    value: "America/Chicago",
    label: "UTC-06:00 - Central Standard Time (CST)",
  },
  {
    value: "America/New_York",
    label: "UTC-05:00 - Eastern Standard Time (EST)",
  },
  {
    value: "America/Halifax",
    label: "UTC-04:00 - Atlantic Standard Time (AST)",
  },
  {
    value: "America/St_Johns",
    label: "UTC-03:30 - Newfoundland Standard Time (NST)",
  },
  { value: "America/Manaus", label: "UTC-03:00 - Amazon Standard Time (AMT)" },
  {
    value: "America/Noronha",
    label: "UTC-02:00 - Fernando de Noronha Time (FNT)",
  },
  {
    value: "Atlantic/Azores",
    label: "UTC-01:00 - Azores Standard Time (AZOST)",
  },
  { value: "Etc/GMT", label: "UTC+00:00 - Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "UTC+01:00 - Central European Time (CET)" },
  { value: "Europe/Kiev", label: "UTC+02:00 - Eastern European Time (EET)" },
  { value: "Europe/Moscow", label: "UTC+03:00 - Moscow Standard Time (MSK)" },
  { value: "Asia/Tehran", label: "UTC+03:30 - Iran Standard Time (IRST)" },
  { value: "Asia/Dubai", label: "UTC+04:00 - Gulf Standard Time (GST)" },
  { value: "Asia/Kabul", label: "UTC+04:30 - Afghanistan Time (AFT)" },
  { value: "Asia/Kolkata", label: "UTC+05:30 - Indian Standard Time (IST)" },
  { value: "Asia/Kathmandu", label: "UTC+05:45 - Nepal Time (NPT)" },
  { value: "Asia/Dhaka", label: "UTC+06:00 - Bangladesh Time (BST)" },
  { value: "Asia/Yangon", label: "UTC+06:30 - Myanmar Time (MMT)" },
  { value: "Asia/Bangkok", label: "UTC+07:00 - Indochina Time (ICT)" },
  { value: "Asia/Shanghai", label: "UTC+08:00 - China Standard Time (CST)" },
  {
    value: "Australia/Eucla",
    label: "UTC+08:45 - Southeastern Western Australia Standard Time (CWST)",
  },
  { value: "Asia/Tokyo", label: "UTC+09:00 - Japan Standard Time (JST)" },
  {
    value: "Australia/Adelaide",
    label: "UTC+09:30 - Australian Central Standard Time (ACST)",
  },
  {
    value: "Asia/Seoul",
    label: "UTC+09:00 - Japan Standard Time (JST), Korea Standard Time (KST)",
  },
  {
    value: "Australia/Lord_Howe",
    label: "UTC+10:30 - Lord Howe Standard Time (LHST)",
  },
  {
    value: "Pacific/Guadalcanal",
    label: "UTC+11:00 - Solomon Islands Time (SBT)",
  },
  { value: "Pacific/Norfolk", label: "UTC+11:30 - Norfolk Island Time (NFT)" },
  {
    value: "Pacific/Auckland",
    label: "UTC+12:00 - New Zealand Standard Time (NZST)",
  },
  {
    value: "Pacific/Chatham",
    label: "UTC+12:45 - Chatham Standard Time (CHAST)",
  },
  { value: "Pacific/Tongatapu", label: "UTC+13:00 - Tonga Time (TOT)" },
  { value: "Pacific/Kiritimati", label: "UTC+14:00 - Line Island Time (LINT)" },
];

/**
 * This component is used to render the closest city options in the dropdown menu in event form.
 */
const ClosestCity = [
  { value: "Africa", label: "Africa" },
  { value: "Alberta", label: "Alberta" },
  { value: "Atlanta", label: "Atlanta" },
  { value: "Austin", label: "Austin" },
  { value: "Australia", label: "Australia" },
  { value: "Bay Area", label: "Bay Area" },
  { value: "Berlin", label: "Berlin" },
  { value: "Boston", label: "Boston" },
  { value: "CDMX", label: "CDMX" },
  { value: "Chicago", label: "Chicago" },
  { value: "China", label: "China" },
  { value: "Connecticut", label: "Connecticut" },
  { value: "DC", label: "DC" },
  { value: "Colorado", label: "Colorado" },
  { value: "DFW", label: "DFW" },
  { value: "Europe", label: "Europe" },
  { value: "Florida", label: "Florida" },
  { value: "Hong Kong", label: "Hong Kong" },
  { value: "Houston", label: "Houston" },
  { value: "India", label: "India" },
  { value: "Indonesia", label: "Indonesia" },
  { value: "Japan", label: "Japan" },
  { value: "Korea", label: "Korea" },
  { value: "Latin America", label: "Latin America" },
  { value: "London", label: "London" },
  { value: "Los Angeles", label: "Los Angeles" },
  { value: "Midwest", label: "Midwest" },
  { value: "Montreal", label: "Montreal" },
  { value: "Nankai", label: "Nankai" },
  { value: "New Jersey", label: "New Jersey" },
  { value: "New Zealand", label: "New Zealand" },
  { value: "NYC", label: "NYC" },
  { value: "Philippines", label: "Philippines" },
  { value: "Philly", label: "Philly" },
  { value: "Portland PDX", label: "Portland PDX" },
  { value: "Salt Lake City", label: "Salt Lake City" },
  { value: "Seattle", label: "Seattle" },
  { value: "Singapore", label: "Singapore" },
  { value: "Toronto", label: "Toronto" },
  { value: "Vancouver", label: "Vancouver" },
  { value: "Vietnam", label: "Vietnam" },
];


/**
 * This component is used to render the event form.
 *
 * @param type - A string
 * @param event - An event JSON
 * @param setEvent - A function to set an event
 * @param handleKeysArray - A function to handle an array of keys
 * @param setNewEvent - A function to set an event
 * @param firstField - A string
 * @constructor - Renders an event form
 * @returns An event form
 */
// @ts-ignore
const EventForm = ({
  event,
  setEvent,
  handleKeysArray,
  setNewEvent,
  firstField,
}) => {
  useEffect(() => {
    setNewEvent(event);
  }, [event, setNewEvent]);

  const [initialFiles, setInitialFiles] = useState([event.eventImage]);

  /**
   * This function is used to update the initial files.
   *
   * @param newFiles - An array of files
   * @returns An array of files
   */
  const updateInitialFiles = (newFiles) => {
    setInitialFiles(newFiles);
  };

  return (
    <Stack spacing="24px">
      <Box>
        <FormControl isRequired>
          <FormLabel htmlFor="eventName">Event Name</FormLabel>
          <Input
            ref={firstField}
            value={event.eventName}
            onChange={(e) => setEvent({ ...event, eventName: e.target.value })}
            placeholder="Write your event name here..."
          />
        </FormControl>
      </Box>

      <Box>
        <FormControl isRequired>
          <FormLabel htmlFor="eventDescription">Event Description</FormLabel>
          <Textarea
            value={event.eventDescription}
            onChange={(e) =>
              setEvent({ ...event, eventDescription: e.target.value })
            }
            placeholder="Write your event description here..."
          />
        </FormControl>
      </Box>

      <Box>
        <FormLabel htmlFor="isVirtual">Virtual Event</FormLabel>
        <input
          type="checkbox"
          checked={event.isVirtual}
          onChange={(e) => setEvent({ ...event, isVirtual: e.target.checked })}
        />
      </Box>

      <Box>
        <FormLabel htmlFor="isPublic">Public Event</FormLabel>
        <input
          type="checkbox"
          checked={event.isPublic}
          onChange={(e) => setEvent({ ...event, isPublic: e.target.checked })}
        />
      </Box>

      <Box>
        <FormControl isRequired={!event.isVirtual}>
          <FormLabel htmlFor="location">Location</FormLabel>
          <Input
            value={event.location}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
            placeholder="Enter event location here..."
            required={!event.isVirtual} // Make the field required only when isVirtual is false
            disabled={event.isVirtual} // Disable the input when isVirtual is true
            className={event.isVirtual ? "form_input disabled" : "form_input"}
          />
        </FormControl>
      </Box>

      <Box id="closestCity">
        <FormControl isRequired>
          <FormLabel htmlFor="closestCity">Closest Major City/Region</FormLabel>
          <Select
            options={ClosestCity}
            value={ClosestCity.find((city) => city.value === event.closestCity)}
            onChange={(selectedOption) =>
              setEvent({ ...event, closestCity: selectedOption.value })
            }
            placeholder="Select the closest major city or region to your event"
          />
        </FormControl>
      </Box>

      <Box>
        <FormControl isRequired={event.isVirtual}>
          <FormLabel htmlFor="virtualLink">Virtual Meeting Link</FormLabel>
          <Input
            value={event.zoomLink}
            onChange={(e) => setEvent({ ...event, zoomLink: e.target.value })}
            placeholder="Enter your virtual meeting link here..."
            required={event.isVirtual} // Make the field required only when isVirtual is false
            disabled={!event.isVirtual} // Disable the input when isVirtual is true
            className={event.isVirtual ? "form_input" : "form_input disabled"}
          />
        </FormControl>
      </Box>

      <Box>
        <FormControl isRequired>
          <FormLabel htmlFor="startDate">Start Date</FormLabel>
          <input
            type="date"
            value={
              event.startDate
                ? new Date(event.startDate).toISOString().substring(0, 10)
                : ""
            }
            onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
            className="form_input"
          />
        </FormControl>
      </Box>

      <Box>
        <FormControl isRequired>
          <FormLabel htmlFor="startTime">Start Time</FormLabel>
          <input
            type="time"
            value={event.startTime}
            onChange={(e) => setEvent({ ...event, startTime: e.target.value })}
            className="form_input"
          />
        </FormControl>
      </Box>

      <Box>
        <FormControl isRequired>
          <FormLabel htmlFor="timeZone">Time Zone</FormLabel>
          <Select
            options={Timezones}
            value={Timezones.find(
              (timezone) => timezone.value === event.timeZone
            )}
            onChange={(selectedOption) =>
              setEvent({ ...event, timeZone: selectedOption.value })
            }
            placeholder="Select your time zone here"
          />
        </FormControl>
      </Box>

      <Box>
        <FormLabel htmlFor="dropzone">
          Upload your event cover image here <em>(optional)</em>
        </FormLabel>
        <Dropzone
          handleKeysArray={handleKeysArray}
          maxUploads={1}
          initialFiles={initialFiles || []}
          updateInitialFiles={updateInitialFiles}
        />
      </Box>
    </Stack>
  );
};

export default EventForm;
