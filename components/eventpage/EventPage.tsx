import React from "react";
import UserCard from "./UserCard";
import MessageBoard from "/components/messageboard/MessageBoard";
import { FiClock } from "react-icons/Fi";
import { TbLocation } from "react-icons/Tb";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import { DateTime } from "luxon";
import PhotoTimeline from "/components/phototimeline/PhotoTimeline";
import {
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
  Button,
  Heading,
  Image,
  Divider,
  Collapse,
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerFooter,
  useToast,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";

import { EditIcon } from "@chakra-ui/icons";
import EventForm from "components/EventForm";

const EventPage = ({
  eventDetails,
  creatorInfo,
  attendeesInfo,
  user,
  handleAdd,
  handleRemove,
  handleDelete,
  addImagesToEvent,
  fetchEventDetails,
}) => {
  const { data: session } = useSession();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const cancelRef = React.useRef();
  const firstField = React.useRef();

  const { isOpen: isZoomOpen, onToggle } = useDisclosure();

  const [submitting, setIsSubmitting] = useState(false);
  const [event, setEvent] = useState(eventDetails);

  useEffect(() => {
    setEvent(eventDetails);
  }, [eventDetails]);

  // Convert start date to a readable format
  const startDate = new Date(event.startDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);
  const [eventImage, setEventImage] = useState("");

  /**
   * Fetches the event image from the database
   */
  const fetchEventImage = async () => {
    try {
      const keysArray = [event.eventImage];
      const response = await fetch(
        `/api/media?keys=${encodeURIComponent(JSON.stringify(keysArray))}`
      );
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setEventImage(data.urls[0]);
      } else {
        console.error("Error fetching profile picture");
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  // Fetch event image when event image changes
  useEffect(() => {
    if (event?.eventImage) {
      fetchEventImage();
    }
  }, [event?.eventImage]);

  const [isLoading, setIsLoading] = useState(true);
  const [userEventDateTime, setUserEventDateTime] = useState(null);
  const [eventDateTime, setEventDateTime] = useState(null);

  const timezoneMapping = {
    "Etc/GMT+12": "UTC-12",
    "Pacific/Niue": "UTC-11",
    "Pacific/Marquesas": "UTC-09:30",
    "America/Adak": "HST", // Not a standard acronym; using HST as an example
    "America/Los_Angeles": "PST",
    "America/Denver": "MST",
    "America/Chicago": "CST",
    "America/New_York": "EST",
    "America/Halifax": "AST",
    "America/St_Johns": "NST",
    "America/Manaus": "AMT",
    "America/Noronha": "FNT",
    "Atlantic/Azores": "AZOST",
    "Etc/GMT": "GMT",
    "Europe/Paris": "CET",
    "Europe/Kiev": "EET",
    "Europe/Moscow": "MSK",
    "Asia/Tehran": "IRST",
    "Asia/Dubai": "GST",
    "Asia/Kabul": "AFT",
    "Asia/Kolkata": "IST",
    "Asia/Kathmandu": "NPT",
    "Asia/Dhaka": "BST",
    "Asia/Yangon": "MMT",
    "Asia/Bangkok": "ICT",
    "Asia/Shanghai": "CST",
    "Australia/Eucla": "CWST",
    "Asia/Tokyo": "JST",
    "Australia/Adelaide": "ACST",
    "Asia/Seoul": "KST",
    "Australia/Lord_Howe": "LHST",
    "Pacific/Guadalcanal": "SBT",
    "Pacific/Norfolk": "NFT",
    "Pacific/Auckland": "NZST",
    "Pacific/Chatham": "CHAST",
    "Pacific/Tongatapu": "TOT",
    "Pacific/Kiritimati": "LINT",
  };

  const convertIANAToTimezoneAcronym = useCallback((ianaTimeZone) => {
    const mappedAcronym = timezoneMapping[ianaTimeZone];
    if (mappedAcronym) {
      return mappedAcronym;
    }

    const now = DateTime.now().setZone(ianaTimeZone);
    return now.toFormat("z");
  }, []);

  // UseEffect to set isLoading to false once data is fetched
  useEffect(() => {
    // Check if all data is fetched
    if (event && creatorInfo && attendeesInfo) {
      setIsLoading(false);

      // Convert event time to user's timezone
      if (session?.user.id) {
        // const dateTimeObject = DateTime.fromISO(event.UTCEventTime);
        // const userTimezone = DateTime.local().zoneName;
        // const userEventDateTime = dateTimeObject.setZone(userTimezone);
        // setUserEventDateTime(userEventDateTime);
        // console.log("This is the user event date time", userEventDateTime);
        const year = parseInt(eventDetails.startDate.substring(0, 4), 10);
        const month = parseInt(eventDetails.startDate.substring(5, 7), 10);
        const day = parseInt(eventDetails.startDate.substring(8, 10), 10);

        // Extract hours and minutes from the startTime string
        const hours = parseInt(eventDetails.startTime.substring(0, 2), 10);
        const minutes = parseInt(eventDetails.startTime.substring(3, 5), 10);
        // Create a DateTime object for the start date
        const eventStartDate = DateTime.fromObject(
          {
            year: year,
            month: month,
            day: day,
            hour: hours,
            minute: minutes,
            second: 0,
            millisecond: 0,
          },
          { zone: event.timeZone }
        );

        setEventDateTime(eventStartDate);

        const userAdjustedStartDate = eventStartDate.toLocal();

        setUserEventDateTime(userAdjustedStartDate);
      }
    }
  }, [event, creatorInfo, attendeesInfo, session?.user.id]);

  /**
   * Validates all required fields in the event form
   */
  const validateFields = () => {
    if (
      !newEvent.eventName ||
      !newEvent.eventDescription ||
      !newEvent.startDate ||
      !newEvent.startTime ||
      !newEvent.timeZone ||
      !newEvent.closestCity
    ) {
      // Return false if any required field is missing
      return false;
    }
    if (!newEvent.isVirtual && !newEvent.location) {
      // Return false if location is required for in-person events and is missing
      return false;
    }
    return !(newEvent.isVirtual && !newEvent.zoomLink);
  };

  // Use toast to display error message if any required fields are missing
  const toast = useToast();

  /**
   * Updates the event in the database
   *
   * @param newEvent - The updated event
   * @returns A toast message indicating whether the event was successfully updated
   */
  const updateEvent = async (newEvent) => {
    setIsSubmitting(true);

    // Validate event id
    if (!event._id) return alert("Missing Event Id!");

    // Validate all required fields
    if (!validateFields()) {
      toast({
        title: "Please fill out all required fields before submitting",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setIsSubmitting(false);
      return;
    }

    // Update event in database
    try {
      const response = await fetch(`/api/event/${event._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          eventName: newEvent.eventName,
          eventDescription: newEvent.eventDescription,
          location: newEvent.location,
          zoomLink: newEvent.zoomLink,
          isPublic: newEvent.isPublic,
          isVirtual: newEvent.isVirtual,
          startDate: newEvent.startDate,
          startTime: newEvent.startTime,
          timeZone: newEvent.timeZone,
          closestCity: newEvent.closestCity,
        }),
      });
      if (response.ok) {
        fetchEventDetails();
        toast({
          title: "Event successfully updated",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onDrawerClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Updates the event image in the database
   *
   * @param newEventImage - The updated event image
   * @returns A toast message indicating whether the event image was successfully updated
   */
  const updateEventImage = async (newEventImage) => {
    setIsSubmitting(true);

    // Validate event id
    if (!event._id) return alert("Missing Event Id!");

    // Update event image in database
    try {
      await fetch(`/api/event/${event._id}?type=eventImage`, {
        method: "PATCH",
        body: JSON.stringify({
          eventImage: newEventImage,
        }),
      });
    } catch (error) {
      console.log(error);
    } finally {
      toast({
        title: "Event picture successfully updated",
        status: "success",
        duration: 6000,
        isClosable: true,
      });
      setIsSubmitting(false);
    }
  };

  /**
   * Updates the event image in the database
   *
   * @param keysArray - The updated event image
   * @returns A toast message indicating whether the event image was successfully updated
   */
  const handleKeysArray = async (keysArray) => {
    updateEventImage(keysArray[0]);
  };

  // Initialize newEvent state
  const [newEvent, setNewEvent] = useState(null);

  // Update newEvent state when event changesnpm r
  return (
    <div className="h-full w-full flex">
      <div className="w-1/6 p-4">
        <div className="w-full h-full">
          <Heading as="h2" size="md" className="pb-4">
            Attending:
          </Heading>
          <div className="flex-col">
            {!isLoading &&
              attendeesInfo.map((user) => (
                <UserCard key={user._id} user={user} />
              ))}
          </div>
        </div>
      </div>

      <Divider orientation="vertical" />

      <div className="w-3/5 flex-grow pl-4 pr-4">
        <div className="w-full h-1/10 font-satoshi">
          {event?.eventImage ? (
            <Image
              borderRadius="lg"
              src={eventImage}
              alt="Cover Picture"
              height="300px" // Adjust the height as needed
              width="100%" // Adjust the width as needed
              objectFit="cover"
            />
          ) : (
            <NextImage
              src="/assets/images/benny.png"
              alt="event_banner"
              width={120}
              height={120}
              className="mx-auto rounded-full object-contain"
            />
          )}

          <Heading as="h1" size="xl" className="pt-4 pb-4">
            {event.eventName}
          </Heading>
        </div>

        <div className=" w-full h-5/6 flex-col">
          <div className="flex flex-row justify-between">
            <div>
              <div className="pb-2">
                <Heading as="h3" size="md">
                  Hosted By:
                </Heading>
              </div>
              <div className="pb-2">
                {!isLoading && <UserCard user={creatorInfo} />}
              </div>
            </div>

            <div>
              <div className="pb-3">
                {session?.user.id === eventDetails.creator && (
                  <div>
                    <>
                      <Button
                        rightIcon={<EditIcon />}
                        colorScheme="facebook"
                        isActive="true"
                        className="hover:opacity-80 mx-auto"
                        onClick={onDrawerOpen}
                      >
                        Edit Event
                      </Button>
                      <Drawer
                        isOpen={isDrawerOpen}
                        placement="right"
                        size="xl"
                        initialFocusRef={firstField}
                        onClose={onDrawerClose}
                      >
                        <DrawerOverlay />
                        <DrawerContent>
                          <DrawerCloseButton />
                          <DrawerHeader borderBottomWidth="1px">
                            Edit Event
                          </DrawerHeader>
                          <DrawerBody>
                            <EventForm
                              type="Edit"
                              event={event}
                              setEvent={setEvent}
                              submitting={submitting}
                              handleSubmit={updateEvent}
                              handleKeysArray={handleKeysArray}
                              newEvent={newEvent}
                              setNewEvent={setNewEvent}
                              firstField={firstField}
                            />
                          </DrawerBody>
                          {/* You can customize the footer buttons as needed */}
                          <DrawerFooter borderTopWidth="1px">
                            <Button
                              variant="outline"
                              mr={3}
                              onClick={onDrawerClose}
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
                                  updateEvent(newEvent);
                                }}
                              >
                                Submit
                              </Button>
                            )}
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    </>
                    <Button
                      colorScheme="red"
                      isActive={true}
                      className="hover:opacity-80"
                      onClick={onAlertOpen}
                    >
                      Delete Event
                    </Button>
                    <AlertDialog
                      motionPreset="slideInBottom"
                      leastDestructiveRef={cancelRef}
                      onClose={onAlertClose}
                      isOpen={isAlertOpen}
                      isCentered
                    >
                      <AlertDialogOverlay />
                      <AlertDialogContent>
                        <AlertDialogHeader>Delete Event?</AlertDialogHeader>
                        <AlertDialogCloseButton className="hover:opacity-50" />
                        <AlertDialogBody>
                          Are you sure you want to delete this event? <br />{" "}
                          <br />
                          <em>
                            All messages, comments, and uploaded pictures
                            associated with this event will also be deleted.
                          </em>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                          <Button ref={cancelRef} onClick={onAlertClose}>
                            No
                          </Button>
                          <Button
                            colorScheme="red"
                            variant={"solid"}
                            isActive={true}
                            className="hover:opacity-80"
                            ml={3}
                            onClick={() => handleDelete(event._id)}
                          >
                            Yes
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
              <div>
                <Button
                  type="button"
                  isActive={true}
                  className="hover:opacity-80 mr-4"
                  onClick={() =>
                    !user.attendingEvents.includes(event._id)
                      ? handleAdd(event._id)
                      : handleRemove(event._id)
                  }
                  colorScheme={
                    !user.attendingEvents.includes(event._id)
                      ? "facebook"
                      : "red"
                  }
                >
                  {!user.attendingEvents.includes(event._id)
                    ? "Add Event"
                    : "Remove Event"}
                </Button>
              </div>
            </div>
          </div>
          <Divider />

          <div>
            <div className="flex-row flex">
              <div className="w-3/5">
                <div className="flex-col ">
                  <div className="pt-2">
                    <Heading as="h3" size="md">
                      Event Details:
                    </Heading>
                  </div>
                  <div className="mr-20">
                    <Collapse
                      startingHeight={100}
                      in={show}
                      className="mx-auto text-justify"
                    >
                      {event.eventDescription}
                    </Collapse>
                    <Button
                      size="sm"
                      isActive={true}
                      className="hover:opacity-80"
                      onClick={handleToggle}
                      mt="1rem"
                    >
                      Show {show ? "Less" : "More"}
                    </Button>
                  </div>
                  <div>
                    {event?.zoomLink && (
                      <div className="pt-4 pb-2">
                        <Button
                          size="sm"
                          isActive={true}
                          className="hover:opacity-80"
                          mt="1rem"
                          onClick={onToggle}
                        >
                          Zoom Link
                        </Button>
                        <Collapse in={isZoomOpen} animateOpacity>
                          <Box
                            p="40px"
                            color="white"
                            mt="4"
                            bg="facebook.700"
                            rounded="md"
                            shadow="md"
                          >
                            <a href={event.zoomLink} target="_blank">
                              Redirect to Zoom
                            </a>
                          </Box>
                        </Collapse>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-col w-2/5">
                <div className="pt-2">
                  <div className="flex-row flex items-center pb-2">
                    <span className="bannerIcon">
                      <FiClock />
                    </span>
                    <div className="ml-4">
                      <p>
                        Event's Local Timezone Date:{" "}
                      {eventDateTime?.toFormat("EEEE, MMMM d, yyyy")},{" "}
                      {eventDateTime?.toFormat("h:mm a")}{" "}
                      {convertIANAToTimezoneAcronym(
                        eventDateTime?.zoneName
                      )}
                      </p>
                    </div>
                  </div>
                  <div className="flex-row flex items-center pb-2">
                    <span className="bannerIcon">
                      <InfoOutlineIcon />
                    </span>
                    <div className="ml-4">
                      <p>
                        User's Local Timezone Event Date:{" "}
                        {userEventDateTime?.toFormat("EEEE, MMMM d, yyyy")},{" "}
                        {userEventDateTime?.toFormat("h:mm a")}{" "}
                        {convertIANAToTimezoneAcronym(
                          userEventDateTime?.zoneName
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex-row flex items-center pb-2">
                    <span className="bannerIcon">
                      <TbLocation />
                    </span>
                    <div className="ml-4">
                      <div>{event.location || "Virtual Event"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            <div className="pt-4 mr-20 bg-slate-400">
              <MessageBoard 
                eventDetails={event}
                addImagesToEvent={addImagesToEvent}
              />
            </div>
          </div>
        </div>
      </div>

      <Divider orientation="vertical" />

      <div className="w-1/5 hidden md:block p-4">
        <div className="pb-4">
          <Heading as="h3" size="md">
            Photo Timeline
          </Heading>{" "}
        </div>

        <PhotoTimeline event={event} />
      </div>
    </div>
  );
};

export default EventPage;
