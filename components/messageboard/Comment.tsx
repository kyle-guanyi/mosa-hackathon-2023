import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CreateComment from "./CommentForm";

const Comment = ({ comment, onDeleteComment, onPatchComment }) => {
  const [userName, setUserName] = useState("");
  const { data: session } = useSession();
  //if in editing mode
  const [editing, setEditing] = useState(false);
  // content to populate the commentform
  

  const [editedComment, setEditedComment] = useState({
    _id: comment._id,
    content: comment.content,
  });

  console.log("This is my editedComment ", editedComment)
  console.log(editedComment._id)

  const fetchUserName = async () => {
    const response = await fetch(`/api/user/${comment.author}`);
    const data = await response.json();
    setUserName(data.firstName + " " + data.lastName);
  };

  const onEditComment = async () => {
    setEditing(true);
  };

  useEffect(() => {
    if (comment.author) {
      fetchUserName();
    }
  }, [comment.author]);

  // add the editedComment into the database where the comment is stored
  const handleCommentEditSubmit = () => {
    // onPatchComment should take the editedComment and then search database using the id and set new content to editedComment
    onPatchComment(editedComment);
    // setEditing to false so that return is <p> values instead of CommentForm
    setEditing(false);
  };

  return (
    <div>
      {editing ? (
        <CreateComment
          comment={editedComment}
          setComment={setEditedComment}
          handleCommentSubmit={handleCommentEditSubmit}
        />
      ) : (
        <>
          <p>{comment.content}</p>
          <p>Author: {userName}</p>
          <p>{comment.createdAt}</p>
          {/* Check if current user is the owner */}
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
            // When button is clicked, the passed in onEditComment will handle onEditComment
            <button onClick={onEditComment} className="blue_btn">
              Edit Comment
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Comment;
