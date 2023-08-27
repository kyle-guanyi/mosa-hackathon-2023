"use client";

import { useEffect, useState } from "react";
import React from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { useSession } from "next-auth/react";
import CreateMessage from "./MessageForm";
import NextImage from "next/image";
import {
  Card,
  CardHeader,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  IconButton,
  CardBody,
  CardFooter,
  Image,
  Collapse,
  Button,
  Grid,
  GridItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiTrash2 } from "react-icons/Fi";
import { EditIcon } from "@chakra-ui/icons";

const Message = ({ message, onDeleteItem, onPatchMessage, handlePatchEventPictures }) => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    googleProfileImage: "",
    userUpdatedProfileImage: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  //for editing mode
  const [messageEditing, setMessageEditing] = useState(false);

  //content to populate the messageform
  const [editedMessage, setEditedMessage] = useState({
    _id: message._id,
    content: message.content,
    uploadedMessagePictures: message.uploadedMessagePictures,
    originalPictures: message.uploadedMessagePictures
  });

  //switch between form vs display
  const onEditMessage = async () => {
    setMessageEditing(true);
  };

  // add the editedMessage into the database where the message is stored
  const handleMessageEditSubmit = () => {
    onPatchMessage(editedMessage);
    handlePatchEventPictures(editedMessage);
    onClose();
    setMessageEditing(false);
  };


  const fetchUserInfo = async () => {
    const response = await fetch(`/api/user/${message.author}`);
    const data = await response.json();
    setUserInfo({
      firstName: data.firstName,
      lastName: data.lastName,
      googleProfileImage: data.googleProfileImage,
      userUpdatedProfileImage: data.userUpdatedProfileImage,
    });

    if (data.userUpdatedProfileImage) {
      const userUpdatedProfileImageResponse = await fetch(
        `/api/media?keys=${encodeURIComponent(
          JSON.stringify([data.userUpdatedProfileImage])
        )}`
      );
      const userUpdatedProfileImageData =
        await userUpdatedProfileImageResponse.json();

      if (userUpdatedProfileImageResponse.ok) {
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          userUpdatedProfileImage: userUpdatedProfileImageData.urls[0],
        }));
      }
    }
  };

  useEffect(() => {
    if (message.author) {
      fetchUserInfo();
    }
  }, [message.author]);

  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();

  const [messageComments, setMessageComments] = useState([]);
  const [comment, setComment] = useState({
    content: "",
  });

  const fetchMessageComments = async () => {
    console.log("This is my message id");
    console.log(message.id);
    const response = await fetch(`/api/comment/${message._id}`);
    if (response.status === 404) {
      console.log("Message comments not found");
      setMessageComments([]);
      return;
    }
    const data = await response.json();
    setMessageComments(data);
  };

  useEffect(() => {
    if (message._id) {
      fetchMessageComments();
    }
  }, [message._id]);

  const [uploadedMessagePictures, setUploadedMessagePictures] = useState([]);

  const fetchUploadedMessagePictures = async () => {
    try {
      const keysArray = message.uploadedMessagePictures;
      const response = await fetch(
        `/api/media?keys=${encodeURIComponent(JSON.stringify(keysArray))}`
      );
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setUploadedMessagePictures(data.urls);
      } else {
        console.error("Error fetching initial pictures");
      }
    } catch (error) {
      console.error("Error fetching initial pictures: ", error);
    }
  };

  useEffect(() => {
    if (message.uploadedMessagePictures?.length > 0) {
      fetchUploadedMessagePictures();
    }
  }, [message.uploadedMessagePictures]);

  const createComment = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/comment/new", {
        method: "POST",
        body: JSON.stringify({
          post: message._id,
          author: session?.user.id,
          content: comment.content,
        }),
      });

      if (response.ok) {
        setComment({ content: "" });
        fetchMessageComments();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const editComment = async (editedComment) => {
    setSubmitting(true);
    try {
      console.log("Reached edited comment", editedComment);
      const response = await fetch(`/api/comment/${editedComment._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          content: editedComment.content,
          uploadedMessagePictures: editedComment.uploadedMessagePictures,
        }),
      });

      if (response.ok) {
        fetchMessageComments();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`/api/comment/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh comments after deletion
        fetchMessageComments();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePatchMessagePictures = async (keysArray) => {
    console.log("These are the new pictures", keysArray)
    setEditedMessage({ ...editedMessage, uploadedMessagePictures: keysArray });
    toast({
      title: "Your newly uploaded image(s) have been attached to your message.",
      description: "Be sure to submit your edits to replace your previously uploaded image(s).",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  const toast = useToast();


  return (
    <Card maxW="md">
      <CardHeader>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar
              name={`${userInfo.firstName} ${userInfo.lastName}`}
              src={
                userInfo.userUpdatedProfileImage || userInfo.googleProfileImage
              }
            />
            <Box>
              <Heading size="sm">
                {userInfo.firstName} {userInfo.lastName}
              </Heading>
            </Box>
          </Flex>
          {session?.user.id === message.author && (
            <Menu autoSelect={false}>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<BsThreeDotsVertical />}
                variant="ghost"
              />
              <MenuList>
                <MenuItem
                  icon={<EditIcon />}
                  isDisabled={false}
                  className="hover:bg-gray-100 focus:bg-gray-100"
                  onClick={onOpen}
                >
                  Edit Post
                </MenuItem>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Edit Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <CreateMessage
                        message={editedMessage}
                        setMessage={setEditedMessage}
                        handleMessageSubmit={handleMessageEditSubmit}
                        handleKeysArray={handlePatchMessagePictures}
                        existingFiles={editedMessage.uploadedMessagePictures}
                        type={"Edit"}
                      />
                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <MenuItem
                  icon={<FiTrash2 />}
                  isDisabled={false}
                  onClick={onDeleteItem}
                  className="hover:bg-gray-100 focus:bg-gray-100"
                >
                  Delete Post
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
        <CardBody>
          <Collapse
            startingHeight={100}
            in={show || message.content.length <= 100}
            className="mx-auto text-justify"
          >
            {message.content}
          </Collapse>
          {message.content.length > 300 && ( // Show button only if text is longer than 300 characters
            <Button
              size="sm"
              isActive="true"
              className="hover:opacity-80"
              onClick={handleToggle}
              mt="1rem"
            >
              Show {show ? "Less" : "More"}
            </Button>
          )}
        </CardBody>
      </CardHeader>
      <Grid templateColumns="repeat(5, 1fr)" gap={3}>
        {uploadedMessagePictures?.map((file, index) => (
          <GridItem pl="2" key={index} className="cursor-pointer">
            <Image
              src={file}
              alt={"Uploaded Message Image"}
              boxSize="150px"
              objectFit="cover"
              onLoad={() => {
                URL.revokeObjectURL(file);
              }}
              onClick={() => {
                setSelectedImageIndex(index);
                onOpen();
              }}
            />
            <Modal
              isOpen={isOpen && selectedImageIndex !== null}
              onClose={() => {
                setSelectedImageIndex(null);
                onClose();
              }}
              size="xl"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />
                <Image
                  src={uploadedMessagePictures[selectedImageIndex]}
                  alt={"Uploaded Message Image"}
                  objectFit="cover"
                  onLoad={() => {
                    URL.revokeObjectURL(file);
                  }}
                />
              </ModalContent>
            </Modal>
          </GridItem>
        ))}
      </Grid>
    </Card>
  );
};

export default Message;
