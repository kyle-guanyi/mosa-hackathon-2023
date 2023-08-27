"use client";

import "/styles/globals.css";
import Nav from "components/Nav";
import Provider from "components/Provider";
import React, { useState, useEffect } from "react";

/**
 * This is the root layout for the entire application.
 */
export const metadata = {
  title: "Founding Friends",
  description: "Meetup web application for MCIT Online students",
};

// This is the root layout for the entire application.
const RootLayout = ({ children }) => {
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // obtains all the event JSONs
  const fetchAllEvents = async () => {
    try {
      const response = await fetch("/api/event");
      const data = await response.json();
      console.log(data)
      setAllEvents(data);
  
      if (response.ok) {
        console.log("yes it worked")
      } 
    }
    catch (error) {
      console.error("Error fetching all events:", error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchAllEvents();
  }, []);
  

  return (
    <html lang="en">
      <body className="100vh v-full">
        <Provider>
          <header className="sticky top-0 z-50">
            <div className="w-full">
              <Nav fetchAllEvents={fetchAllEvents} />
            </div>
          </header>
          <main className="main flex-col">
            {React.Children.map(children, (child) =>
              React.cloneElement(child, { fetchAllEvents, allEvents })
            )}
          </main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
