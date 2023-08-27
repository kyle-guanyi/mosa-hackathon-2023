"use client";
import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";

import Select from "react-select";

import EventForm from "/components/EventForm";

import { EditIcon } from "@chakra-ui/icons";

const sortByCityMajorRegion = [
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

const sortByUpcomingRecent = [
  { value: "true", label: "Upcoming Events" },
  { value: "false", label: "Recently Added Events" },
];

const sortByEventType = [
  { value: "", label: "All Events" },
  { value: "true", label: "Virtual Event" },
  { value: "false", label: "In-Person Event" },
];

/**
 * This component is used to render a list of event cards.
 * It takes in a list of event JSONs and renders an event card for each event.
 *
 * @param data - A list of event JSONs
 * @constructor - Renders a list of event cards
 * @returns A list of event cards
 */
const EventCardList = ({ data }) => {
  return (
    <div className="mt-8 gap-y-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {data.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

/**
 * This component is used to render a list of events.
 * It takes in a list of event JSONs and renders an event card for each event.
 *
 * @param selectedDate - The selected date
 * @constructor - Renders a list of event cards
 * @returns A list of event cards
 */
const EventFeed = ({ selectedDate }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterCity, setFilterCity] = useState([]);
  const [filterVirtual, setFilterVirtual] = useState("");
  const [sortOption, setSortOption] = useState(true);

  // obtains all the event JSONs
  const fetchEvents = async () => {
    const response = await fetch("/api/event");
    const data = await response.json();
    const currentDate = new Date();
    const currentEvents = data.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate >= currentDate;
    });
    setEvents(currentEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const results = Object.values(events).filter((event) => {
      // Filter by date
      const isDateMatching =
        !selectedDate || event.startDate.substring(0, 10) === selectedDate;

      // Filter by city, date, and virtual
      if (
        (filterCity.length === 0 || filterCity.includes(event.closestCity)) &&
        isDateMatching &&
        (filterVirtual === "" || event.isVirtual.toString() === filterVirtual)
      ) {
        return true;
      }
    });

    // Sort by date
    if (sortOption === "true") {
      const sortedEvents = [...results].sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA - dateB;
      });
      setFilteredEvents(sortedEvents);
    } else {
      const sortedEvents = [...results].reverse();
      setFilteredEvents(sortedEvents);
    }
  }, [events, filterCity, selectedDate, filterVirtual, sortOption]);

  const {
    isOpen: isCreateEventOpen,
    onOpen: onCreateEventOpen,
    onClose: onCreateEventClose,
  } = useDisclosure();

  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState({
    eventName: "",
    eventDescription: "",
    location: "",
    zoomLink: "",
    isPublic: false,
    isVirtual: false,
    isCompleted: false,
    interested: [],
    startDate: null,
    startTime: "",
    timeZone: "",
    closestCity: "",
    eventImage: null,
  });

  const initialEventState = {
    eventName: "",
    eventDescription: "",
    location: "",
    zoomLink: "",
    isPublic: false,
    isVirtual: false,
    isCompleted: false,
    interested: [],
    startDate: null,
    startTime: "",
    timeZone: "",
    closestCity: "",
    eventImage: null,
  };

  const resetEventState = () => {
    setEvent(initialEventState);
  };

  /**
   * This function is used to validate fields.
   */
  const validateFields = () => {
    if (
      !event.eventName ||
      !event.eventDescription ||
      !event.startDate ||
      !event.startTime ||
      !event.timeZone ||
      !event.closestCity
    ) {
      // Return false if any required field is missing
      return false;
    }
    if (!event.isVirtual && !event.location) {
      // Return false if location is required for in-person events and is missing
      return false;
    }
    return !(event.isVirtual && !event.zoomLink);
  };

  const toast = useToast();

  /**
   * This function is used to create an event.
   *
   * @param newEvent - An event JSON
   * @returns An event
   */
  const createEvent = async (newEvent) => {
    setSubmitting(true);

    // Validate fields
    if (!validateFields()) {
      toast({
        title: "Please fill out all required fields before submitting",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setSubmitting(false);
      return;
    }

    // Create event
    try {
      const response = await fetch("/api/event/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
          eventName: newEvent.eventName,
          eventDescription: newEvent.eventDescription,
          attendees: [session?.user.id],
          interested: newEvent.interested,
          isPublic: newEvent.isPublic,
          isVirtual: newEvent.isVirtual,
          startDate: newEvent.startDate,
          startTime: newEvent.startTime,
          timeZone: newEvent.timeZone,
          location: newEvent.location,
          closestCity: newEvent.closestCity,
          zoomLink: newEvent.zoomLink,
          isCompleted: newEvent.isCompleted,
          eventImage: newEvent.eventImage,
        }),
      });

      if (response.ok) {
        const responseData = await response.json(); // Parse the response JSON
        const eventId = responseData._id;

        const userDataResponse = await fetch(`/api/user/${session?.user.id}`);
        const userData = await userDataResponse.json();

        const updatedAttendingEvents = [...userData.attendingEvents, eventId];

        const userResponse = await fetch(
          `/api/user/${session?.user.id}?type=attending`,
          {
            method: "PATCH",
            body: JSON.stringify({
              attendingEvents: updatedAttendingEvents,
            }),
          }
        );

        if (userResponse.ok) {
          toast({
            title: "Event successfully created",
            status: "success",
            duration: 4000,
            isClosable: true,
          });

          onCreateEventClose();
          if (home) {
            location.reload();
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      resetEventState();
      fetchEvents();
      setSubmitting(false);
    }
  };

  /**
   * This function is used to handle an array of keys.
   *
   * @param keysArray - An array of keys
   * @returns An array of keys
   */
  const handleKeysArray = async (keysArray) => {
    if (keysArray) {
      setNewEvent({ ...event, eventImage: keysArray[0] });
    }
  };

  const [newEvent, setNewEvent] = useState(null);

  return (
    <section
      id="eventfeed"
      className="w-full border-l-1 border-r-1 border-t-1 border-gray-600"
    >
      <div className="flex items-center justify-between pb-4 pt-4">
        <Heading className=""> Event Feed test </Heading>
        <Button
          variant={"solid"}
          colorScheme="facebook"
          isActive={true}
          className="hover:opacity-80"
          size={"md"}
          mr={4}
          onClick={onCreateEventOpen}
          rightIcon={<EditIcon />}
        >
          Create New Event
        </Button>
        <Modal
          isOpen={isCreateEventOpen}
          size="2xl"
          onClose={onCreateEventClose}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Event</ModalHeader>
            <ModalCloseButton onClick={resetEventState}/>
            <ModalBody>
              <EventForm
                type="Create"
                event={event}
                setEvent={setEvent}
                submitting={submitting}
                handleSubmit={createEvent}
                handleKeysArray={handleKeysArray}
                newEvent={newEvent}
                setNewEvent={setNewEvent}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                variant="outline"
                mr={3}
                onClick={() => {
                  resetEventState();
                  onCreateEventClose();
                }}
              >
                Cancel
              </Button>
              {submitting ? (
                <Button
                  colorScheme="facebook"
                  isLoading
                  loadingText="Submitting..."
                  isActive={true}
                >
                  Submit
                </Button>
              ) : (
                <Button
                  colorScheme="facebook"
                  isActive={true}
                  className="hover:opacity-80"
                  onClick={() => {
                    createEvent(newEvent);
                  }}
                >
                  Submit
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>

      <div className="flex space-x-8 justify-center text-center">
        <Select
          isSearchable={false}
          options={sortByEventType}
          value={sortByEventType.find(
            (virtual) => virtual.value === filterVirtual
          )}
          onChange={(e) => setFilterVirtual(e.value)}
          placeholder="Event Type"
        />
        <Select
          options={sortByCityMajorRegion}
          value={sortByCityMajorRegion.find(
            (city) => city.value === filterCity
          )}
          closeMenuOnSelect={false}
          onChange={(selectedOptions) => {
            console.log("This is filter city:", filterCity);
            const selectedValues = selectedOptions.map(
              (option) => option.value
            );
            setFilterCity(selectedValues);
          }}
          placeholder="Filter by major cities or regions"
          isMulti
        />
        <Select
          isSearchable={false}
          options={sortByUpcomingRecent}
          value={sortByUpcomingRecent.find((choice) => choice.value === sortOption.toString())}
          onChange={(e) => setSortOption(e.value)}
        />
      </div>
      <EventCardList data={filteredEvents} />
    </section>
  );
};

export default EventFeed;
