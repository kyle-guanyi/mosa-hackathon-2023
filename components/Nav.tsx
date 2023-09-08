// @ts-nocheck
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
  Card,
  CardBody,
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
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
/**
 * This component is used to render a navigation bar with actions.
 *
 * @constructor - Renders a navigation bar with actions
 * @returns A navigation bar with actions
 */
export default function WithAction() {
  const { data: session } = useSession();
  const { isOpen: isAboutOpen, onOpen: onAboutOpen, onClose: onAboutClose } = useDisclosure();
  const btnRef = React.useRef();
  const router = useRouter();
  const pathname = usePathname();
  const [home, setHome] = useState(false);

  useEffect(() => {
    if (pathname === "/home") {
      setHome(true);
    }
  }, []);


  return (
    <>
      {session?.user.id ? (
        <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <HStack spacing={8} alignItems={"center"}>
              <Box>
                <Link href="/" className="flex gap-2 flex-center">
                  <Image
                    src="https://i.imgur.com/UOP3Jhj.png"
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
                            alt="Bonnie Tse"
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
                            src="https://media.licdn.com/dms/image/D5603AQGB0XCWWC1Qhg/profile-displayphoto-shrink_800_800/0/1694106706934?e=1699488000&v=beta&t=1gOBo08E4C1-FsEjMjBBQfADxMCA3jK1LsTz0e3hsjc"
                            alt="Kevin Nguyen"
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
                            alt="Kyle Li"
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
                  <Image
                    src="https://i.imgur.com/UOP3Jhj.png"
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
