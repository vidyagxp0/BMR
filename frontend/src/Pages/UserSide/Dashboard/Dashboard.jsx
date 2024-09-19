import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import InitiateModal from "../Modals/InitiateModal";

import "./Dashboard.css";

const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [approvedBMR, setApprovedBMR] = useState([]);
  const [chartData, setChartData] = useState([
    { x: new Date("2023-01-01").getTime(), y: 10 },
    { x: new Date("2023-02-01").getTime(), y: 25 },
    { x: new Date("2023-03-01").getTime(), y: 18 },
    { x: new Date("2023-04-01").getTime(), y: 35 },
    { x: new Date("2023-05-01").getTime(), y: 30 },
    { x: new Date("2023-06-01").getTime(), y: 45 },
    { x: new Date("2023-07-01").getTime(), y: 40 },
  ]);

  const [events, setEvents] = useState([
    // Example of a static event
    {
      title: "BMR Review",
      start: new Date("2023-09-08T10:00:00"),
      end: new Date("2023-09-08T12:00:00"),
      allDay: false,
    },
  ]); // Calendar events (static for now)

  useEffect(() => {
    axios
      .get("https://bmrapi.mydemosoftware.com/bmr-form/get-approved-bmrs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        setApprovedBMR(response.data.message);
        // setChartData(response.data.chartData); // Uncomment to use dynamic data for chart
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

  // Handling event creation (when user double-clicks on a date slot)
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
      setEvents(events.filter((e) => e !== event)); // Filter out the selected event
    }
  };

  // ApexChart configuration

  return (
    <div>
      <div className="desktop-input-table-wrapper">
        {/* <div className="input-wrapper">
          <div className="group-input-2">
            <label>BMR</label>
            <select id="options" name="options">
              <option value="">All Records</option>
              {approvedBMR.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn bg-[#346C86] hover:bg-[#123e53]"
            onClick={openModal}
          >
            Initiate
          </button>
        </div> */}

        {showModal && (
          <InitiateModal approvedBMR={approvedBMR} onClose={closeModal} />
        )}

        {/* Table */}
        {/* <table className="mb-5">
          <thead>
            <tr>
              <th className="bg-[#195b7a]">S no</th>
              <th className="bg-[#195b7a]">BMR Name</th>
              <th className="bg-[#195b7a]">Date of initiation</th>
              <th className="bg-[#195b7a]">Division</th>
              <th className="bg-[#195b7a]">Description</th>
              <th className="bg-[#195b7a]">Due Date</th>
              <th className="bg-[#195b7a]">Status</th>
              <th className="bg-[#195b7a]">Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table> */}

        {/* ApexChart Integration */}

        {/* Full-width Calendar */}
        <div style={{ height: 600, marginTop: 30 }} className="bg-gray-100">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            style={{ width: "100%" }}
            onSelectSlot={handleSelect} // Double-click to add event
            onSelectEvent={handleEventDelete} // Click event to delete
            defaultView="month"
            views={["month", "week", "day"]}
            popup
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
