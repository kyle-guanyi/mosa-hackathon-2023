import React, { useState } from 'react';

const CreateComment = ({ comment, setComment, handleCommentSubmit }) => {

  return (
    <form className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism">
      <textarea
        value={comment.content}
        onChange={(e) => setComment({content: e.target.value})}
        className="form_input"
      />
      <button onClick={handleCommentSubmit} className="blue_btn">Post Comment</button>
    </form>
  );
};

export default CreateComment;