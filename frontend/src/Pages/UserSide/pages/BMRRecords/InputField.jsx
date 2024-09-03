// InputField.jsx
import React from 'react';

const InputField = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-bold mb-2">{label}</label>
    <input
      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
      {...props}
    />
  </div>
);

export default InputField;
