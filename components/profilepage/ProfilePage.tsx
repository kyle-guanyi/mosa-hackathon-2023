"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Avatar,
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
} from "@chakra-ui/react";

const ProfilePage = ({ profileDetails, handleEdit }) => {
  const [profilePicture, setProfilePicture] = useState("");

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

  return (
    <div>
    <div
      style={{
        background: `url('/assets/images/pennBuilding.jpeg') no-repeat center center fixed`,
        backgroundSize: 'cover',
        height: '100%',
        width: '100%', // Set the background image to cover the entire viewport
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        top: '0',
        left: '0',
        position: 'absolute',
        opacity: '80%',
      }}
    />
    
    <Card maxW="lg" p="4" m="4" borderRadius="20px" >
      <Flex direction="column" alignItems="center" justifyContent="center" >
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
          <div className="pt-4 flex">
            {handleEdit && (
              <Button 
              colorScheme="facebook"
              variant={"solid"}
              isActive={true}
              className="hover:opacity-80 mx-auto"
              ml={3}
              onClick={handleEdit}
              >
              Edit My Profile
            </Button>
            )}
          </div>
        </CardHeader>
        <Divider />
        <div className="pt-4 pb-4 flex">
          <Text className="mx-auto text-justify">{profileDetails?.bio}</Text>
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
                {profileDetails?.fieldOfInterest?.map((fieldInterest, index) => (
                  <Tr key={index}>
                    <Td>{fieldInterest}</Td>
                  </Tr>
                ))}
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
