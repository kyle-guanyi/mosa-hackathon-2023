/**
 * Comment form component
 *
 * @param comment - A comment JSON
 * @param setComment - A function to set the comment
 * @param handleCommentSubmit - A function to submit the comment
 * @constructor - Renders a comment form
 * @returns A comment form
 */
const CreateComment = ({ comment, setComment, handleCommentSubmit }) => {

    /**
     * Handles the submit event
     * @param e - The submit event
     */
    const handleSubmit = (e) => {
    e.preventDefault();
    handleCommentSubmit(e);
  };

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