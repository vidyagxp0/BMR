import React from 'react'

const AtmDropdown = ({ options = [], value, onChange, placeholder = 'Select an option', className = '' }) => {
  return (
    <div className={`relative inline-block w-full ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
  )
}

export default AtmDropdown