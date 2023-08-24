"use client"

import { useSession } from "next-auth/react";
import { DateTime } from "luxon";

const CurrentTime = () => {
  const { data: session } = useSession(); // Get the user's session data

  // Check if the session is loaded and contains userTimezone
  if (session?.userTimezone) {
    // Get the user's timezone from the session
    const userTimezone = session.userTimezone;

    // Get the current time in the user's timezone
    const currentTime = DateTime.now().setZone(userTimezone);

    return (
      <div>
        <h1>Current Time</h1>
        <p>Time in {userTimezone}: {currentTime.toFormat("yyyy-MM-dd HH:mm:ss")}</p>
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default CurrentTime;