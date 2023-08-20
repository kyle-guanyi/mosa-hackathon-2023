import React from "react";
import UserCard from "./UserCard";

const EventPage = ({ eventDetails, creatorInfo, attendeesInfo, handleEdit, handleDelete }) => {
  // event page format -> details of event in eventDetails as a json
    console.log("This is the creator")
    console.log(creatorInfo)
    console.log("These are the attendees")
    console.log(attendeesInfo)
  return (
    <div className="h-screen w-full bg-red-500 flex">
      <div className="w-1/5 bg-blue-500">
        <div className="w-full h-full bg-yellow-500">Attendees:
          <div className="flex-col">
            {attendeesInfo.map((user) => (
              <UserCard
                key={user._id}
                user = {user}
                />
            ))}

          </div>
        
        </div>
        
      </div>
      <div className="w-3/5 bg-green-700 flex-grow">
        <div className="w-full h-1/10 bg-green-500"><h1 className="text-3xl">
        {eventDetails.eventName}
            </h1></div>
        <div className=" w-full h-5/6 bg-blue-500 flex-col"> 
              <div>
                Hosted By:
              </div>
              <div>
                <UserCard user={creatorInfo} />
              </div>
          
        </div>
      </div>
      <div className="w-1/5 bg-purple-700 hidden md:block ">
        Photo Timeline
      </div>
    </div>
  );
};

export default EventPage;
