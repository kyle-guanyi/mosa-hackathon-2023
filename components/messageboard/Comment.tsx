import React, {useEffect, useState} from 'react';

const Comment = ({ comment }) => {
    const [userName, setUserName] = useState("");

    const fetchUserName = async () => {
        const response = await fetch(`/api/user/${comment.author}`);
        const data = await response.json();
        setUserName(data.firstName + " " + data.lastName);
    };

    useEffect(() => {
        if (comment.author) {
            fetchUserName();
        }
    }, [comment.author]);

  return (
    <div>
      <p>{comment.content}</p>
      <p>Author: {userName}</p>
    </div>
  );
};

export default Comment;