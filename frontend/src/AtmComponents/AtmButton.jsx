import React from 'react'

const AtmButton = ({ label, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ease-out duration-300 shadow-md hover:shadow-lg ${className}`}
    >
      {label}
    </button>
  )
}

export default AtmButton