"use client";

import { useEffect, useState } from "react";
import React from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { useSession } from "next-auth/react";

const Message = ({ message, onDeleteItem }) => {
  const [userName, setUserName] = useState("");

  const fetchUserName = async () => {
    const response = await fetch(`/api/user/${message.author}`);
    const data = await response.json();
    setUserName(data.firstName + " " + data.lastName);
  };

  useEffect(() => {
    if (message.author) {
      fetchUserName();
    }
  }, [message.author]);

  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();

  const [messageComments, setMessageComments] = useState([]);
  const [comment, setComment] = useState({
    content: "",
  });

  const fetchMessageComments = async () => {
    console.log("This is my message id")
    console.log(message.id)
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

      if(response.ok) {
        setComment({ content: ""});
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
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh comments after deletion
        fetchMessageComments();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>{message.content}</p>
      <p>Author: {userName}</p>
      {session?.user.id === message.author && (
        <button onClick={onDeleteItem} className="blue_btn">Delete Message</button>
      )}
      <CommentForm 
        comment={comment}
        setComment={setComment}
        handleCommentSubmit={createComment} 
      />
      {messageComments.slice().reverse().map(messageComment => (
        <Comment key={messageComment._id} comment={messageComment} 
        
        onDeleteComment={() => handleDeleteComment(messageComment._id)}
        />
      ))}
    </div>
  );
};

export default Message;
