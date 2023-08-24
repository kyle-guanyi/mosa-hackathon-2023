import React, { useState } from 'react';

const CreateComment = ({ comment, setComment, handleCommentSubmit }) => {

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    handleCommentSubmit(); // Call your custom submission logic
  };

  console.log("This is my create comment field", comment)

  return (
    <form onSubmit={handleSubmit} className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism">
      <textarea
        value={comment.content}
        onChange={(e) => setComment({ ...comment, content: e.target.value })}
        className="form_input"
      />
      <button type="submit" className="blue_btn">Post Comment</button>
    </form>
  );
};

export default CreateComment;