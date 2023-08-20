import React from "react";
import UserCard from "./UserCard";
import { FiClock } from "react-icons/Fi";
import { CiLocationOn } from "react-icons/Ci";

const EventPage = ({
  eventDetails,
  creatorInfo,
  attendeesInfo,
  handleEdit,
  handleDelete,
}) => {
  // event page format -> details of event in eventDetails as a json
  console.log("This is the creator");
  console.log(creatorInfo);
  console.log("These are the attendees");
  console.log(attendeesInfo);

  const startDate = new Date(eventDetails.startDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="h-screen w-full bg-red-500 flex">
      <div className="w-1/5 bg-blue-500">
        <div className="w-full h-full bg-yellow-500">
          Attendees:
          <div className="flex-col">
            {attendeesInfo.map((user) => (
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
          <div>Hosted By:</div>
          <div>
            <UserCard user={creatorInfo} />
          </div>
          <div className="flex-row flex justify-between">
            <div className="flex-col justify-start">
              <div className="pt-10">Event Details:</div>
              <div className="pt-4">{eventDetails.eventDescription}</div>
              <div className="pt-5 text-blue-900">
                <a href='{eventDetails.zoomLink}'>Zoom Link</a>
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
