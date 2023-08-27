"use client";

import Link from "next/link";
import NextImage from "next/image";
import { useSession, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import EventForm from "/components/EventForm";
import { useRouter, usePathname } from "next/navigation";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Input,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5"; 

interface Props {
  children: React.ReactNode;
}

const Nav = (props: Props) => {
  const { children } = props;
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
};

export default function WithAction( { fetchAllEvents }) {
  const { data: session } = useSession();
  const { isOpen: isCreateEventOpen, onOpen: onCreateEventOpen, onClose: onCreateEventClose } = useDisclosure();
  const { isOpen: isAboutOpen, onOpen: onAboutOpen, onClose: onAboutClose } = useDisclosure();
  const btnRef = React.useRef();
  const router = useRouter();
  const pathname = usePathname();
  const [home, setHome] = useState(false);

  useEffect(() => {
    if (pathname === "/home") {
      setHome(true);
    }
  }, [pathname]);

  const [user, setUser] = useState({
    attendingEvents: [],
  });

  // const [user, setUser] = useState({
  //   googleProfileImage: "",
  //   userUpdatedProfileImage: "",
  // });

  // useEffect(() => {
  //   const getUserDetails = async () => {
  //     const response = await fetch(`/api/user/${session?.user.id}`);
  //     const data = await response.json();
  //     console.log(data);

  //     setUser({
  //       googleProfileImage: data.googleProfileImage,
  //       userUpdatedProfileImage: data.userUpdatedProfileImage,
  //     });
  //   };

  //   if (session?.user.id) getUserDetails();
  // }, [session?.user.id]);

  // const [profilePicture, setProfilePicture] = useState("");

  // const fetchProfilePicture = async () => {
  //   try {
  //     const keysArray = [user.userUpdatedProfileImage];
  //     const response = await fetch(
  //       `/api/media?keys=${encodeURIComponent(JSON.stringify(keysArray))}`
  //     );
  //     const data = await response.json();
  //     console.log(data);

  //     if (response.ok) {
  //       setProfilePicture(data.urls[0]);
  //     } else {
  //       console.error("Error fetching profile picture");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching profile picture:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (user?.userUpdatedProfileImage) {
  //     fetchProfilePicture();
  //   }
  // }, [user?.userUpdatedProfileImage]);

  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState({
    eventName: "",
    eventDescription: "",
    location: "",
    zoomLink: "",
    isPublic: false,
    isVirtual: false,
    isCompleted: false,
    interested: [],
    startDate: null,
    startTime: "",
    timeZone: "",
    closestCity: "",
    eventImage: null,
  });


  const validateFields = () => {
    if (
      !event.eventName ||
      !event.eventDescription ||
      !event.startDate ||
      !event.startTime ||
      !event.timeZone ||
      !event.closestCity
    ) {
      // Return false if any required field is missing
      return false;
    }
    if (!event.isVirtual && !event.location) {
      // Return false if location is required for in-person events and is missing
      return false;
    }
    if (event.isVirtual && !event.zoomLink) {
      // Return false if virtual link is required for virtual events and is missing
      return false;
    }
    return true;
  };

  const toast = useToast();

  const createEvent = async (newEvent) => {
    setSubmitting(true);

    console.log(event);

    if (!validateFields()) {
      toast({
        title: "Please fill out all required fields before submitting",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/event/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
          eventName: newEvent.eventName,
          eventDescription: newEvent.eventDescription,
          attendees: [session?.user.id],
          interested: newEvent.interested,
          isPublic: newEvent.isPublic,
          isVirtual: newEvent.isVirtual,
          startDate: newEvent.startDate,
          startTime: newEvent.startTime,
          timeZone: newEvent.timeZone,
          location: newEvent.location,
          closestCity: newEvent.closestCity,
          zoomLink: newEvent.zoomLink,
          isCompleted: newEvent.isCompleted,
          eventImage: newEvent.eventImage,
        }),
      });

      if (response.ok) {
        const responseData = await response.json(); // Parse the response JSON
        const eventId = responseData._id;

        const userDataResponse = await fetch(`/api/user/${session?.user.id}`);
        const userData = await userDataResponse.json();

        const updatedAttendingEvents = [...userData.attendingEvents, eventId];

        const userResponse = await fetch(
          `/api/user/${session?.user.id}?type=attending`,
          {
            method: "PATCH",
            body: JSON.stringify({
              attendingEvents: updatedAttendingEvents,
            }),
          }
        );

        if (userResponse.ok) {
          toast({
            title: "Event successfully created",
            status: "success",
            duration: 4000,
            isClosable: true,
          });

          onCreateEventClose();
          if (home) {
            fetchAllEvents();
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeysArray = async (keysArray) => {
    setNewEvent({ ...event, eventImage: keysArray[0] });
  };

  const [newEvent, setNewEvent] = useState(null);

  return (
    <>
      {session?.user.id ? (
        <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <HStack spacing={8} alignItems={"center"}>
              <Box>
                <Link href="/" className="flex gap-2 flex-center">
                  <NextImage
                    src="/assets/images/shield.png"
                    alt="University of Pennsylvania Logo"
                    width={30}
                    height={30}
                    className="object-contain hover:"
                  />
                  <p className="logo_text">Founding Friends</p>
                </Link>
              </Box>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              ></HStack>
            </HStack>
            <Flex alignItems={"center"}>
            {!home && <Button
                variant={"solid"}
                colorScheme="facebook"
                isActive={true}
                className="hover:opacity-80"
                size={"md"}
                mr={4}
                onClick={()=>{
                  router.push("/home");
                }}
                rightIcon={<IoHomeOutline />}
              >
                Home
              </Button>}
              <Button
                variant={"solid"}
                colorScheme="facebook"
                isActive={true}
                className="hover:opacity-80"
                size={"md"}
                mr={4}
                onClick={onCreateEventOpen}
                rightIcon={<EditIcon />}
              >
                Create Event
              </Button>
              <Modal
                isOpen={isCreateEventOpen}
                size="2xl"
                onClose={onCreateEventClose}
                closeOnOverlayClick={false}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Create Event</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <EventForm
                      type="Create"
                      event={event}
                      setEvent={setEvent}
                      submitting={submitting}
                      handleSubmit={createEvent}
                      handleKeysArray={handleKeysArray}
                      newEvent={newEvent}
                      setNewEvent={setNewEvent}
                    />
                  </ModalBody>

                  <ModalFooter>
                    <Button variant="outline" mr={3} onClick={onCreateEventClose}>
                      Cancel
                    </Button>
                    {submitting ? (
                      <Button
                        colorScheme="facebook"
                        isLoading
                        loadingText="Submitting..."
                        isActive={true}
                      >
                        Submit
                      </Button>
                    ) : (
                      <Button
                        colorScheme="facebook"
                        isActive={true}
                        className="hover:opacity-80"
                        onClick={() => {
                          createEvent(newEvent);
                        }}
                      >
                        Submit
                      </Button>
                    )}
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Menu>
                <MenuButton
                  as={IconButton}
                  size="md"
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="outline"
                  colorScheme="facebook"
                  className="hover:bg-gray-200"
                ></MenuButton>
                <MenuList>
                  <a href="/profile">
                    <MenuItem className="hover:bg-gray-200">
                      My Profile
                    </MenuItem>
                  </a>
                  <MenuDivider />
                  <MenuItem
                    className="hover:bg-gray-200"
                    onClick={onAboutOpen}
                  >
                    About
                  </MenuItem>

                  <Drawer
                    isOpen={isAboutOpen}
                    placement="right"
                    onClose={onAboutClose}
                    size="xl"
                    finalFocusRef={btnRef}
                  >
                    <DrawerOverlay />
                    <DrawerContent className="overflow-hidden">
                      <DrawerCloseButton className="hover:opacity-50" />
                      <DrawerHeader>
                        <Heading colorScheme="facebook">
                          About Founding Friends
                        </Heading>
                      </DrawerHeader>

                      <DrawerBody>
                        <Text className="pb-4">
                          {" "}
                          Introducing a digital platform that facilitates
                          in-person gatherings, our student meet-up app empowers
                          online students to design and join a range of events.
                          Users can provide an outline for each gathering,
                          detailing its purpose, location, and schedule, as well
                          as initiate conversations about the agenda, share
                          photos, and engage in related dialogues. Following the
                          conclusion of each meetup, the details will be
                          preserved in an archive, allowing individuals to
                          revisit the fond memories of past events.{" "}
                        </Text>
                        <Heading className="pb-4" colorScheme="facebook">
                          Founding Fathers
                        </Heading>
                        <Card
                          direction={{ base: "column", sm: "row" }}
                          overflow="hidden"
                          variant="outline"
                        >
                          <Image
                            objectFit="cover"
                            src="https://media.licdn.com/dms/image/C4E03AQF40mBwJbL_ZQ/profile-displayphoto-shrink_800_800/0/1611695156693?e=1698278400&v=beta&t=iLM9cbJNz2324I8_YjyV3ifv0EZ0hEJeMhfgOnMpgjg"
                            alt="Bonnie"
                            maxW={{ base: "100%", sm: "200px" }}
                          />
                          <Stack>
                            <CardBody>
                              <Heading size="md">Bonnie Tse</Heading>

                              <Text py="2">
                                Bonnie is an online MCIT student as part of the
                                Spring 2021 cohort. While pursuing this degree,
                                Bonnie recently started working as a full-stack
                                software engineer and is actively involved in
                                the tech community as she participates in the
                                MOSA hackathon this summer, collaborating with
                                fellow innovators to create innovative
                                solutions.
                              </Text>
                              <div className="flex space-x-4">
                                <Button
                                  size="md"
                                  isActive="true"
                                  className="hover:opacity-80"
                                  colorScheme="linkedin"
                                  leftIcon={<FaLinkedin />}
                                  onClick={() =>
                                    window.open(
                                      "https://www.linkedin.com/in/bonnietse/",
                                      "_blank"
                                    )
                                  }
                                >
                                  LinkedIn
                                </Button>

                                <Button
                                  size="md"
                                  isActive="true"
                                  className="hover:opacity-80"
                                  leftIcon={<FaGithub />}
                                  onClick={() =>
                                    window.open(
                                      "https://github.com/bonniewt",
                                      "_blank"
                                    )
                                  }
                                >
                                  GitHub
                                </Button>
                              </div>
                            </CardBody>
                          </Stack>
                        </Card>
                        <Card
                          direction={{ base: "column", sm: "row" }}
                          overflow="hidden"
                          variant="outline"
                        >
                          <Image
                            objectFit="cover"
                            src="https://media.licdn.com/dms/image/D5603AQGfqevGzPNkrw/profile-displayphoto-shrink_800_800/0/1689120976379?e=1698278400&v=beta&t=qB9fqVtuKoa_V_vzpJPmlh-Geca1TApeusmG9Dg-DFI"
                            alt="Kevin"
                            maxW={{ base: "100%", sm: "200px" }}
                          />
                          <Stack>
                            <CardBody>
                              <Heading size="md">Kevin Nguyen</Heading>

                              <Text py="2">
                                Kevin enrolled in the Fall 2022 cohort of the
                                MCIT program. While starting as a medical scribe
                                with aspirations of attending medical school,
                                his interest shifted due to the conservative
                                nature of medicine and its sluggish adoption of
                                modern technology. This led him to discover a
                                passion for computer science. Through the UPenn
                                MCIT program, he aims to leverage his newfound
                                interest to navigate the dynamic technology
                                sector, nurturing his thirst for knowledge and
                                innovation.
                              </Text>
                              <div className="flex space-x-4">
                                <Button
                                  size="md"
                                  isActive="true"
                                  className="hover:opacity-80"
                                  colorScheme="linkedin"
                                  leftIcon={<FaLinkedin />}
                                  onClick={() =>
                                    window.open(
                                      "https://www.linkedin.com/in/kebin-linked/",
                                      "_blank"
                                    )
                                  }
                                >
                                  LinkedIn
                                </Button>
                                <Button
                                  size="md"
                                  isActive="true"
                                  className="hover:opacity-80"
                                  leftIcon={<FaGithub />}
                                  onClick={() =>
                                    window.open(
                                      "https://github.com/kebinjpeg",
                                      "_blank"
                                    )
                                  }
                                >
                                  GitHub
                                </Button>
                              </div>
                            </CardBody>
                          </Stack>
                        </Card>
                        <Card
                          direction={{ base: "column", sm: "row" }}
                          overflow="hidden"
                          variant="outline"
                        >
                          <Image
                            objectFit="cover"
                            src="https://media.licdn.com/dms/image/C5603AQG19HBs2XI6uA/profile-displayphoto-shrink_800_800/0/1641970539103?e=1698278400&v=beta&t=mGW6wjJTFjYyYwZeE_ZW2CS7un1qWz-8UCA6dIbmCIM"
                            alt="Kyle"
                            maxW={{ base: "100%", sm: "200px" }}
                          />
                          <Stack>
                            <CardBody>
                              <Heading size="md">Kyle Li</Heading>

                              <Text py="2">
                                A former medical office manager and now a full
                                stack software engineer, Kyle is part of MCIT
                                online’s Fall 2022 cohort. He brings a unique
                                blend of experiences to the field of technology,
                                working to develop groundbreaking solutions to
                                address real world challenges.
                              </Text>
                              <div className="flex space-x-4">
                                <Button
                                  size="md"
                                  isActive="true"
                                  className="hover:opacity-80"
                                  colorScheme="linkedin"
                                  leftIcon={<FaLinkedin />}
                                  onClick={() =>
                                    window.open(
                                      "https://www.linkedin.com/in/kyleguanyili/",
                                      "_blank"
                                    )
                                  }
                                >
                                  LinkedIn
                                </Button>
                                <Button
                                  size="md"
                                  isActive="true"
                                  className="hover:opacity-80"
                                  leftIcon={<FaGithub />}
                                  onClick={() =>
                                    window.open(
                                      "https://github.com/kyle-guanyi",
                                      "_blank"
                                    )
                                  }
                                >
                                  GitHub
                                </Button>
                              </div>
                            </CardBody>
                          </Stack>
                        </Card>
                      </DrawerBody>
                    </DrawerContent>
                  </Drawer>
                  <MenuDivider />
                  <MenuItem
                    className="hover:bg-gray-200 text-red-600"
                    onClick={() => {
                      signOut();
                    }}
                  >
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
        </Box>
      ) : (
        <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <HStack spacing={8} alignItems={"center"}>
              <Box>
                <Link href="/" className="flex gap-2 flex-center">
                  <NextImage
                    src="/assets/images/shield.png"
                    alt="University of Pennsylvania Logo"
                    width={30}
                    height={30}
                    className="object-contain"
                  />
                  <p className="logo_text">Founding Friends</p>
                </Link>
              </Box>
            </HStack>
            <Flex alignItems={"center"}>
              <Button
                ref={btnRef}
                colorScheme="facebook"
                isActive="true"
                className="hover:opacity-80 mx-auto"
                onClick={onAboutOpen}
              >
                About Us
              </Button>
              <Drawer
                isOpen={isAboutOpen}
                placement="right"
                onClose={onAboutClose}
                size="xl"
                finalFocusRef={btnRef}
              >
                <DrawerOverlay />
                <DrawerContent className="overflow-hidden">
                  <DrawerCloseButton className="hover:opacity-50" />
                  <DrawerHeader>
                    <Heading colorScheme="facebook">
                      About Founding Friends
                    </Heading>
                  </DrawerHeader>

                  <DrawerBody>
                    <Text className="pb-4">
                      {" "}
                      Introducing a digital platform that facilitates in-person
                      gatherings, our student meet-up app empowers online
                      students to design and join a range of events. Users can
                      provide an outline for each gathering, detailing its
                      purpose, location, and schedule, as well as initiate
                      conversations about the agenda, share photos, and engage
                      in related dialogues. Following the conclusion of each
                      meetup, the details will be preserved in an archive,
                      allowing individuals to revisit the fond memories of past
                      events.{" "}
                    </Text>
                    <Heading className="pb-4" colorScheme="facebook">
                      Founding Fathers
                    </Heading>
                    <Card
                      direction={{ base: "column", sm: "row" }}
                      overflow="hidden"
                      variant="outline"
                    >
                      <Image
                        objectFit="cover"
                        src="https://media.licdn.com/dms/image/C4E03AQF40mBwJbL_ZQ/profile-displayphoto-shrink_800_800/0/1611695156693?e=1698278400&v=beta&t=iLM9cbJNz2324I8_YjyV3ifv0EZ0hEJeMhfgOnMpgjg"
                        alt="Bonnie"
                        maxW={{ base: "100%", sm: "200px" }}
                      />
                      <Stack>
                        <CardBody>
                          <Heading size="md">Bonnie Tse</Heading>

                          <Text py="2">
                            Bonnie is an online MCIT student as part of the
                            Spring 2021 cohort. While pursuing this degree,
                            Bonnie recently started working as a full-stack
                            software engineer and is actively involved in the
                            tech community as she participates in the MOSA
                            hackathon this summer, collaborating with fellow
                            innovators to create innovative solutions.
                          </Text>
                          <div className="flex space-x-4">
                            <Button
                              size="md"
                              isActive="true"
                              className="hover:opacity-80"
                              colorScheme="linkedin"
                              leftIcon={<FaLinkedin />}
                              onClick={() =>
                                window.open(
                                  "https://www.linkedin.com/in/bonnietse/",
                                  "_blank"
                                )
                              }
                            >
                              LinkedIn
                            </Button>

                            <Button
                              size="md"
                              isActive="true"
                              className="hover:opacity-80"
                              leftIcon={<FaGithub />}
                              onClick={() =>
                                window.open(
                                  "https://github.com/bonniewt",
                                  "_blank"
                                )
                              }
                            >
                              GitHub
                            </Button>
                          </div>
                        </CardBody>
                      </Stack>
                    </Card>
                    <Card
                      direction={{ base: "column", sm: "row" }}
                      overflow="hidden"
                      variant="outline"
                    >
                      <Image
                        objectFit="cover"
                        src="https://media.licdn.com/dms/image/D5603AQGfqevGzPNkrw/profile-displayphoto-shrink_800_800/0/1689120976379?e=1698278400&v=beta&t=qB9fqVtuKoa_V_vzpJPmlh-Geca1TApeusmG9Dg-DFI"
                        alt="Kevin"
                        maxW={{ base: "100%", sm: "200px" }}
                      />
                      <Stack>
                        <CardBody>
                          <Heading size="md">Kevin Nguyen</Heading>

                          <Text py="2">
                            Kevin enrolled in the Fall 2022 cohort of the MCIT
                            program. While starting as a medical scribe with
                            aspirations of attending medical school, his
                            interest shifted due to the conservative nature of
                            medicine and its sluggish adoption of modern
                            technology. This led him to discover a passion for
                            computer science. Through the UPenn MCIT program, he
                            aims to leverage his newfound interest to navigate
                            the dynamic technology sector, nurturing his thirst
                            for knowledge and innovation.
                          </Text>
                          <div className="flex space-x-4">
                            <Button
                              size="md"
                              isActive="true"
                              className="hover:opacity-80"
                              colorScheme="linkedin"
                              leftIcon={<FaLinkedin />}
                              onClick={() =>
                                window.open(
                                  "https://www.linkedin.com/in/kebin-linked/",
                                  "_blank"
                                )
                              }
                            >
                              LinkedIn
                            </Button>
                            <Button
                              size="md"
                              isActive="true"
                              className="hover:opacity-80"
                              leftIcon={<FaGithub />}
                              onClick={() =>
                                window.open(
                                  "https://github.com/kebinjpeg",
                                  "_blank"
                                )
                              }
                            >
                              GitHub
                            </Button>
                          </div>
                        </CardBody>
                      </Stack>
                    </Card>
                    <Card
                      direction={{ base: "column", sm: "row" }}
                      overflow="hidden"
                      variant="outline"
                    >
                      <Image
                        objectFit="cover"
                        src="https://media.licdn.com/dms/image/C5603AQG19HBs2XI6uA/profile-displayphoto-shrink_800_800/0/1641970539103?e=1698278400&v=beta&t=mGW6wjJTFjYyYwZeE_ZW2CS7un1qWz-8UCA6dIbmCIM"
                        alt="Kyle"
                        maxW={{ base: "100%", sm: "200px" }}
                      />
                      <Stack>
                        <CardBody>
                          <Heading size="md">Kyle Li</Heading>

                          <Text py="2">
                            A former medical office manager and now a full stack
                            software engineer, Kyle is part of MCIT online’s
                            Fall 2022 cohort. He brings a unique blend of
                            experiences to the field of technology, working to
                            develop groundbreaking solutions to address real
                            world challenges.
                          </Text>
                          <div className="flex space-x-4">
                            <Button
                              size="md"
                              isActive="true"
                              className="hover:opacity-80"
                              colorScheme="linkedin"
                              leftIcon={<FaLinkedin />}
                              onClick={() =>
                                window.open(
                                  "https://www.linkedin.com/in/kyleguanyili/",
                                  "_blank"
                                )
                              }
                            >
                              LinkedIn
                            </Button>
                            <Button
                              size="md"
                              isActive="true"
                              className="hover:opacity-80"
                              leftIcon={<FaGithub />}
                              onClick={() =>
                                window.open(
                                  "https://github.com/kyle-guanyi",
                                  "_blank"
                                )
                              }
                            >
                              GitHub
                            </Button>
                          </div>
                        </CardBody>
                      </Stack>
                    </Card>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </Flex>
          </Flex>
        </Box>
      )}
    </>
  );
}
