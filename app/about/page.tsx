import Image from "next/image";

const about = () => {
  return (
    <div className="flex flex-col w-1/2 gap-20">
      <div>
        <div className="text-2xl font-bold text-upenn-blue">
          <h1>ABOUT US:</h1>
        </div>
        <div>
          <p className="text-xl font-normal text-upenn-blue tracking-wide">
            Introducing a digital platform that facilitates in-person
            gatherings, our student meet-up app empowers online students to
            design and join a range of events. Users can provide an outline for
            each gathering, detailing its purpose, location, and schedule, as
            well as initiate conversations about the agenda, share photos, and
            engage in related dialogues. Following the conclusion of each
            meetup, the details will be preserved in an archive, allowing
            individuals to revisit the fond memories of past events.
          </p>
        </div>
      </div>

      <div>
        <div className=" text-upenn-blue text-2xl font-bold">
          <h1>FOUNDING FATHERS</h1>
        </div>
        <div className="text-upenn-blue text-xl font-normal">
          
        </div>
      </div>
    </div>
  );
};

export default about;
