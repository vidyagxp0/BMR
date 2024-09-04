// Button1.jsx
import React from "react";

const Button1 = ({ label, active, onClick }) => {
  const buttonClass = `px-4 py-2 rounded-md font-medium transition-colors ${
    active ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
  }`;

  return (
    <button className={buttonClass} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button1;
