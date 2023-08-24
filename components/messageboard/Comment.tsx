import React, {useEffect, useState} from 'react';
import { useSession } from 'next-auth/react';
import CommentForm from './CommentForm';

const Comment = ({ comment, onDeleteComment, onPatchComment }) => {
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

    const [editing, setEditing] = useState(false); // State to manage whether the comment is being edited
    const [editedComment, setEditedComment] = useState({ content: comment.content });

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleCommentEditSubmit = () => {
        onPatchComment(editedComment); // Call the appropriate function to update the comment in the database
        setEditing(false);
    };

  return (
    <div>
            {editing ? (
                <CommentForm
                    comment={editedComment.content}
                    setComment={setEditedComment}
                    handleCommentSubmit={handleCommentEditSubmit}
                />
            ) : (
                <>
                    <p>{comment.content}</p>
                    <p>Author: {userName}</p>
                    <p>{comment.createdAt}</p>
                    {session?.user.id === comment.author && (
                        <button
                            onClick={() => {
                                const shouldDelete = window.confirm(
                                    "Are you sure you want to delete this comment?"
                                );
                                if (shouldDelete) {
                                    onDeleteComment();
                                }
                            }}
                            className="blue_btn"
                        >
                            Delete Comment
                        </button>
                    )}
                    {session?.user.id === comment.author && (
                        <button
                            onClick={handleEditClick}
                            className="blue_btn"
                        >
                            Edit Comment
                        </button>
                    )}
                </>
            )}
        </div>
  );
};

export default Comment;