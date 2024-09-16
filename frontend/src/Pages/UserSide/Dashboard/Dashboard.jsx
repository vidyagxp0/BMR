import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import InitiateModal from "../Modals/InitiateModal";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
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
  const [notifications, setNotifications] = useState([
    "New BMR record approved",
    "System maintenance on 12th Sep",
    "Upcoming event: BMR Workshop",
  ]);

  useEffect(() => {
    axios
      .get("http://192.168.1.26:7000/bmr-form/get-approved-bmrs", {
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

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "BMR Records Trend",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 rounded-md shadow-lg text-white mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm opacity-75">Welcome back, [User Name]!</p>
        </div>
        <button
          className="bg-teal-500 text-white hover:bg-teal-400 px-6 py-2 rounded-lg shadow-md font-semibold transition-transform transform hover:scale-105"
          onClick={openModal}
        >
          Initiate BMR
        </button>
      </div>

      {showModal && (
        <InitiateModal approvedBMR={approvedBMR} onClose={closeModal} />
      )}

      {/* Notification Bar */}
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg shadow-md mb-8 marquee-container">
        <marquee behavior="scroll" direction="left">
          {notifications.join(" | ")}
        </marquee>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search BMR records..."
          className="w-full p-4 rounded-lg shadow-md focus:outline-none border border-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Display Filtered BMR Records */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Approved BMR Records
        </h2>
        <ul className="list-disc list-inside text-gray-600">
          {filteredBMR.map((bmr, index) => (
            <li key={index} className="mb-2">
              {bmr.name} - Approved on {bmr.approvalDate}
            </li>
          ))}
        </ul>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
          <div>
            <h2 className="text-xl font-bold text-gray-700">
              Total BMR Records
            </h2>
            <p className="text-3xl font-semibold text-gray-900">
              {approvedBMR.length}
            </p>
          </div>
          <div className="text-gray-600 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
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

        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
          <div>
            <h2 className="text-xl font-bold text-gray-700">Upcoming Events</h2>
            <p className="text-3xl font-semibold text-gray-900">
              {events.length}
            </p>
          </div>
          <div className="text-gray-600 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
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

        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
          <div>
            <h2 className="text-xl font-bold text-gray-700">Pending Actions</h2>
            <p className="text-3xl font-semibold text-gray-900">7</p>
            <div className="mt-4">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="w-full bg-gray-300 h-2 rounded-lg">
                <div
                  className="bg-teal-500 h-2 rounded-lg"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Calendar View
        </h2>
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 300 }} // Reduced Calendar Size
          onSelectEvent={handleEventDelete}
          onSelectSlot={handleSelect}
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;
