"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { EditIcon }from "@chakra-ui/icons";

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

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {session?.user.id ? (
        <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <HStack spacing={8} alignItems={"center"}>
              <Box>
                <Link href="/" className="flex gap-2 flex-center">
                  <Image
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
              >
                
              </HStack>
            </HStack>
            <Flex alignItems={"center"}>
              <Button
                variant={"solid"}
                isActive={true}
                className="hover:opacity-80"
                size={"sm"}
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
                  <Image
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
          </Flex>
        </Box>
      )}
    </>
  );
}
