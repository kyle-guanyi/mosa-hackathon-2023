import React, { useState } from 'react';

const CommentForm = ({ comment, setComment, handleCommentSubmit, handleCommentEditSubmit }) => {

  const isEditing = !!handleCommentEditSubmit;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.content) {
      if (isEditing) {
        handleCommentEditSubmit(comment.content); // Call handleCommentEditSubmit for edit
      } else {
        handleCommentSubmit(comment.content); // Call handleCommentSubmit for create
      }
      setComment({ content: '' }); // Clear the comment input
    }
  };

  return (
    <form className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism">
      <textarea
        value={comment.content}
        onChange={(e) => setComment({ ...comment, content: e.target.value })}
        className="form_input"
      />
      {isEditing ? (
        <button onClick={handleSubmit} className="blue_btn">Edit Comment</button>
      ) : (
        <button onClick={handleSubmit} className="blue_btn">Create Comment</button>
      )}
    </form>
  );
};

export default CommentForm;