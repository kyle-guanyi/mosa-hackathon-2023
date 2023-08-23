import React, {useEffect, useState} from 'react';
import { useSession } from 'next-auth/react';

const Comment = ({ comment, onDeleteComment }) => {
    const [userName, setUserName] = useState("");
    const { data: session } = useSession();

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
      {/* Check if current user is the owner */}
      {session?.user.id === comment.author && (
        <button onClick={onDeleteComment} className="blue_btn">Delete Comment</button>
      )}
    </div>
  );
};

export default Comment;