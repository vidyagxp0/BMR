import React, { useEffect, useState } from "react";
import InitiateModal from "../../../Modals/InitiateModal";
import HeaderTop from "../../../../../Components/Header/HeaderTop";
import DashboardBottom from "../../../../../Components/Header/DashboardBottom";
import axios from "axios";

const formatDate = (date) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(date).toLocaleDateString("en-GB", options);
};

const BMRForms = () => {
  const [approvedBMR, setApprovedBMR] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://192.168.1.5:7000/bmr-form/get-all-bmr", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        setApprovedBMR(response.data.message);
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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50">
        <HeaderTop />
        <div className="mt-20">
          <DashboardBottom />
        </div>
      </header>
      <main className="flex flex-col items-center mt-[130px] w-full px-4">
        <div className="w-full ">
          <div className="flex items-center justify-center m-3">
            <div className=" w-full flex items-center justify-between">
              <label className="text-gray-700  font-bold">BMR</label>
              <select
                id="options"
                name="options"
                className="border-2 border-gray-400 w-80 shadow-md rounded-lg p-2 focus:p-2 focus:outline-none focus:ring-2 focus:ring-[#346C86]"
                style={{ border: "2px solid gray" }}
              >
                <option value="">All Records</option>
                {approvedBMR.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <button
                className="btn bg-[#346C86] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#123e53]"
                onClick={openModal}
              >
                Initiate
              </button>
            </div>
          </div>

          {showModal && (
            <InitiateModal approvedBMR={approvedBMR} onClose={closeModal} />
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="text-white text-left">
                  <th className="bg-[#195b7a] p-2">S no</th>
                  <th className="bg-[#195b7a] p-2">BMR Name</th>
                  <th className="bg-[#195b7a] p-2">Date of initiation</th>
                  <th className="bg-[#195b7a] p-2">Division</th>
                  <th className="bg-[#195b7a] p-2">Description</th>
                  <th className="bg-[#195b7a] p-2">Current Date</th>
                  <th className="bg-[#195b7a] p-2">Due Date</th>
                  <th className="bg-[#195b7a] p-2">Due Date Indicator</th>
                  <th className="bg-[#195b7a] p-2">Status</th>
                  <th className="bg-[#195b7a] p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {approvedBMR.map((item, index) => {
                  const dueDate = new Date(item.due_date);
                  const currentDate = new Date();

                  // Calculate difference in days
                  const timeDiff = dueDate - currentDate;
                  const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                  // Define color range: green when far, red when close
                  let color;
                  if (diffDays > 10) {
                    // More than 10 days remaining
                    color = `linear-gradient(to right, #00ff00 100%, #00ff00 100%)`;
                  } else if (diffDays > 0) {
                    // Between 1 and 10 days remaining
                    const percentage = (10 - diffDays) * 10; // Gradient changes from green to red
                    color = `linear-gradient(to right, #00ff00 ${percentage}%, #ff0000 ${percentage}%)`;
                  } else {
                    // Due date has passed
                    color = `linear-gradient(to right, #ff0000 100%, #ff0000 100%)`;
                  }

                  // Calculate the position of the pin based on days remaining
                  const pinPosition = `calc(${Math.max(
                    0,
                    (10 - diffDays) * 10
                  )}% + 2px)`;

                  return (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">
                        {formatDate(item.date_of_initiation)}
                      </td>
                      <td className="p-2">{item.division_id}</td>
                      <td className="p-2">{item.description}</td>
                      <td className="p-2">{formatDate(currentDate)}</td>
                      <td className="p-2">{formatDate(item.due_date)}</td>
                      <td className="p-2">
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "10px",
                            borderRadius: "5px",
                            background: color,
                          }}
                        >
                          <div
                            className="pin"
                            style={{
                              position: "absolute",
                              width: "8px",
                              height: "15px",
                              borderRadius: "15%",
                              borderBottomLeftRadius: "90%",
                              borderBottomRightRadius: "90%",
                              backgroundColor: "lightgray",
                              border: "2px solid black",
                              transform: "translate(-50%, -50%)",
                              left: pinPosition,
                            }}
                          ></div>
                        </div>
                      </td>
                      <td
                        className={`p-2 ${
                          item.status === "Active"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.status}
                      </td>
                      <td className="p-2">
                        <button className="text-blue-500 hover:underline">
                          Edit
                        </button>{" "}
                        |{" "}
                        <button className="text-red-500 hover:underline ml-2">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BMRForms;
