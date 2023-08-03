import Eventfeed from "../../components/eventfeed/Eventfeed";

const about = () => {
  return (
    <div className="h-screen w-full bg-red-500 flex">
      <div className="w-1/4 bg-blue-500">
        <div className="w-full h-1/2 bg-yellow-500">Calendar</div>
        <div className=" w-full h-1/2 bg-orange-500">Your Events</div>
      </div>
      <div className="w-1/2 bg-green-700 flex-grow">
        <div className="w-full h-1/10 bg-green-500">Search Function</div>
        <div className=" w-full h-5/6 bg-blue-500"><Eventfeed /></div>
      </div>
      <div className="w-1/4 bg-purple-700 hidden md:block ">Past Event Timeline</div>
    </div>
  );
};

export default about;
