import React, { useState } from 'react';

const CreateMessage = ({ message, setMessage, handleMessageSubmit }) => {

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    handleMessageSubmit(); // Call your custom submission logic
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism">
      <textarea
        value={message.content}
        onChange={(e) => setMessage({...message, content: e.target.value})}
        className="form_input"
      />
      <button type="submit" className="blue_btn">Post Message</button>
    </form>
  );
};

export default CreateMessage;
