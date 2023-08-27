"use client";

import { useState, useEffect } from "react";
import Message from "./Message";
import MessageForm from "./MessageForm";
import { useSession } from "next-auth/react";
import { Heading } from "@chakra-ui/react";

/**
 * This component is used to render a message board.
 *
 * @param eventDetails - An event JSON
 * @param addImagesToEvent - A function to add images to an event
 * @constructor - Renders a message board
 * @returns A message board
 */
const MessageBoard = ({ eventDetails, addImagesToEvent }) => {
  const [eventMessages, setEventMessages] = useState([]);
  const [message, setMessage] = useState({
    content: "",
    uploadedMessagePictures: [],
  });
  const [setSubmitting] = useState(false);

  const { data: session } = useSession();

  /**
   * This function is used to fetch the messages for an event.
   */
  const fetchEventMessages = async () => {
    const response = await fetch(`/api/message/${eventDetails._id}`);
    if (response.status === 404) {
      console.log("Event messages not found");
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
  const createMessage = async (e) => {
    e.preventDefault();
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

      // If the message is empty, do not submit
      if (response.ok) {
        setMessage({ content: "" });
        if (message.uploadedMessagePictures) {
          addImagesToEvent(message.uploadedMessagePictures);
        }
        fetchEventMessages();
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
      console.log("Reached edited message", editedMessage);
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
  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(`/api/message/${messageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh comments after deletion
        fetchEventMessages();
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * This function is used to handle the keys array.
   *
   * @param keysArray - An array of keys
   * @returns An array of keys
   */
  const handleKeysArray = async (keysArray) => {
    setMessage({ ...message, uploadedMessagePictures: keysArray });
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
      console.log("Reached edited message", editedMessage);
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
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div>
        {" "}
        <Heading as="h3" size="md">
          MessageBoard
        </Heading>{" "}
      </div>
      <MessageForm
        message={message}
        setMessage={setMessage}
        handleMessageSubmit={createMessage}
        handleKeysArray={handleKeysArray}
        existingFiles={[]}
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
              onDeleteItem={() => handleDeleteMessage(eventMessage._id)}
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
