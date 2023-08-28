"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { DateTime } from "luxon";
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Text,
  Tooltip,
  SkeletonCircle,
  AvatarGroup,
  Skeleton
} from "@chakra-ui/react";

const SmallerEventCard = ({ event }) => {
  const [isLoading, setIsLoading] = useState(true);

  // fetch profilepic for user
  const [eventPicture, setEventPicture] = useState("");
  const fetchEventPicture = useCallback(async () => {
    try {
      setIsLoading(true);
      const keysArray = [event.eventImage]; // Convert to an array
      const response = await fetch(
        `/api/media?keys=${encodeURIComponent(JSON.stringify(keysArray))}`
      );
      const data = await response.json();

      if (response.ok) {
        setEventPicture(data.urls[0]);
      } else {
        console.error("Error fetching event picture");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching event picture:", error);
      setIsLoading(false);
    }
  }, [event.eventImage]);

  useEffect(() => {
    if (event?.eventImage) {
      fetchEventPicture();
    }
  }, [event?.eventImage]);

  // fetch profilepic for user
  const [eventAttendeesPictures, setEventAttendeesPictures] = useState([
    {
      firstName: "",
      lastName: "",
      googleProfileImage: "",
      userUpdatedProfileImage: "",
    },
  ]);

  const fetchEventAttendeesPicture = useCallback(async () => {
    try {
      setIsLoading(true);
      const attendeeInfoResponse = await fetch(`/api/event/${event._id}`);
      const attendeeInfoData = await attendeeInfoResponse.json();

      const attendeesResponses = await Promise.all(
        attendeeInfoData.attendees.map(async (attendeeId) => {
          const response = await fetch(`/api/user/${attendeeId}`);
          return await response.json();
        })
      );

      const updatedEventAttendeesPictures = attendeesResponses.map(
        (attendeeData) => ({
          firstName: attendeeData.firstName,
          lastName: attendeeData.lastName,
          googleProfileImage: attendeeData.googleProfileImage,
          userUpdatedProfileImage: attendeeData.userUpdatedProfileImage,
        })
      );

      setEventAttendeesPictures(updatedEventAttendeesPictures);

      const userUpdatedProfileImageKeysArray = attendeesResponses.map(
        (attendeeData) => attendeeData.userUpdatedProfileImage
      );

      const filteredUserUpdatedProfileImageKeysArray =
        userUpdatedProfileImageKeysArray.filter((key) => key);

      if (filteredUserUpdatedProfileImageKeysArray.length > 0) {
        const userUpdatedProfileImageResponse = await fetch(
          `/api/media?keys=${encodeURIComponent(
            JSON.stringify(filteredUserUpdatedProfileImageKeysArray)
          )}`
        );

        const userUpdatedProfileImageData =
          await userUpdatedProfileImageResponse.json();

        if (userUpdatedProfileImageResponse.ok) {
          const updatedPictures = updatedEventAttendeesPictures.map(
            (attendee, index) => ({
              ...attendee,
              userUpdatedProfileImage: userUpdatedProfileImageData.urls[index],
            })
          );
          // console.log("These are the updated pictures: ", updatedPictures);
          setEventAttendeesPictures(updatedPictures);
          setIsLoading(false);
        } else {
          console.error("Error fetching attendee picture information");
          setIsLoading(false);
        }
      } else {
        console.log("No valid keys for user updated profile images.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching attendee picture information:", error);
      setIsLoading(false);
    }
  }, [event?.attendees]);

  useEffect(() => {
    if (event?.attendees) {
      fetchEventAttendeesPicture();
    }
  }, [event?.attendees]);

  const [userEventDateTime, setUserEventDateTime] = useState(null);
  const [eventDateTime, setEventDateTime] = useState(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.id) {
      const year = parseInt(event.startDate.substring(0, 4), 10);
      const month = parseInt(event.startDate.substring(5, 7), 10);
      const day = parseInt(event.startDate.substring(8, 10), 10);

      // Extract hours and minutes from the startTime string
      const hours = parseInt(event.startTime.substring(0, 2), 10);
      const minutes = parseInt(event.startTime.substring(3, 5), 10);
      // Create a DateTime object for the start date
      const eventStartDate = DateTime.fromObject(
        {
          year: year,
          month: month,
          day: day,
          hour: hours,
          minute: minutes,
          second: 0,
          millisecond: 0,
        },
        { zone: event.timeZone }
      );

      setEventDateTime(eventStartDate);

      const userAdjustedStartDate = eventStartDate.toLocal();

      setUserEventDateTime(userAdjustedStartDate);
    }
  }, [session?.user.id]);

  const timezoneMapping = {
    "Etc/GMT+12": "UTC-12",
    "Pacific/Niue": "UTC-11",
    "Pacific/Marquesas": "UTC-09:30",
    "America/Adak": "HST", // Not a standard acronym; using HST as an example
    "America/Los_Angeles": "PST",
    "America/Denver": "MST",
    "America/Chicago": "CST",
    "America/New_York": "EST",
    "America/Halifax": "AST",
    "America/St_Johns": "NST",
    "America/Manaus": "AMT",
    "America/Noronha": "FNT",
    "Atlantic/Azores": "AZOST",
    "Etc/GMT": "GMT",
    "Europe/Paris": "CET",
    "Europe/Kiev": "EET",
    "Europe/Moscow": "MSK",
    "Asia/Tehran": "IRST",
    "Asia/Dubai": "GST",
    "Asia/Kabul": "AFT",
    "Asia/Kolkata": "IST",
    "Asia/Kathmandu": "NPT",
    "Asia/Dhaka": "BST",
    "Asia/Yangon": "MMT",
    "Asia/Bangkok": "ICT",
    "Asia/Shanghai": "CST",
    "Australia/Eucla": "CWST",
    "Asia/Tokyo": "JST",
    "Australia/Adelaide": "ACST",
    "Asia/Seoul": "KST",
    "Australia/Lord_Howe": "LHST",
    "Pacific/Guadalcanal": "SBT",
    "Pacific/Norfolk": "NFT",
    "Pacific/Auckland": "NZST",
    "Pacific/Chatham": "CHAST",
    "Pacific/Tongatapu": "TOT",
    "Pacific/Kiritimati": "LINT",
  };

  const convertIANAToTimezoneAcronym = useCallback((ianaTimeZone) => {
    const mappedAcronym = timezoneMapping[ianaTimeZone];
    if (mappedAcronym) {
      return mappedAcronym;
    }

    const now = DateTime.now().setZone(ianaTimeZone);
    return now.toFormat("z");
  }, []);

  return (
    <Link href={`/event/${event._id}`}>
      <Card
        maxW="90%"
        className="m-auto cursor-pointer hover:-translate-y-2 hover:opacity-80 transition-all event-card"
      >
        <CardBody>
          <div className="horizontal-card-content">
            <div className="avatar-container">
              {isLoading ? (
                <Avatar size="md" />
              ) : (
                <Avatar
                  size="md"
                  name={`${event.eventName}`}
                  src={eventPicture || "/assets/images/benny.png"} // Use a default image here
                />
              )}
            </div>
            <div className="card-info">
              {isLoading ? (
                <>
                <Skeleton height="30px" width="100%" mt="2"/>
                <Skeleton height="20px" width="100%" mt="2"/>
                <Skeleton height="20px" width="100%" mt="2"/>
                <Skeleton height="20px" width="100%" mt="2"/>
                </>
                
              ) : (
                <div>
                  <Tooltip label={event.eventName} aria-label="Event Name">
                    <Heading size="md" className="event-name">
                      {event.eventName}
                    </Heading>
                  </Tooltip>
                  <Text>
                    <em>Major City/Region: {event.closestCity}</em>
                  </Text>
                  {/* ... (other event details) */}
                  <Text>
                    Event Local Time:
                    <br />
                    {eventDateTime?.toFormat("EEEE, MMMM d, yyyy")},{" "}
                    {eventDateTime?.toFormat("h:mm a")}{" "}
                    {convertIANAToTimezoneAcronym(eventDateTime?.zoneName)}
                  </Text>
                  <div className="extra-info">
                    <Text color="blue.600">
                      Time in {DateTime.local().zoneName}
                      <br />
                      {userEventDateTime?.toFormat("EEEE, MMMM d, yyyy")},{" "}
                      {userEventDateTime?.toFormat("h:mm a")}{" "}
                      {convertIANAToTimezoneAcronym(
                        userEventDateTime?.zoneName
                      )}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardBody>
        <Divider />
        <CardFooter>
          {isLoading ? (
            <SkeletonCircle size="10" mr="2" />
          ) : (
            <AvatarGroup size="md" max={3}>
              {eventAttendeesPictures.map((attendee, index) => (
                <Avatar
                  key={index}
                  name={`${attendee.firstName} ${attendee.lastName}`}
                  src={
                    attendee.userUpdatedProfileImage ||
                    attendee.googleProfileImage
                  }
                />
              ))}
            </AvatarGroup>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default SmallerEventCard;
