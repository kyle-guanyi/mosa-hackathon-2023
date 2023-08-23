"use client"

import React, { useState, useEffect } from 'react';
import MessageBoard from '/components/messageboard/MessageBoard';
import CreateMessage from '/components/messageboard/MessageForm';
import CreateComment from '/components/messageboard/CommentForm';

const MessageBoardPage = ( {eventInfo} ) => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async() => {
    const response = await fetch(`/api/message/${eventInfo._id}`);
    const data = await response.json();
    setMessages(data);
  }


  useEffect(() => {
    fetchMessages();
  }, []);

  

  return (
    <div>
      <h1>Message Board</h1>
      <CreateMessage onMessageSubmit={handleMessageSubmit} />
      <MessageBoard messages={messages} onCommentSubmit={handleCommentSubmit} />
    </div>
  );
};

export default MessageBoardPage;