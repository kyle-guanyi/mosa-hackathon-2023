import React from "react";
import UserCard from "./UserCard";
import { FiClock } from "react-icons/Fi";
import { CiLocationOn } from "react-icons/Ci";
import { useState, useEffect } from "react";

const EventPage = ({
  eventDetails,
  creatorInfo,
  attendeesInfo,
  user,
  setUser,
  handleAdd,
  eventAdded,
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

  const [isLoading, setIsLoading] = useState(true);

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
        </div>
        <div className=" w-full h-5/6 bg-blue-500 flex-col">

          <div className="flex flex-row justify-between">
            <div>
              <div>Hosted By:</div>
              <div>{!isLoading && <UserCard user={creatorInfo} />}</div>
            </div>

            <div>
              <div className="justify-end">
                {handleAdd && (
                  <button
                    type="button"
                    onClick={(e) => handleAdd(eventDetails._id)}
                    className="mx-auto blue_btn"
                  >
                    Add Event
                  </button>
                )}
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
