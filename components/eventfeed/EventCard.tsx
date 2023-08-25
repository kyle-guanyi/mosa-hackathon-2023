"use client";
import { useState, useEffect, useCallback } from "react";
// import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { DateTime } from "luxon";
import {
  Stack,
  Card,
  Heading,
  Text,
  CardBody,
  CardFooter,
  Image,
  Divider,
  AvatarGroup,
  Skeleton,
  SkeletonCircle,
  Avatar,
} from "@chakra-ui/react";

const EventCard = ({ event }) => {
  const router = useRouter();

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
          const data = await response.json();
          return data;
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
          console.log("These are the updated pictures: ", updatedPictures);
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

  const handleEventClick = () => {
    router.push(`/event/${event._id}`);
  };

  const [userEventDateTime, setUserEventDateTime] = useState(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.id) {
      const dateTimeObject = DateTime.fromISO(event.UTCEventTime);
      const userTimezone = DateTime.local().zoneName;
      const userEventDateTime = dateTimeObject.setZone(userTimezone);
      setUserEventDateTime(userEventDateTime);
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
    <Card
      maxW="90%"
      className="m-auto cursor-pointer hover:-translate-y-2 hover:opacity-80 transition-all"
      onClick={handleEventClick}
      height={isLoading ? "320px" : "auto"}
      minWidth="300px" // Add this line for minimum width
      minHeight="400px" // Add this line for minimum height
    >
      <CardBody>
        {isLoading ? (
          <Skeleton height="300px" width="100%" borderRadius="lg" />
        ) : event?.eventImage ? (
          <Image
            borderRadius="lg"
            src={eventPicture}
            alt="Cover Picture"
            height="300px"
            width="100%"
            objectFit="cover"
          />
        ) : (
          <Image
            borderRadius="lg"
            src="/assets/images/ben.png"
            alt="Default Cover Picture"
            height="300px"
            width="100%"
            objectFit="cover"
          />
        )}
        <Stack mt="6" spacing="3">
          {isLoading ? (
            <>
              <Skeleton height="20px" width="100%" />
              <Skeleton height="15px" width="100%" />
              <Skeleton height="15px" width="100%" />
              <Skeleton height="15px" width="100%" />
              <Skeleton height="20px" width="100%" />
            </>
          ) : (
            <>
              <Heading size="md">{event.eventName}</Heading>
              <Heading size="sm">{event.closestCity}</Heading>
              <Text>{event.location || "Virtual Event"}</Text>
              <Text>
                Event's Local Time:
                <br />
                {DateTime.fromISO(event.startDate.substring(0, 10)).toFormat(
                  "EEEE, MMMM d, yyyy"
                )}
                , {event.startTime}{" "}
                {convertIANAToTimezoneAcronym(event.timeZone)}
              </Text>
              <Text color="blue.600">
                Time in {DateTime.local().zoneName}
                <br />
                {userEventDateTime?.toFormat("cccc, LLLL d, yyyy")},{" "}
                {userEventDateTime?.toFormat("h:mm a")}
              </Text>
            </>
          )}
        </Stack>
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
  );
};

export default EventCard;
