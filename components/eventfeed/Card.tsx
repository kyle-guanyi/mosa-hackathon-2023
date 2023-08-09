import React from "react";

const Card = ({eventName, location, des, time, src, date} ) => {
  return (
    <div className="w-full p-2 xl:px-10 xl:py-8 h-auto rounded-lg flex flex-col hover:bg-gradient-to-b hover:from-gray-700 hover:gray-700 transition-colors duration-1000 cursor-pointer">
      <div className="w-full h-[80%] overflow-hidden rounded-lg">
        <img
          className="w-full h-60 object-cover group-hover:scale-110 duration-300"
          src={src}
          alt="src"
        />
      </div>
      <div className="w-full mt-5 flex flex-col  gap-6">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base uppercase text-designColor font-normal">
              {eventName}
            </h3>
            <div className="flex flex-col gap-1 font-thin text-xs text-right">
              <h6>
                {location}
              </h6>
              <h6>
                {date} - {time}
              </h6>
            </div>
          </div>
          <p className="text-sm tracking-wide mt-3 hover:text-gray-700 duration-300">
            {des}
          </p>
        </div>
      </div>
      {/* <div className="text-">{eventName}</div> */}
    </div>
  );
}

export default Card
