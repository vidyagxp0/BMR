import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import InitiateModal from "../Modals/InitiateModal";
import ReactApexChart from "react-apexcharts";
import "./Dashboard.css";
import DashboardBottom from "../../../Components/Header/DashboardBottom";

const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [approvedBMR, setApprovedBMR] = useState([]);
  const [chartData, setChartData] = useState([
    { x: new Date('2023-01-01').getTime(), y: 10 },
    { x: new Date('2023-02-01').getTime(), y: 25 },
    { x: new Date('2023-03-01').getTime(), y: 18 },
    { x: new Date('2023-04-01').getTime(), y: 35 },
    { x: new Date('2023-05-01').getTime(), y: 30 },
    { x: new Date('2023-06-01').getTime(), y: 45 },
    { x: new Date('2023-07-01').getTime(), y: 40 }
  ]);

  const [events, setEvents] = useState([
    // Example of a static event
    {
      title: "BMR Review",
      start: new Date('2023-09-08T10:00:00'),
      end: new Date('2023-09-08T12:00:00'),
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
  const chartOptions = {
    series: [
      {
        name: "BMR Records",
        data: chartData,
      },
    ],
    options: {
      chart: {
        type: "area",
        height: 350,
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom",
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      title: {
        text: "BMR Records Chart",
        align: "left",
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        title: {
          text: "Record Count",
        },
      },
      tooltip: {
        shared: false,
      },
    },
  };

  return (
    <div>
      {/* <DashboardBottom/> */}
      <div className="desktop-input-table-wrapper">
        <div className="input-wrapper">
          <div className="group-input-2">
            <label>BMR</label>
            <select id="options" name="options" >
              <option value="" >All Records</option>
              {approvedBMR.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn" onClick={openModal}>
            Initiate
          </button>
        </div>

        {showModal && (
          <InitiateModal approvedBMR={approvedBMR} onClose={closeModal} />
        )}

        {/* Table */}
        <table className="mb-5">
          <thead>
            <tr>
              <th>S no</th>
              <th>BMR Name</th>
              <th>Date of initiation</th>
              <th>Division</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>

        {/* ApexChart Integration */}
        <div id="chart">
          <ReactApexChart
            options={chartOptions.options}
            series={chartOptions.series}
            type="area"
            height={350}
          />
        </div>

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
