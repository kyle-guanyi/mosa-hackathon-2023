"use client";

import { useEffect, useState } from "react";
import React from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { useSession } from "next-auth/react";
import MessageBoard from "./MessageBoard";
import CreateMessage from "./MessageForm";

const Message = ({ message, onDeleteItem, onPatchMessage }) => {
  const [userName, setUserName] = useState("");

  //for editing mode
  const[messageEditing, setMessageEditing] = useState(false);

  //content to populate the messageform
  const [editedMessage, setEditedMessage] = useState({
    _id: message._id,
    content: message.content,
  })
  
  //switch between form vs display
  const onEditMessage = async () => {
    setMessageEditing(true);
  }

  // add the editedMessage into the dtabase where the message is stored
  const handleMessageEditSubmit = () => {
    onPatchMessage(editedMessage);
    setMessageEditing(false);
  }

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

  const editComment = async (editedComment) => {
    setSubmitting(true);
    try {
      console.log("Reached edited comment", editedComment)
      const response = await fetch(`/api/comment/${editedComment._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          content: editedComment.content,
        }),
      });

      if(response.ok) {
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

  const updateCommentPictures = async (keysArray) => {
    setSubmitting(true);

    if (!session?.user.id) return alert("Missing User Id!");
    console.log(keysArray)
    try {
      const response = await fetch(`/api/comment/${comment._id}?type=pic`, {
        method: "PATCH",
        body: JSON.stringify({
          uploadedCommentPictures: keysArray,
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

      {messageEditing ? (
        <CreateMessage
          message={editedMessage}
          setMessage={setEditedMessage}
          handleMessageSubmit={handleMessageEditSubmit}
        />
      ): (
      <>


      <p>{message.content}</p>
      <p>Author: {userName}</p>
      <p>{message.createdAt}</p>
      {session?.user.id === message.author && (
        <button onClick={() => {
          const shouldDelete = window.confirm(
              "Are you sure you want to delete this message and its associated comments?"
          );
          if (shouldDelete) {
            onDeleteItem();
          }
        }} className="blue_btn">Delete Message</button>
      )}
      {session?.user.id === message.author && (
            // When button is clicked, the passed in onEditComment will handle onEditComment
            <button onClick={onEditMessage} className="blue_btn">
              Edit Message
            </button>
      )}
      <CommentForm 
        comment={comment}
        setComment={setComment}
        handleCommentSubmit={createComment} 
        handleKeysArray={updateCommentPictures}
      />
      {messageComments.slice().reverse().map(messageComment => (
        <Comment key={messageComment._id} comment={messageComment} 
        
        onDeleteComment={() => handleDeleteComment(messageComment._id)}
        onPatchComment={editComment}
        />
      ))}
      </>
      )}
    </div>
  );
};

export default Message;
