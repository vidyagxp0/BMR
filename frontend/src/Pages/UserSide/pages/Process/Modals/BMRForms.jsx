import React, { useEffect, useState } from "react";
import InitiateModal from "../../../Modals/InitiateModal";
import HeaderTop from "../../../../../Components/Header/HeaderTop";
import DashboardBottom from "../../../../../Components/Header/DashboardBottom";
import axios from "axios";
import { IconButton, Tooltip } from "@mui/material";
import { IoInformationCircleOutline } from "react-icons/io5";
import "./BMRForms.css";

import { AiOutlineAudit } from "react-icons/ai";
import { Navigate } from "react-router-dom";

const formatDate = (date) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(date).toLocaleDateString("en-GB", options);
};

const BMRForms = () => {
  const [approvedBMR, setApprovedBMR] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  useEffect(() => {
    axios
      .get("http://192.168.1.21:7000/bmr-form/get-all-bmr", {
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

  const totalPages = Math.ceil(approvedBMR.length / rowsPerPage);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = approvedBMR.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="flex flex-col p-3">
      <header className="fixed top-0 left-0 w-full z-50">
        <HeaderTop />
        <div>
          <DashboardBottom />
        </div>
      </header>
      <main className="flex flex-col items-center mt-[30px] w-full ">
        <div className="w-full">
          <div className="flex items-center justify-center m-3">
            <div className="w-full flex items-center justify-between">
              <label className="text-gray-700 font-bold">BMR</label>
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
            <table className="table-auto w-full ">
              <thead>
                <tr className="text-white text-left">
                  <th className="bg-[#195b7a] p-2">S no</th>
                  <th className="bg-[#195b7a] p-2">BMR Name</th>
                  <th className="bg-[#195b7a] p-2">Date of initiation</th>
                  <th className="bg-[#195b7a] p-2">Division</th>
                  <th className="bg-[#195b7a] p-2">Description</th>
                  <th className="bg-[#195b7a] p-2">Current Date</th>
                  <th className="bg-[#195b7a] p-2">Due Date</th>
                  <th className="bg-[#195b7a] p-2">Due Date Progress</th>
                  <th className="bg-[#195b7a] p-2">Status</th>
                  <th className="bg-[#195b7a] p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((item, index) => {
                  const dueDate = new Date(item.due_date);
                  const currentDate = new Date();

                  const timeDiff = dueDate - currentDate;
                  const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                  let color;
                  let percentage;

                  if (diffDays > 0) {
                    percentage = (10 - diffDays) * 10;
                    color = `linear-gradient(to right, #ff0000 ${percentage}%, #00ff00 ${percentage}%)`;
                    const message =
                      diffDays === 1
                        ? `${diffDays} Day Remaining`
                        : `${diffDays} Days Remaining`;
                  } else {
                    color = `linear-gradient(to right, #ff0000 100%, #ff0000 100%)`;
                    percentage = 0;
                  }

                  const pinPosition = `${percentage}%`;

                  return (
                    <tr key={item.id} className="">
                      <td className="p-2">{startIndex + index + 1}</td>
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">
                        {formatDate(item.date_of_initiation)}
                      </td>
                      <td className="p-2">{item.division_id}</td>
                      <td className="p-2">{item.description}</td>
                      <td className="p-2">{formatDate(currentDate)}</td>
                      <td className="p-2">{formatDate(item.due_date)}</td>
                      <td>
                        <div className=" flex items-center justify-between">
                          {(diffDays < 0 && (
                            <Tooltip
                              title="Due date is crossed "
                              placement="top-start"
                            >
                              <IconButton>
                                <div className="icon-animate ">
                                  <IoInformationCircleOutline />
                                </div>
                              </IconButton>
                            </Tooltip>
                          )) || (
                            <Tooltip
                              title={`${diffDays} Days Remaining`}
                              placement="top-start"
                            >
                              <IconButton>
                                <div className="icon-animate ">
                                  <IoInformationCircleOutline />
                                </div>
                              </IconButton>
                            </Tooltip>
                          )}

                          <div
                            style={{
                              position: "relative",
                              width: "100%",
                              height: "10px",
                              borderRadius: "5px",
                              background: color,
                            }}
                          ></div>
                        </div>
                      </td>

                      <td
                        className={`p-2 ${
                          item.status === "Active"
                            ? "text-gray-950"
                            : "text-gray-950"
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

          {/* Pagination Controls */}
          <div className="flex justify-center my-4">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-md"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-md"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BMRForms;
