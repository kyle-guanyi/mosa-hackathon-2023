// @ts-nocheck
"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Collapse,
  Image,
  Card,
  CardHeader,
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
  Skeleton,
  SkeletonCircle,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
} from "@chakra-ui/react";

import { EditIcon } from "@chakra-ui/icons";
import ProfileForm from "/components/ProfileForm";

/**
 * This component is used to render a profile page.
 *
 * @param profileDetails -  A user JSON
 * @param handleEdit - A function to handle editing
 * @constructor - Renders a profile page
 * @returns A profile page
 */
const ProfilePage = ({ profileDetails, handleEdit }) => {
  const [profilePicture, setProfilePicture] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);

  const [isLoading, setIsLoading] = useState(true);

  /**
   * This function is used to fetch a profile picture.
   */
  const fetchProfilePicture = async () => {
    try {
      setIsLoading(true);
      const keysArray = [profileDetails.userUpdatedProfileImage];
      const response = await fetch(
        `/api/media?keys=${encodeURIComponent(JSON.stringify(keysArray))}`
      );
      const data = await response.json();

      if (response.ok) {
        setProfilePicture(data.urls[0]);
      } else {
        console.error("Error fetching profile picture");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profileDetails?.userUpdatedProfileImage) {
      fetchProfilePicture();
    } else {
      setIsLoading(false);
    }
  }, [profileDetails?.userUpdatedProfileImage]);
  useRouter();
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

  // Fetch user details
  useEffect(() => {
    setIsLoading(true);
    const getUserDetails = async () => {
      const response = await fetch(`/api/user/${session?.user.id}`);
      const data = await response.json();

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
      setIsLoading(false);
    };

    if (session?.user.id) getUserDetails();
  }, [session?.user.id]);

  const toast = useToast();

  /**
   * This function is used to validate first and last name fields.
   */
  const validateFields = () => {
    return !(!user.firstName || !user.lastName);
  };

  /**
   * This function is used to update a user.
   *
   * @param updatedUser - A user JSON
   * @returns A user
   */
  const updateUser = async (updatedUser) => {
    setIsSubmitting(true);

    // Validate user id
    if (!session?.user.id) return alert("Missing User Id!");

    // Validate fields
    if (!validateFields()) {
      toast({
        title: "Please fill out all required fields before submitting",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setIsSubmitting(false);
      return;
    }

    // Update user
    try {
      setIsLoading(true);
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
        }),
      });

      if (response.ok) {
        handleEdit();
        toast({
          title: "Profile successfully updated",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  /**
   * This function is used to update a user profile picture.
   *
   * @param newProfileImage - A string
   * @returns A user profile picture
   */
  const updateUserProfilePic = async (newProfileImage) => {
    setIsSubmitting(true);

    // Validate user id
    if (!session?.user.id) return alert("Missing User Id!");

    // Update user profile picture
    try {
      setIsLoading(true);
      const response = await fetch(`/api/user/${session?.user.id}?type=pic`, {
        method: "PATCH",
        body: JSON.stringify({
          userUpdatedProfileImage: newProfileImage,
        }),
      });

      if (response.ok) {
        handleEdit();
        toast({
          title: "Profile picture sucessfully updated",
          description: "You look great!",
          status: "success",
          duration: 6000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  /**
   * This function is used to handle an array of keys.
   *
   * @param keysArray - An array of keys
   * @returns An array of keys
   */
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

      <Card maxW="xl" p="4" m="4" borderRadius="20px">
        <Flex direction="column" alignItems="center" justifyContent="center">
          <CardHeader>
            <div className="pt-4 flex">
              {isLoading ? (
                <SkeletonCircle size="325" />
              ) : profileDetails?.userUpdatedProfileImage ? (
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
              {isLoading ? (
                <Skeleton height="60px" width="100%" mt="4" />
              ) : (
                <h1 className="head_text mx-auto">
                  {profileDetails?.firstName} {profileDetails?.lastName}
                </h1>
              )}
            </div>

            <div className="pt-4 flex">
              {isLoading ? (
                <Skeleton height="20px" width="100%" mt="2" />
              ) : (
                <h3 className="mx-auto">{profileDetails?.email}</h3>
              )}
            </div>
            <div className="pt-1 flex">
              {profileDetails?.gender &&
                profileDetails?.gender !== "Decline to Answer" && (
                  <h3 className="mx-auto">
                    <em>({profileDetails?.gender})</em>
                  </h3>
                )}
            </div>
            <div className="pt-4 flex">
              {session?.user.id === profileDetails?._id && (
                <>
                  <Button
                    rightIcon={<EditIcon />}
                    colorScheme="facebook"
                    isActive="true"
                    className="hover:opacity-80 mx-auto"
                    onClick={onOpen}
                  >
                    Edit Profile
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
                              updateUser(updatedUser);
                            }}
                          >
                            Submit
                          </Button>
                        )}
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </>
              )}
            </div>
          </CardHeader>
          <Divider />
          <div className="pt-4 pb-4 w-full">
            {isLoading && (
              <>
                <Skeleton height="160px" width="100%" mt="2" />
              </>
            )}

            <Collapse
              startingHeight={100}
              in={show}
              className="mx-auto text-justify"
            >
              {profileDetails?.bio}
            </Collapse>
            {profileDetails?.bio && profileDetails?.bio.length > 300 && (
              <Button
                size="sm"
                isActive={true}
                className="hover:opacity-80"
                onClick={handleToggle}
                mt="1rem"
              >
                Show {show ? "Less" : "More"}
              </Button>
            )}
          </div>
          <Divider />
          <div className="pt-4 pb-4 w-full">
            {isLoading ? (
              <>
                <Skeleton height="20px" width="100%" mt="2" />
                <Skeleton height="20px" width="100%" mt="2" />
                <Skeleton height="20px" width="100%" mt="2" />
              </>
            ) : (
              <TableContainer className="w-full" style={{ width: "100%" }}>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Classes Taken</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <>
                      {profileDetails?.classesTaken?.map(
                        (classTaken, index) => (
                          <Tr key={index}>
                            <Td>{classTaken}</Td>
                          </Tr>
                        )
                      )}
                    </>
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </div>
          <div className="mt-4 mb-10 w-full">
            {isLoading ? (
              <>
                <Skeleton height="20px" width="100%" mt="2" />
                <Skeleton height="20px" width="100%" mt="2" />
                <Skeleton height="20px" width="100%" mt="2" />
              </>
            ) : (
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
            )}
          </div>
        </Flex>
      </Card>
    </div>
  );
};

export default ProfilePage;
