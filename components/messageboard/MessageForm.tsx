import Dropzone from "components/Dropzone"

const CreateMessage = ({ message, setMessage, handleMessageSubmit, handleKeysArray, existingFiles }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleMessageSubmit(e); 
  };

  return (
    <section>
      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >
        <textarea
          value={message.content}
          onChange={(e) => setMessage({ ...message, content: e.target.value })}
          className="form_input"
        />
        <button type="submit" className="blue_btn">
          Post Message
        </button>
      </form>
      <Dropzone handleKeysArray={handleKeysArray} maxUploads={5} existingFiles={existingFiles} />
    </section>
  );
};

export default CreateMessage;
