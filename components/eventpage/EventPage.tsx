import React from "react";
import UserCard from "./UserCard";
import MessageBoard from "/components/messageboard/MessageBoard"
import { FiClock } from "react-icons/Fi";
import { CiLocationOn } from "react-icons/Ci";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const EventPage = ({
  eventDetails,
  creatorInfo,
  attendeesInfo,
  user,
  handleAdd,
  handleRemove,
  handleEdit,
  handleDelete,
}) => {
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
      const response = await fetch(`/api/media?keys=${encodeURIComponent(JSON.stringify(keysArray))}`);
      const data = await response.json();
      console.log(data)

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

  // UseEffect to set isLoading to false once data is fetched
  useEffect(() => {
    if (eventDetails && creatorInfo && attendeesInfo) {
      setIsLoading(false);
    }
  }, [eventDetails, creatorInfo, attendeesInfo]);

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
                  <button
                    type="button"
                    onClick={() => {
                      const shouldDelete = window.confirm(
                          "Are you sure you want to delete this event?"
                      );
                      if (shouldDelete) {
                        handleDelete(eventDetails._id);
                      }
                    }}
                    className="blue_btn"
                  >
                    Delete Event
                  </button>
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
              <MessageBoard eventDetails={eventDetails}/>
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
      <div className="w-1/5 bg-purple-700 hidden md:block ">Photo Timeline</div>
    </div>
  );
};

export default EventPage;
