import React, { useEffect, useState } from "react";
import InitiateModal from "../../../Modals/InitiateModal";
import HeaderTop from "../../../../../Components/Header/HeaderTop";
import DashboardBottom from "../../../../../Components/Header/DashboardBottom";
import axios from "axios";
import "./BMRForms.css";

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
      .get("https://bmrapi.mydemosoftware.com/bmr-form/get-approved-bmrs", {
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

  const calculateProgress = (dueDate) => {
    const currentDate = new Date();
    const endDate = new Date(dueDate);

    const totalDuration = endDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(totalDuration / (1000 * 60 * 60 * 24));

    const overdueProgress = Math.max(0, Math.min(100, (10 - daysRemaining) * 10));
    const onTimeProgress = 100 - overdueProgress; // The remaining progress that's on time
    return { overdueProgress, onTimeProgress, isOverdue: daysRemaining < 0 };
  };

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
                className="border-2 border-gray-400 w-80 shadow-md rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#346C86]"
              >
                <option value="">All Records</option>
                {approvedBMR.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <button
                className="btn bg-[#2a323e] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#123e53] transition-all"
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-300 bg-[#2a323e]">
                    S no
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-300 bg-[#2a323e]">
                    BMR Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-300 bg-[#2a323e]">
                    Date of initiation
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-300 bg-[#2a323e]">
                    Division
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-300 bg-[#2a323e]">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-300 bg-[#2a323e]">
                    Current Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-300 bg-[#2a323e]">
                    Due Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-300 bg-[#2a323e]">
                    Due Date Progress
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-300 bg-[#2a323e]">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-300 bg-[#2a323e]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((item, rowIndex) => {
                  const { overdueProgress, onTimeProgress } = calculateProgress(item.due_date);

                  return (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor:
                          rowIndex % 2 === 0 ? "#fafbfc" : "#cad2de", // Softer Gray for even rows, Softer Blue for odd rows
                      }}
                      className="border-b border-gray-300"
                    >
                      <td className="px-4 py-2 whitespace-nowrap text-sm border-r border-gray-300">
                        {startIndex + rowIndex + 1}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{item.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{formatDate(item.date_of_initiation)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{item.division_id}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{item.description}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{formatDate(new Date())}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{formatDate(item.due_date)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <div className="w-full h-4 bg-gray-300 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-[#4caf50]" // Green portion for on-time progress
                            style={{
                              width: `${onTimeProgress}%`,
                              float: "left",
                              transition: "width 0.5s ease-in-out",
                            }}
                          />
                          <div
                            className="h-full bg-[#ff2828]" // Red portion for overdue progress
                            style={{
                              width: `${overdueProgress}%`,
                              float: "left",
                              transition: "width 0.5s ease-in-out",
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{item.status}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <div className="flex justify-between space-x-2">
                          {/* Delete button */}
                          <button
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#db3636] text-white hover:bg-[#ff2828] transition duration-300 ease-in-out shadow-lg"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                          {/* Edit button */}
                          <button
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#4caf50] text-white hover:bg-[#66bb6a] transition duration-300 ease-in-out shadow-lg"
                            onClick={() => handleEdit(item.id)}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              className="px-3 py-1 text-sm font-semibold text-gray-700 border rounded-lg shadow-md hover:bg-gray-200 transition-all"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </button>
            <span className="text-gray-700 font-semibold text-sm">{`${currentPage} of ${totalPages}`}</span>
            <button
              className="px-3 py-1 text-sm font-semibold text-gray-700 border rounded-lg shadow-md hover:bg-gray-200 transition-all"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
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
