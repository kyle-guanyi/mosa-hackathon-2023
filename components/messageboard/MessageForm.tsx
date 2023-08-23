import React, { useState } from 'react';

const CreateMessage = ({ message, setMessage, handleMessageSubmit }) => {

  return (
    <form className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism">
      <textarea
        value={message.content}
        onChange={(e) => setMessage({content: e.target.value})}
        className="form_input"
      />
      <button onClick={handleMessageSubmit} className="blue_btn">Post Message</button>
    </form>
  );
};

export default CreateMessage;
