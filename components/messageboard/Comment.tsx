import React from 'react';

const Comment = ({ comment, userName }) => {
  return (
    <div>
      <p>{comment.content}</p>
      <p>Author: {userName}</p>
    </div>
  );
};

export default Comment;