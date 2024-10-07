// src/Pages/CustomError/ServerErrorPage.jsx

import React from "react";

const ServerErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-600">500</h1>
        <h2 className="mt-4 text-2xl font-semibold">Internal Server Error</h2>
        <p className="mt-2 text-gray-600">
          Sorry, something went wrong on our end. Please try again later.
        </p>
        <a
          href="/"
          className="mt-4 inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default ServerErrorPage;
