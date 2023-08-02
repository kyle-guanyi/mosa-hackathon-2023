import React from "react";
import Card from "./Card";

const Eventfeed = () => {
    return (
        <section
        id ="eventfeed"
        className="w-full py-20 border-l-1 border-r-1 border-t-1 border-gray-600">
            <h1 className="head_text justify-between">
                Upcoming Events:
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 xl:gap-5">
                <Card
                    eventName=""
                    location=""
                    des=""
                    time=""
                    src={}
                />
                <Card
                    eventName=""
                    location=""
                    des=""
                    time=""
                    src={}
                />
                <Card
                    eventName=""
                    location=""
                    des=""
                    time=""
                    src={}
                />
                <Card
                    eventName=""
                    location=""
                    des=""
                    time=""
                    src={}
                />
                <Card
                    eventName=""
                    location=""
                    des=""
                    time=""
                    src={}
                />
                <Card
                    eventName=""
                    location=""
                    des=""
                    time=""
                    src={}
                />
            </div>
        </section>
    )
}