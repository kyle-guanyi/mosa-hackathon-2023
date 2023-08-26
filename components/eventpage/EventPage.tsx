import React from "react";
import UserCard from "./UserCard";
import MessageBoard from "/components/messageboard/MessageBoard";
import { FiClock } from "react-icons/Fi";
import { TbLocation } from "react-icons/Tb";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import { DateTime, IANAZone } from "luxon";
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
  Center,
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
  handleEdit,
  handleDelete,
  addImagesToEvent,
}) => {

  const { data: session } = useSession();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();

  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const cancelRef = React.useRef();
  const firstField = React.useRef();

  const { isOpen: isZoomOpen, onToggle } = useDisclosure();

  const [submitting, setIsSubmitting] = useState(false);

  const [event, setEvent] = useState(eventDetails);

  const startDate = new Date(eventDetails.startDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const fetchEventDetails = async () => {
    const response = await fetch(`/api/event/${eventDetails._id}`);
    const data = await response.json();
    console.log(data);

    setEvent({
      eventName: data.eventName,
      eventDescription: data.eventDescription,
      location: data.location,
      zoomLink: data.zoomLink,
      isPublic: data.isPublic,
      isVirtual: data.isVirtual,
      startDate: data.startDate,
      startTime: data.startTime,
      timeZone: data.timeZone,
      closestCity: data.closestCity,
    });
  };

  useEffect(() => {
    if (session?.user.id) {
       fetchEventDetails();
    }
  }, [session?.user.id]);


  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);

  const [eventImage, setEventImage] = useState("");

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

  useEffect(() => {
    if (event?.eventImage) {
      fetchEventImage();
    }
  }, [event?.eventImage]);

  const [isLoading, setIsLoading] = useState(true);
  
  const [userEventDateTime, setUserEventDateTime] = useState(null);

  // UseEffect to set isLoading to false once data is fetched
  useEffect(() => {
    if (event && creatorInfo && attendeesInfo) {
      setIsLoading(false);

      if (session?.user.id) {
        const dateTimeObject = DateTime.fromISO(event.UTCEventTime);
        const userTimezone = DateTime.local().zoneName;
        const userEventDateTime = dateTimeObject.setZone(userTimezone);
        setUserEventDateTime(userEventDateTime);
        console.log("This is the user event date time", userEventDateTime);
      }
    }
  }, [event, creatorInfo, attendeesInfo, session?.user.id]);

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
    if (newEvent.isVirtual && !newEvent.zoomLink) {
      // Return false if virtual link is required for virtual events and is missing
      return false;
    }
    return true;
  };

  const toast = useToast();

  const updateEvent = async (newEvent) => {
    setIsSubmitting(true);

    console.log("this is the updated event stuff: ", event);
    if (!eventDetails._id) return alert("Missing Event Id!");

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

    try {
      console.log("This is new event", newEvent)
      const response = await fetch(`/api/event/${eventDetails._id}`, {
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

  const updateEventImage = async (newEventImage) => {
    setIsSubmitting(true);

    if (!eventDetails._id) return alert("Missing Event Id!");

    console.log(newEventImage);
    try {
      const response = await fetch(`/api/event/${eventDetails._id}?type=eventImage`, {
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

  const handleKeysArray = async (keysArray) => {
    updateEventImage(keysArray[0]);
  };

  const [newEvent, setNewEvent] = useState(null);

  return (
    <div className="h-full w-full bg-red-500 flex">
      <div className="w-1/6 bg-blue-500 p-4">
        <div className="w-full h-full bg-yellow-500">
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

      <div className="w-3/5 bg-green-700 flex-grow pl-4 pr-4">
        <div className="w-full h-1/10 bg-green-500 font-satoshi">
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
              src="/assets/images/ben.png"
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

        <div className=" w-full h-5/6 bg-blue-500 flex-col">
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
                            <Button variant="outline" mr={3} onClick={onDrawerClose}>
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
                  onClick={(e) =>
                    !user.attendingEvents.includes(eventDetails._id)
                      ? handleAdd(eventDetails._id)
                      : handleRemove(eventDetails._id)
                  }
                  colorScheme={
                    !user.attendingEvents.includes(eventDetails._id)
                      ? "facebook"
                      : "red"
                  }
                >
                  {!user.attendingEvents.includes(eventDetails._id)
                    ? "Add Event"
                    : "Remove Event"}
                </Button>
              </div>
            </div>
          </div>
          <Divider />

          <div>
            <div className="flex-row flex">
              <div className="w-3/5 bg-red-500">
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
                            {event.zoomLink}
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
                      {startDate} at {event.startTime}{" "}
                      {event.timeZone}
                    </div>
                  </div>
                  <div className="flex-row flex items-center pb-2">
                    <span className="bannerIcon">
                      <InfoOutlineIcon />
                    </span>
                    <div className="ml-4">
                      <p>
                        Event Date:{" "}
                        {userEventDateTime?.toFormat("cccc, LLLL d, yyyy")}
                      </p>
                      <p>
                        Start Time: {userEventDateTime?.toFormat("hh:mm a")}
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
                eventDetails={eventDetails}
                addImagesToEvent={addImagesToEvent}
              />
            </div>
          </div>
        </div>
      </div>

      <Divider orientation="vertical" />

      <div className="w-1/5 bg-purple-700 hidden md:block p-4">
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
