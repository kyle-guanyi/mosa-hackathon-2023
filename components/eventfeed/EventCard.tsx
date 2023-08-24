"use client";
import { useState, useEffect } from "react";
// import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { DateTime } from "luxon";
import {
  Stack,
  Button,
  Card,
  Heading,
  Text,
  CardBody,
  CardFooter,
  Image,
  Divider
} from "@chakra-ui/react";

const EventCard = ({ event }) => {
  const router = useRouter();

  // fetch profilepic for user
  const [eventPicture, setEventPicture] = useState("");
  const fetchEventPicture = async () => {
    try {
      const keysArray = [event.eventImage]; // Convert to an array
      const response = await fetch(
        `/api/media?keys=${encodeURIComponent(JSON.stringify(keysArray))}`
      );
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setEventPicture(data.urls[0]);
      } else {
        console.error("Error fetching event picture");
      }
    } catch (error) {
      console.error("Error fetching event picture:", error);
    }
  };

  useEffect(() => {
    if (event?.eventImage) {
      fetchEventPicture();
    }
  }, [event?.eventImage]);

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
  'Etc/GMT+12': 'UTC-12',
  'Pacific/Niue': 'UTC-11',
  'Pacific/Marquesas': 'UTC-09:30',
  'America/Adak': 'HST',  // Not a standard acronym; using HST as an example
  'America/Los_Angeles': 'PST',
  'America/Denver': 'MST',
  'America/Chicago': 'CST',
  'America/New_York': 'EST',
  'America/Halifax': 'AST',
  'America/St_Johns': 'NST',
  'America/Manaus': 'AMT',
  'America/Noronha': 'FNT',
  'Atlantic/Azores': 'AZOST',
  'Etc/GMT': 'GMT',
  'Europe/Paris': 'CET',
  'Europe/Kiev': 'EET',
  'Europe/Moscow': 'MSK',
  'Asia/Tehran': 'IRST',
  'Asia/Dubai': 'GST',
  'Asia/Kabul': 'AFT',
  'Asia/Kolkata': 'IST',
  'Asia/Kathmandu': 'NPT',
  'Asia/Dhaka': 'BST',
  'Asia/Yangon': 'MMT',
  'Asia/Bangkok': 'ICT',
  'Asia/Shanghai': 'CST',
  'Australia/Eucla': 'CWST',
  'Asia/Tokyo': 'JST',
  'Australia/Adelaide': 'ACST',
  'Asia/Seoul': 'KST',
  'Australia/Lord_Howe': 'LHST',
  'Pacific/Guadalcanal': 'SBT',
  'Pacific/Norfolk': 'NFT',
  'Pacific/Auckland': 'NZST',
  'Pacific/Chatham': 'CHAST',
  'Pacific/Tongatapu': 'TOT',
  'Pacific/Kiritimati': 'LINT'
  };

  function convertIANAToTimezoneAcronym(ianaTimeZone) {
    const mappedAcronym = timezoneMapping[ianaTimeZone];
  if (mappedAcronym) {
    return mappedAcronym;
  }

  const now = DateTime.now().setZone(ianaTimeZone);
  return now.toFormat('z');
  }

  

  return (
    <Card maxW='90%' className="m-auto cursor-pointer hover:-translate-y-2 transition-all" onClick={handleEventClick}>
  <CardBody>
  {event?.eventImage ? (
        <Image
        borderRadius='lg'
        src={eventPicture}
        alt="Cover Picture"
        height="300px" // Adjust the height as needed
        width="100%" // Adjust the width as needed
        objectFit='cover'
      />
      ): (
<Image
        borderRadius='lg'
        src="/assets/images/ben.png"
        alt="Default Cover Picture"
        height="300px" // Adjust the height as needed
        width="100%" // Adjust the width as needed
        objectFit='cover'
      />
      )}
    <Stack mt='6' spacing='3'>
      <Heading size='md'>{event.eventName}</Heading>
      <Heading size='sm'>
      {event.closestCity}
      </Heading>
      <Text>
      {event.location || "Virtual Event"}
      </Text>
      <Text>
      Event's Local Time: 
      <br />
      {DateTime.fromISO(event.startDate.substring(0, 10)).toFormat('EEEE, MMMM d, yyyy')}, {event.startTime} {convertIANAToTimezoneAcronym(event.timeZone)}
      </Text>
      <Text color='blue.600'>
       Time in {DateTime.local().zoneName}
       <br />
       {userEventDateTime?.toFormat("cccc, LLLL d, yyyy")}, {userEventDateTime?.toFormat("h:mm a")}
      </Text>
    </Stack>
  </CardBody>
  <Divider />
  <CardFooter>
  </CardFooter>
</Card>
    
  );
};

export default EventCard;
