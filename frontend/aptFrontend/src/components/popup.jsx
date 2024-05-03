// src/components/Modal.js
import React, { useState } from "react";

const Modal = ({ setPopUp }) => {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = () => {
    // Handle form submission (e.g., save inputText)
    console.log("Input value:", inputText);
    setPopUp(false); // Close the modal
  };
  const handleclose = () => {
    // Handle form submission (e.g., save inputText)

    setPopUp(false); // Close the modal
  };

  return (
    <div className="w-screen h-screen bg-black bg-opacity-30 fixed top-0 right-0 flex justify-center items-center">
      <div className="bg-white p-10 rounded-md shadow-md">
        <h1 className="font-bold text-center text-lg my-5">Enter Text</h1>
        <input
          type="text"
          className="border border-gray-300 p-2 w-full mb-4"
          placeholder="Type something..."
          value={inputText}
          onChange={handleInputChange}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Save
        </button>
        <button
          className="white text-red px-4 py-2 rounded-md hover:bg-blue-500"
          onClick={ handleclose}
        >
          close
        </button>
        
      </div>
    </div>
  );
};

export default Modal;
