import React from 'react'
import { FaSearch } from 'react-icons/fa';

const AtmSearchInput = ({ placeholder = 'Search...', value, onChange, className = '' }) => {
  return (
    <div className={`flex items-center border rounded-md px-3 py-2 ${className}`}>
    <FaSearch className="text-gray-500 mr-2" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full focus:outline-none"
    />
  </div>
  )
}

export default AtmSearchInput