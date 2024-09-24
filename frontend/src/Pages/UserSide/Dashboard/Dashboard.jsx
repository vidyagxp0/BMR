import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import InitiateModal from "../Modals/InitiateModal";
import { BASE_URL } from "../../../config.json";

import "./Dashboard.css";

const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [approvedBMR, setApprovedBMR] = useState([]);
  const [events, setEvents] = useState([
    {
      title: "BMR Review",
      start: new Date("2023-09-08T10:00:00"),
      end: new Date("2023-09-08T12:00:00"),
      allDay: false,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBMR, setFilteredBMR] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/bmr-form/get-approved-bmrs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        setApprovedBMR(response.data.message);
        setFilteredBMR(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSelect = ({ start, end }) => {
    const title = window.prompt("Enter the event title");
    if (title) {
      setEvents([
        ...events,
        {
          start,
          end,
          title,
        },
      ]);
    }
  };

  const handleEventDelete = (event) => {
    const confirmDelete = window.confirm(`Delete the event "${event.title}"?`);
    if (confirmDelete) {
      setEvents(events.filter((e) => e !== event));
    }
  };

  useEffect(() => {
    setFilteredBMR(
      approvedBMR.filter((bmr) =>
        bmr.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, approvedBMR]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 rounded-md shadow-lg text-white mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm opacity-75">Welcome back, User!</p>
        </div>
        <button
          className="btn bg-[#ffffff] text-black font-semibold py-2 px-4 rounded-md hover:bg-[#123e53]"
          onClick={openModal}
        >
          Initiate BMR
        </button>
      </div>

      {showModal && (
        <InitiateModal approvedBMR={approvedBMR} onClose={closeModal} />
      )}

      {/* Notification Bar */}
      <div className="p-3 rounded-lg mb-8 shadow-md">
        <marquee className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white p-2 rounded-lg">
          <span className="flex items-center space-x-2">
            {/* Bell Icon (Start) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            </svg>

            {/* Scrolling Text */}
            <span>
              New updates are available! Check out the latest BMR records and
              upcoming events.
            </span>

            {/* Bell Icon (End) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            </svg>
          </span>
        </marquee>
      </div>

      {/* Display Filtered BMR Records */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-200">
        <h2 className="text-2xl font-extrabold mb-4 text-gray-800">
          BMR Records
        </h2>
        {/* <ul className="list-disc list-inside text-gray-600">
          {filteredBMR.map((bmr, index) => (
            <li key={index} className="mb-2">
              {bmr.name} - Approved on {bmr.approvalDate}
            </li>
          ))}
        </ul> */}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Total BMR Records */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-700">
                Total BMR Records
              </h2>
              <p className="text-4xl font-semibold text-gray-800">
                {approvedBMR.length}
              </p>
            </div>
            <div className="bg-gray-300 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10M3 7l9 6 9-6M3 17l9 6 9-6"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Initiate */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-700">
                Total Initiate
              </h2>
              <p className="text-4xl font-semibold text-gray-800">15</p>
            </div>
            <div className="bg-gray-300 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7v10M8 7l4 6 4-6v10"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Approved */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-700">
                Total Approved
              </h2>
              <p className="text-4xl font-semibold text-gray-800">
                {approvedBMR.length}
              </p>
            </div>
            <div className="bg-gray-300 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 7v10M12 7l4 6-4 6V7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-700">
                Upcoming Events
              </h2>
              <p className="text-4xl font-semibold text-gray-800">
                {events.length}
              </p>
            </div>
            <div className="bg-gray-300 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7v10M8 7l4 6 4-6v10"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-700">
                Pending Actions
              </h2>
              <p className="text-4xl font-semibold text-gray-800">10</p>
            </div>
            <div className="bg-gray-300 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7v10M8 7l4 6 4-6v10"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Upcoming Calendar Events
        </h2>
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, width: "100%" }} // Reduced height and width
          onSelectEvent={handleEventDelete}
          onSelectSlot={handleSelect}
        />
      </div>
    </div>
  );
};

export default Dashboard;
