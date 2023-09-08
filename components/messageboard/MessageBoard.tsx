// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Message from "./Message";
import MessageForm from "./MessageForm";
import { useSession } from "next-auth/react";
import { Heading, useToast } from "@chakra-ui/react";

/**
 * This component is used to render a message board.
 *
 * @param eventDetails - An event JSON
 * @param addImagesToEvent - A function to add images to an event
 * @constructor - Renders a message board
 * @returns A message board
 */
const MessageBoard = ({
  eventDetails,
  addImagesToEvent,
  handleDeletePatch,
}) => {
  const [eventMessages, setEventMessages] = useState([]);
  const [message, setMessage] = useState({
    content: "",
    uploadedMessagePictures: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const { data: session } = useSession();

  /**
   * This function is used to fetch the messages for an event.
   */
  const fetchEventMessages = async () => {
    const response = await fetch(`/api/message/${eventDetails._id}`);
    if (response.status === 404) {
      setEventMessages([]);
      return;
    }
    const data = await response.json();
    setEventMessages(data);
  };

  useEffect(() => {
    if (eventDetails._id) {
      fetchEventMessages();
    }
  }, [eventDetails._id]);

  /**
   * This function is used to create a message.
   *
   * @param e - An event
   * @returns A message
   */
  const createMessage = async () => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/message/new", {
        method: "POST",
        body: JSON.stringify({
          event: eventDetails._id,
          author: session?.user.id,
          content: message.content,
          uploadedMessagePictures: message.uploadedMessagePictures,
        }),
      });

      // Add images to event and reset message to empty
      if (response.ok) {
        if (message.uploadedMessagePictures) {
          addImagesToEvent(message.uploadedMessagePictures);
        }

        setMessage({ content: "", uploadedMessagePictures: [] });
        fetchEventMessages();
        toast({
          title: "Your message has been created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * This function is used to edit a message.
   *
   * @param editedMessage - A message JSON
   * @returns An edited message
   */
  const editMessage = async (editedMessage) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/message/${editedMessage._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          content: editedMessage.content,
          uploadedMessagePictures: editedMessage.uploadedMessagePictures,
        }),
      });

      if (response.ok) {
        fetchEventMessages();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * This function is used to delete a message.
   *
   * @param messageId - A message ID
   * @returns A deleted message
   */
  const handleDeleteMessage = async (message) => {
    try {
      if (message.uploadedMessagePictures && message.uploadedMessagePictures.length > 0) {
        handleDeleteEventPictures(message);
      }

      const response = await fetch(`/api/message/${message._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh comments after deletion
        fetchEventMessages();
        toast({
          title: "Your message has been deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      handleDeletePatch();
    }
  };

  const toast = useToast();

  /**
   * This function is used to handle the keys array.
   *
   * @param keysArray - An array of keys
   * @returns An array of keys
   */
  const handleKeysArray = async (keysArray) => {
    setMessage({ ...message, uploadedMessagePictures: keysArray });
    toast({
      title: "Your newly uploaded image(s) have been attached to your message",
      description:
        "Be sure to submit your edits to replace your previously uploaded image(s)",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  /**
   * This function is used to patch the event pictures.
   *
   * @param editedMessage - A message JSON
   * @returns An edited message
   */
  const handlePatchEventPictures = async (editedMessage) => {
    setSubmitting(true);
    try {
      await fetch(`/api/event/${eventDetails._id}?type=uploadedPictures`, {
        method: "PATCH",
        body: JSON.stringify({
          uploadedPictures: editedMessage.uploadedMessagePictures,
          originalPictures: editedMessage.originalPictures,
        }),
      });
    } catch (error) {
      console.log(error);
    } finally {
      handleDeletePatch();
      setSubmitting(false);
    }
  };

  const [deletedMessage, setDeletedMessage] = useState(message);

  /**
   * This function is used to patch the event pictures.
   *
   * @param editedMessage - A message JSON
   * @returns An edited message
   */
  const handleDeleteEventPictures = async (message) => {
    setSubmitting(true);
    setDeletedMessage(message.uploadedMessagePictures)
    try {
      // console.log("Reached deleted message", message);
      await fetch(`/api/event/${eventDetails._id}?type=deletedPictures`, {
        method: "PATCH",
        body: JSON.stringify({
          uploadedPictures: message.uploadedMessagePictures,
        }),
      });

    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
      handleDeletePatch();
    }
  };

  const [existingFiles, setExistingFiles] = useState([]);

  return (
    <div>
      <div>
        {" "}
        <Heading as="h3" size="md" pb="3">
          Discussion Board
        </Heading>{" "}
      </div>
      <MessageForm
        submitting={submitting}
        message={message}
        setMessage={setMessage}
        handleMessageSubmit={createMessage}
        handleKeysArray={handleKeysArray}
        existingFiles={existingFiles}
        setExistingFiles={setExistingFiles}
        type="Submit"
      />
      {eventMessages
        .slice()
        .reverse()
        .map((eventMessage) => {
          return (
            <Message
              key={eventMessage._id}
              message={eventMessage}
              onDeleteItem={() => handleDeleteMessage(eventMessage)}
              // added for edit
              onPatchMessage={editMessage}
              handlePatchEventPictures={handlePatchEventPictures}
            />
          );
        })}
    </div>
  );
};

export default MessageBoard;
