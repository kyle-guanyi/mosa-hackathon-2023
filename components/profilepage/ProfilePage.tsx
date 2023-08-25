"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Collapse,
  Image,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  Box,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  InputRightAddon,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useDisclosure,
} from "@chakra-ui/react";

import { EditIcon } from "@chakra-ui/icons";

import ProfileForm from "/components/ProfileForm";

const ProfilePage = ({ profileDetails, handleEdit }) => {
  const [profilePicture, setProfilePicture] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();

  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);

  const fetchProfilePicture = async () => {
    try {
      const keysArray = [profileDetails.userUpdatedProfileImage];
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
    if (profileDetails?.userUpdatedProfileImage) {
      fetchProfilePicture();
    }
  }, [profileDetails?.userUpdatedProfileImage]);

  const router = useRouter();
  const { data: session } = useSession();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    closestMainCity: "",
    timeZone: "",
    gender: "",
    bio: "",
    classesTaken: [],
    fieldOfInterest: [],
    userUpdatedProfileImage: "",
  });

  const [submitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      const response = await fetch(`/api/user/${session?.user.id}`);
      const data = await response.json();
      console.log(data);

      setUser({
        firstName: data.firstName,
        lastName: data.lastName,
        closestMainCity: data.closestMainCity,
        timeZone: data.timeZone,
        gender: data.gender,
        bio: data.bio,
        classesTaken: data.classesTaken,
        fieldOfInterest: data.fieldOfInterest,
        userUpdatedProfileImage: data.userUpdatedProfileImage,
      });
    };

    if (session?.user.id) getUserDetails();
  }, [session?.user.id]);

  const updateUser = async (updatedUser) => {
    setIsSubmitting(true);

    if (!session?.user.id) return alert("Missing User Id!");

    try {
      const response = await fetch(`/api/user/${session?.user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          closestMainCity: updatedUser.closestMainCity,
          timeZone: updatedUser.timeZone,
          gender: updatedUser.gender,
          bio: updatedUser.bio,
          classesTaken: updatedUser.classesTaken,
          fieldOfInterest: updatedUser.fieldOfInterest,
          userUpdatedProfileImage: updatedUser.userUpdatedProfileImage,
        }),
      });

      if (response.ok) {
        handleEdit();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUserProfilePic = async (newProfileImage) => {
    setIsSubmitting(true);

    if (!session?.user.id) return alert("Missing User Id!");
    console.log(newProfileImage);
    try {
      const response = await fetch(`/api/user/${session?.user.id}?type=pic`, {
        method: "PATCH",
        body: JSON.stringify({
          userUpdatedProfileImage: newProfileImage,
        }),
      });
      if (response.ok) {
        handleEdit();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeysArray = async (keysArray) => {
    updateUserProfilePic(keysArray[0]);
  };

  const [updatedUser, setUpdatedUser] = useState(null);

  return (
    <div>
      <div
        style={{
          background: `url('/assets/images/pennBuilding.jpeg') no-repeat center center fixed`,
          backgroundSize: "cover",
          height: "100%",
          width: "100%", // Set the background image to cover the entire viewport
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          top: "0",
          left: "0",
          position: "absolute",
          opacity: "80%",
        }}
      />

      <Card maxW="lg" p="4" m="4" borderRadius="20px">
        <Flex direction="column" alignItems="center" justifyContent="center">
          <CardHeader>
            <div className="pt-4 flex">
              {profileDetails?.userUpdatedProfileImage ? (
                <Image
                  className="mx-auto"
                  boxSize="300px"
                  borderRadius="full"
                  objectFit="cover"
                  alt={profileDetails?.firstName}
                  src={profilePicture}
                />
              ) : (
                profileDetails?.googleProfileImage && (
                  <Image
                    className="mx-auto"
                    boxSize="300px"
                    borderRadius="full"
                    objectFit="cover"
                    alt={profileDetails?.firstName}
                    src={profileDetails?.googleProfileImage}
                  />
                )
              )}
            </div>
            <div className="flex">
              <h1 className="head_text mx-auto">
                {profileDetails?.firstName} {profileDetails?.lastName}
              </h1>
            </div>

            <div className="pt-4 flex">
              <h3 className="mx-auto">{profileDetails?.email}</h3>
            </div>
            <div className="pt-1 flex">
            {profileDetails && profileDetails.gender !== "Decline to Answer" && (
    <h3 className="mx-auto"><em>({profileDetails.gender})</em></h3>
  )}
            </div>
            <div className="pt-4 flex">
              {session?.user.id === profileDetails?._id && (
                <>
                  <Button
                    leftIcon={<EditIcon />}
                    colorScheme="facebook"
                    isActive="true"
                    className="hover:opacity-80 mx-auto"
                    onClick={onOpen}
                  >
                    Edit My Profile
                  </Button>
                  <Drawer
                    isOpen={isOpen}
                    placement="right"
                    size="xl"
                    initialFocusRef={firstField}
                    onClose={onClose}
                  >
                    <DrawerOverlay />
                    <DrawerContent>
                      <DrawerCloseButton />
                      <DrawerHeader borderBottomWidth="1px">
                        Edit Profile
                      </DrawerHeader>
                      <DrawerBody>
                        <ProfileForm
                          type="Edit"
                          user={user}
                          setUser={setUser}
                          submitting={submitting}
                          handleSubmit={updateUser}
                          handleKeysArray={handleKeysArray}
                          firstField={firstField}
                          updatedUser={updatedUser}
                          setUpdatedUser={setUpdatedUser}
                        />
                      </DrawerBody>
                      {/* You can customize the footer buttons as needed */}
                      <DrawerFooter borderTopWidth="1px">
                        <Button variant="outline" mr={3} onClick={onClose}>
                          Cancel
                        </Button>
                        <Button
                          colorScheme="facebook"
                          isActive="true"
                          className="hover:opacity-80"
                          onClick={() => {
                            updateUser(updatedUser);
                            onClose();
                          }}
                        >
                          Submit
                        </Button>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </>
              )}
            </div>
          </CardHeader>
          <Divider />
          <div className="pt-4 pb-4">
            <Collapse
              startingHeight={100}
              in={show}
              className="mx-auto text-justify"
            >
              {profileDetails?.bio}
            </Collapse>
            <Button size="sm" 
                          isActive="true"
                          className="hover:opacity-80" onClick={handleToggle} mt="1rem">
              Show {show ? "Less" : "More"}
            </Button>
            <Text></Text>
          </div>
          <Divider />
          <div className="pt-4 pb-4 w-full">
            <TableContainer className="w-full" style={{ width: "100%" }}>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Classes Taken</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {profileDetails?.classesTaken?.map((classTaken, index) => (
                    <Tr key={index}>
                      <Td>{classTaken}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
          <div className="mt-4 mb-10 w-full">
            <TableContainer className="w-full" style={{ width: "100%" }}>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Fields of Interest</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {profileDetails?.fieldOfInterest?.map(
                    (fieldInterest, index) => (
                      <Tr key={index}>
                        <Td>{fieldInterest}</Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        </Flex>
      </Card>
    </div>
  );
};

export default ProfilePage;
