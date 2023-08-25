"use client";

import Link from "next/link";
import NextImage from "next/image";
import { useSession, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";

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
import { EditIcon } from "@chakra-ui/icons";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface Props {
  children: React.ReactNode;
}

const Links = ["Create Event"];

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

export default function WithAction() {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const [user, setUser] = useState({
    googleProfileImage: "",
    userUpdatedProfileImage: "",
  });

  useEffect(() => {
    const getUserDetails = async () => {
      const response = await fetch(`/api/user/${session?.user.id}`);
      const data = await response.json();
      console.log(data);

      setUser({
        googleProfileImage: data.googleProfileImage,
        userUpdatedProfileImage: data.userUpdatedProfileImage,
      });
    };

    if (session?.user.id) getUserDetails();
  }, [session?.user.id]);

  const [profilePicture, setProfilePicture] = useState("");

  const fetchProfilePicture = async () => {
    try {
      const keysArray = [user.userUpdatedProfileImage];
      const response = await fetch(
        `/api/media?keys=${encodeURIComponent(JSON.stringify(keysArray))}`
      );
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setProfilePicture(data.urls[0]);
      } else {
        console.error("Error fetching profile picture");
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  useEffect(() => {
    if (user?.userUpdatedProfileImage) {
      fetchProfilePicture();
    }
  }, [user?.userUpdatedProfileImage]);

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
              <Button
                variant={"solid"}
                colorScheme="facebook"
                isActive={true}
                className="hover:opacity-80"
                size={"md"}
                mr={4}
                leftIcon={<EditIcon />}
              >
                <a href="/create-event">Create Event</a>
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  {user?.userUpdatedProfileImage ? (
                    <Avatar size={"sm"} src={profilePicture} />
                  ) : (
                    <Avatar size={"sm"} src={user.googleProfileImage} />
                  )}
                </MenuButton>
                <MenuList>
                  <a href="/profile">
                    <MenuItem>My Profile</MenuItem>
                  </a>
                  <MenuDivider />
                  <MenuItem
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

          {isOpen ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                {Links.map((link) => (
                  <Nav key={link}>{link}</Nav>
                ))}
              </Stack>
            </Box>
          ) : null}
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
                onClick={onOpen}
              >
                About Us
              </Button>
              <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                size="xl"
                finalFocusRef={btnRef}
              >
                <DrawerOverlay />
                <DrawerContent className="overflow-hidden">
                  <DrawerCloseButton />
                  <DrawerHeader>
                    <Heading colorScheme="facebook">About Us</Heading>
                  </DrawerHeader>

                  <DrawerBody>
                    <Text className="pb-6">
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
                    <Heading className="pb-8" colorScheme="facebook">Founding Fathers</Heading>
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

                          <Button
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
                            isActive="true"
                            className="hover:opacity-80 ml-2"
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

                          <Button
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
                            isActive="true"
                            className="hover:opacity-80 ml-2"
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

                          <Button
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
                            isActive="true"
                            className="hover:opacity-80 ml-2"
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
