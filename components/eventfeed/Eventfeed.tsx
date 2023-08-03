import React from "react";
import Card from "./Card";
import Image from "next/image";

const Eventfeed = () => {
    return (
        <section
        id ="eventfeed"
        className="w-full border-l-1 border-r-1 border-t-1 border-gray-600">
            <h1 className="head_text justify-between">
                Upcoming Events:
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 xl:gap-5">
                <Card
                    eventName="Park Hangout"
                    location="Los Angeles, CA"
                    des="We're going to hangout at the park on this date, make sure to bring a hat!"
                    time="3:00PM"
                    date="8/3/2023"
                    src="/assets/events/park.jpg"
                />
                <Card
                    eventName="Dinner in the City"
                    location="New York City, NY"
                    des="Join us for a fabulous meal and a fun night of networking."
                    time="7:00PM"
                    date="8/7/2023"
                    src="/assets/events/dinner.jpg"
                />
                <Card
                    eventName="Study Session for 596"
                    location="Online"
                    des="We will be preparing for our final exam and reviewing the practice problems covered in class. Be sure to bring snacks."
                    time="12:00PM"
                    date="8/10/2023"
                    src="/assets/events/study.jpg"
                />
                <Card
                    eventName="Disco Dance Night"
                    location="Philadelphia, PA"
                    des="Come dance the night away with your fellow quakers during our disco night gala. +1's are more than welcome."
                    time="8:00PM"
                    date="9/1/2023"
                    src="/assets/events/disco.jpg"
                />
                <Card
                    eventName="Networking @ Google"
                    location="Palo Alto, CA"
                    des="Come join staff in a networking event to meet some quaker alumni at the google office while we tour the facilities."
                    time="12:00PM"
                    date="9/17/2023"
                    src="/assets/events/google.jpg"
                />
                <Card
                    eventName="Halloween Horror Night"
                    location="Hollywood, CA"
                    des="Spend some spooky time with your classmates as we attend halloween horror nights."
                    time="9:00PM"
                    date="10/23/2023"
                    src="/assets/events/horror.jpeg"
                />
            </div>
        </section>
    )
}

export default Eventfeed;