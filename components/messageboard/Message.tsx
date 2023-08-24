"use client";

import { useEffect, useState } from "react";
import React from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { useSession } from "next-auth/react";

const Message = ({ message, onDeleteItem }) => {
  const [userName, setUserName] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const { data: session } = useSession();

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


  const handleEditComment = (commentId) => {
    setEditingCommentId(commentId);
  };

  
  const [submitting, setSubmitting] = useState(false); //unsure if needed
  

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

  

  

  const handleCommentEditSubmit = async (editedContent, commentId) => {
    try {
      const response = await fetch(`/api/comment/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editedContent }),
      });
  
      if (response.ok) {
        fetchMessageComments(); // Refresh comments after edit
        setEditingCommentId(null); // Clear editing state
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Define the handleCommentSubmit function
  const handleCommentSubmit = async (content) => {
    try {
      const response = await fetch("/api/comment/new", {
        method: "POST",
        body: JSON.stringify({
          post: message._id,
          author: session?.user.id,
          content: content,
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

  return (
    <div>
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
      <CommentForm 
        comment={comment}
        setComment={setComment}
        handleCommentSubmit={createComment} // For new comment creation
        handleCommentEditSubmit={(editedContent, commentId) => handleCommentEditSubmit(editedContent, commentId)} // For comment editing
      />
      {messageComments.slice().reverse().map(messageComment => (
        <div key={messageComment._id}>
        {editingCommentId === messageComment._id ? (
          <>
            <Comment
              comment={messageComment}
              onDeleteComment={() => handleDeleteComment(messageComment._id)}
              onPatchComment={() => handleEditComment(messageComment._id)}
            />
            <button onClick={() => setEditingCommentId(null)}>Cancel Edit</button>
            <CommentForm
              comment={messageComment} // Pass the comment object to populate the form
              setComment={setComment} // Update the comment state
              handleCommentEditSubmit={(editedContent) => handleCommentEditSubmit(editedContent, messageComment._id)}
            />
          </>
        ) : (
          <div>
            <Comment
              comment={messageComment}
              onDeleteComment={() => handleDeleteComment(messageComment._id)}
              onPatchComment={() => handleEditComment(messageComment._id)}
            />
            <button onClick={() => setEditingCommentId(messageComment._id)}>Edit Comment</button>
          </div>
        )}
      </div>
    ))}
    
    {/* Display the CommentForm for adding new comments */}
    {!editingCommentId && (
       <div>
       <CommentForm
         comment={comment}
         setComment={setComment}
         handleCommentSubmit={handleCommentSubmit}
         handleCommentEditSubmit={(editedContent, commentId) =>
           handleCommentEditSubmit(editedContent, commentId)
         }
       />
     </div>
    )
  }
  </div>
  )
}


export default Message;
