"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Avatar } from "@chakra-ui/react";
import { Card, CardHeader, Flex, Box, Heading, Text } from "@chakra-ui/react";

const UserCard = ({ user }) => {
  const { data: session } = useSession();

  const router = useRouter();
  // fetch profilepic for user
  const [profilePicture, setProfilePicture] = useState("");
  const fetchProfilePicture = async () => {
    try {
      const keysArray = [user.userUpdatedProfileImage]; // Convert to an array
      const response = await fetch(
        `/api/media?keys=${encodeURIComponent(JSON.stringify(keysArray))}`
      );
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setProfilePicture(data.urls[0]); // Assuming the data structure is { success: true, urls: [profilePictureUrl] }
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

  // routes to profile page
  const handleProfileClick = () => {
    if (user?._id === session?.user.id) return router.push("/profile");

    router.push(`/profile/${user?._id}`);
  };

  return (
    <div
      className="cursor-pointer pb-2 hover:-translate-y-1 hover:opacity-80 transition-all"
      onClick={handleProfileClick}
    >
      <Card maxW="xs">
        <CardHeader>
          <Flex gap="4">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar
                name={user?.firstName}
                src={profilePicture || user?.googleProfileImage}
              />

              <Box>
                <Heading size="sm">
                  {user?.firstName} {user?.lastName}
                </Heading>
                <Text fontSize='xs'>{user?.email}</Text>
              </Box>
            </Flex>
          </Flex>
        </CardHeader>
      </Card>
    </div>
  );
};
export default UserCard;
