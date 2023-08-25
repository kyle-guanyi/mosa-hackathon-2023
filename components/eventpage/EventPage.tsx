import React from "react";
import UserCard from "./UserCard";
import MessageBoard from "/components/messageboard/MessageBoard";
import { FiClock } from "react-icons/Fi";
import { CiLocationOn } from "react-icons/Ci";
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
} from "@chakra-ui/react";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const startDate = new Date(eventDetails.startDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);

  const [eventImage, setEventImage] = useState("");

  const fetchEventImage = async () => {
    try {
      const keysArray = [eventDetails.eventImage]; // Convert to an array
      const response = await fetch(
        `/api/media?keys=${encodeURIComponent(JSON.stringify(keysArray))}`
      );
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setEventImage(data.urls[0]); // Assuming the data structure is { success: true, urls: [profilePictureUrl] }
      } else {
        console.error("Error fetching profile picture");
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  useEffect(() => {
    if (eventDetails?.eventImage) {
      fetchEventImage();
    }
  }, [eventDetails?.eventImage]);

  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const [userEventDateTime, setUserEventDateTime] = useState(null);

  // UseEffect to set isLoading to false once data is fetched
  useEffect(() => {
    if (eventDetails && creatorInfo && attendeesInfo) {
      setIsLoading(false);

      if (session?.user.id) {
        const dateTimeObject = DateTime.fromISO(eventDetails.UTCEventTime);
        const userTimezone = DateTime.local().zoneName;
        const userEventDateTime = dateTimeObject.setZone(userTimezone);
        setUserEventDateTime(userEventDateTime);
        console.log("This is the user event date time", userEventDateTime);
      }
    }
  }, [eventDetails, creatorInfo, attendeesInfo, session?.user.id]);

  return (
    <div className="h-full w-full bg-red-500 flex">
      <div className="w-1/6 bg-blue-500 p-4">
        <div className="w-full h-full bg-yellow-500">
          <Heading as="h2" size="md" className="pb-4 pt-4">
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
      <Center height="100%">
        <Divider orientation="vertical" />
      </Center>
      <div className="w-3/5 bg-green-700 flex-grow pl-4 pr-4">
        <div className="w-full h-1/10 bg-green-500 font-satoshi">
          {eventDetails?.eventImage ? (
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
            {eventDetails.eventName}
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
                    <Button
                      type="button"
                      onClick={() => {
                        handleEdit(eventDetails._id);
                      }}
                      colorScheme="facebook"
                      isActive={true}
                      className="hover:opacity-80 mr-4"
                    >
                      Update Event
                    </Button>
                    <Button
                      colorScheme="red"
                      isActive={true}
                      className="hover:opacity-80"
                      onClick={onOpen}
                    >
                      Delete Event
                    </Button>
                    <AlertDialog
                      motionPreset="slideInBottom"
                      leastDestructiveRef={cancelRef}
                      onClose={onClose}
                      isOpen={isOpen}
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
                          <Button ref={cancelRef} onClick={onClose}>
                            No
                          </Button>
                          <Button
                            colorScheme="red"
                            variant={"solid"}
                            isActive={true}
                            className="hover:opacity-80"
                            ml={3}
                            onClick={() => handleDelete(eventDetails._id)}
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
          
          </div>          





          <div className="flex-row flex justify-between">
            <div className="flex-col justify-start">
              <div className="pt-10">
                <Heading as="h3" size="md">
                  Event Details:
                </Heading>
              </div>
              <div className="mr-20">
                <Collapse
                  startingHeight={20}
                  in={show}
                  className="mx-auto text-justify"
                >
                  {eventDetails.eventDescription}
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
              <div className="pt-5 text-blue-900">
                <Heading as="h3" size="md">
                  <a href="{eventDetails.zoomLink}">Zoom Link</a>
                </Heading>
              </div>




              <div className="pt-4 mr-20 bg-slate-400">
                <MessageBoard
                  eventDetails={eventDetails}
                  addImagesToEvent={addImagesToEvent}
                />
              </div>
            </div>

            <div className="flex-col w-1/3 flex">
              <div className="flex-row flex items-center">
                <span className="bannerIcon">
                  <FiClock />
                </span>
                <div className="ml-4">
                  {startDate} at {eventDetails.startTime}{" "}
                  {eventDetails.timeZone}
                </div>
              </div>
              <div>
                <p>
                  Event Date:{" "}
                  {userEventDateTime?.toFormat("cccc, LLLL d, yyyy")}
                </p>
                <p>Start Time: {userEventDateTime?.toFormat("hh:mm a")}</p>
              </div>

              <div className="flex-row flex items-center">
                <span className="bannerIcon">
                  <CiLocationOn />
                </span>
                <div className="ml-4">
                  <div>{eventDetails.location || "Virtual Event"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Center height="100%">
        <Divider orientation="vertical" />
      </Center>
      <div className="w-1/5 bg-purple-700 hidden md:block p-4">
        <Heading as="h3" size="md">Photo Timeline</Heading> <PhotoTimeline event={eventDetails} />
      </div>
    </div>
  );
};

export default EventPage;
