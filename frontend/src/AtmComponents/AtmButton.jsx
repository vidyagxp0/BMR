import React from "react";

const AtmButton = ({
  label,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      {...props}
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded bg-[#195b7a] text-white hover:bg-[#195b7a]-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition ease-out duration-300 shadow-md hover:shadow-lg ${className}`}
    >
      {label}
    </button>
  );
};

export default AtmButton;
