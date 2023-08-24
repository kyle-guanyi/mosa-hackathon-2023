"use client";

import { useState, useEffect } from "react";
import Message from "./Message";
import MessageForm from "./MessageForm";
import { useSession } from "next-auth/react";

const MessageBoard = ({ eventDetails }) => {
  const [eventMessages, setEventMessages] = useState([]);
  const [message, setMessage] = useState({
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const { data: session } = useSession();
  console.log("This my event details id");
  console.log(eventDetails._id);

  

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
        }),
      });

      if(response.ok) {
        setMessage({ content: ""});
        fetchEventMessages();
      }


    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const editMessage = async (editedMessage) => {
    setSubmitting(true);
    try {
      console.log("Reached edited message", editedMessage)
      const response = await fetch(`/api/message/${editedMessage._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          content: editedMessage.content,
        }),
      });

      if(response.ok) {
        fetchEventMessages();
      }

    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(`/api/message/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh comments after deletion
        fetchEventMessages();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div> MessageBoard </div>
      <MessageForm 
        message={message}
        setMessage={setMessage}
        handleMessageSubmit={createMessage} 
      />
      {eventMessages.slice().reverse().map((eventMessage) => {
      return (
        <Message key={eventMessage._id} 
        message={eventMessage} 
        onDeleteItem={() => handleDeleteMessage(eventMessage._id)}
        // added for edit
        onPatchMessage={editMessage}
        
        />
      );
    })}
    </div>
  );
};

export default MessageBoard;
