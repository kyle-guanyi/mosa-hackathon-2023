import React from "react";
import UserCard from "./UserCard";
import MessageBoard from "/components/messageboard/MessageBoard";
import { FiClock } from "react-icons/Fi";
import { CiLocationOn } from "react-icons/Ci";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
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
    <div className="h-screen w-full bg-red-500 flex">
      <div className="w-1/5 bg-blue-500">
        <div className="w-full h-full bg-yellow-500">
          Attendees:
          <div className="flex-col">
            {!isLoading &&
              attendeesInfo.map((user) => (
                <UserCard key={user._id} user={user} />
              ))}
          </div>
        </div>
      </div>
      <div className="w-3/5 bg-green-700 flex-grow">
        <div className="w-full h-1/10 bg-green-500 font-satoshi">
          <h1 className="text-3xl">{eventDetails.eventName}</h1>
          {eventDetails?.eventImage ? (
            <Image
              src={eventImage}
              alt="event_banner"
              width={120}
              height={120}
              className="mx-auto rounded-full object-contain"
            />
          ) : (
            <Image
              src="/assets/images/ben.png"
              alt="event_banner"
              width={120}
              height={120}
              className="mx-auto rounded-full object-contain"
            />
          )}
        </div>
        <div className=" w-full h-5/6 bg-blue-500 flex-col">
          <div className="flex flex-row justify-between">
            <div>
              <div>Hosted By:</div>
              <div>{!isLoading && <UserCard user={creatorInfo} />}</div>
            </div>

            <div>
              <div className="pb-3">
                {session?.user.id === eventDetails.creator && (
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        handleEdit(eventDetails._id);
                      }}
                      className="blue_btn"
                    >
                      Update Event
                    </button>
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
                        <AlertDialogCloseButton className="hover:opacity-50"/>
                        <AlertDialogBody>
                          Are you sure you want to delete this event? <br /> <br />
                          <em>All messages, comments, and uploaded pictures associated with this event will also be deleted.</em>
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
                <button
                  type="button"
                  onClick={(e) =>
                    !user.attendingEvents.includes(eventDetails._id)
                      ? handleAdd(eventDetails._id)
                      : handleRemove(eventDetails._id)
                  }
                  className={`mx-auto ${
                    !user.attendingEvents.includes(eventDetails._id)
                      ? "blue_btn"
                      : "red_btn"
                  }`}
                >
                  {!user.attendingEvents.includes(eventDetails._id)
                    ? "Add Event"
                    : "Remove Event"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-row flex justify-between">
            <div className="flex-col justify-start">
              <div className="pt-10">Event Details:</div>
              <div className="pt-4">{eventDetails.eventDescription}</div>
              <div className="pt-5 text-blue-900">
                <a href="{eventDetails.zoomLink}">Zoom Link</a>
              </div>
              <MessageBoard
                eventDetails={eventDetails}
                addImagesToEvent={addImagesToEvent}
              />
            </div>

            <div className="flex-col w-1/3">
              <div className="flex-row flex items-center">
                <span className="bannerIcon">
                  <FiClock />
                </span>
                <div className="ml-4">
                  {startDate} at {eventDetails.startTime}{" "}
                  {eventDetails.timeZone}
                </div>
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
      <div className="w-1/5 bg-purple-700 hidden md:block ">
        Photo Timeline <PhotoTimeline event={eventDetails} />
      </div>
    </div>
  );
};

export default EventPage;
