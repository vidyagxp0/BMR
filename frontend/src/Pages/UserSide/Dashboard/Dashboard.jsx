import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import InitiateModal from "../Modals/InitiateModal";
import { BASE_URL } from "../../../config.json";
import CountUp from "react-countup"; // Importing CountUp

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
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 rounded-md shadow-lg text-white mb-6 md:mb-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs md:text-sm opacity-75">Welcome back, User!</p>
        </div>
        <button
          className="btn mt-4 md:mt-0 bg-[#ffffff] text-black font-semibold py-2 px-4 rounded-md hover:bg-[#123e53] transition-colors duration-300"
          onClick={openModal}
        >
          Initiate BMR
        </button>
      </div>

      {showModal && (
        <InitiateModal approvedBMR={approvedBMR} onClose={closeModal} />
      )}

      {/* Notification Bar */}
      <div className="p-3 rounded-lg mb-6 md:mb-8 shadow-md bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
        <marquee className="text-white p-2 rounded-lg">
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
            <span className="text-sm md:text-base">
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
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg mb-6 md:mb-8 border border-gray-200">
        <h2 className="text-xl md:text-2xl font-extrabold mb-4 text-gray-800">
          BMR Records
        </h2>
        {/* Add your BMR records content here */}
      </div>

      {/* Stats Section */}
      <div className="flex flex-wrap justify-between gap-6 mb-8">
        {/* Total BMR Records */}
        <div className="flex-1 min-w-[200px] bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-700">
                Total BMR Records
              </h2>
              <p className="text-3xl md:text-4xl font-semibold text-gray-800">
                <CountUp end={approvedBMR.length} duration={2} />
              </p>
            </div>
            <div className="bg-gray-300 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 md:h-12 md:w-12 text-gray-500"
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
        <div className="flex-1 min-w-[200px] bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-700">
                Total Initiate
              </h2>
              <p className="text-3xl md:text-4xl font-semibold text-gray-800">
                <CountUp end={15} duration={2} />
              </p>
            </div>
            <div className="bg-gray-300 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 md:h-12 md:w-12 text-gray-500"
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
        <div className="flex-1 min-w-[200px] bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-700">
                Total Approved
              </h2>
              <p className="text-3xl md:text-4xl font-semibold text-gray-800">
                <CountUp end={approvedBMR.length} duration={2} />
              </p>
            </div>
            <div className="bg-gray-300 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 md:h-12 md:w-12 text-gray-500"
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

        {/* Pending Actions */}
        <div className="flex-1 min-w-[200px] bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-700">
                Pending Actions
              </h2>
              <p className="text-3xl md:text-4xl font-semibold text-gray-800">
                <CountUp end={approvedBMR.length} duration={2} />
              </p>
            </div>
            <div className="bg-gray-300 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 md:h-12 md:w-12 text-gray-500"
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

        {/* Upcoming Events */}
        <div className="flex-1 min-w-[200px] bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-700">
                Upcoming Events
              </h2>
              <p className="text-3xl md:text-4xl font-semibold text-gray-800">
                <CountUp end={approvedBMR.length} duration={2} />
              </p>
            </div>
            <div className="bg-gray-300 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 md:h-12 md:w-12 text-gray-500"
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
      </div>

      {/* Calendar Section */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg mb-8 border border-gray-200 w-full max-w-full">
        <h2 className="text-xl md:text-2xl font-extrabold mb-4 text-gray-800 text-center">
          Calendar
        </h2>

        <div className="overflow-x-auto">
          <Calendar
            selectable
            localizer={localizer}
            events={events}
            defaultView="month"
            startAccessor="start"
            endAccessor="end"
            style={{ height: "70vh", maxWidth: "100%" }}
            onSelectEvent={handleEventDelete}
            onSelectSlot={handleSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
