import React, { useEffect, useState } from "react";
import InitiateModal from "../../../Modals/InitiateModal";
import HeaderTop from "../../../../../Components/Header/HeaderTop";
import DashboardBottom from "../../../../../Components/Header/DashboardBottom";
import axios from "axios";

const BMRForms = () => {
  const [approvedBMR, setApprovedBMR] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50">
        <HeaderTop />
        <div className="mt-20">
          <DashboardBottom />
        </div>
      </header>
      <main className="flex flex-col items-center mt-[130px] w-full px-4">
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 font-bold">BMR</label>
              <select
                id="options"
                name="options"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#346C86]"
              >
                <option value="">All Records</option>
                {approvedBMR.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn bg-[#346C86] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#123e53]"
              onClick={openModal}
            >
              Initiate
            </button>
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
                  <th className="bg-[#195b7a] p-2">Due Date</th>
                  <th className="bg-[#195b7a] p-2">Status</th>
                  <th className="bg-[#195b7a] p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {approvedBMR.map((item, index) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.initiationDate}</td>
                    <td className="p-2">{item.division}</td>
                    <td className="p-2">{item.description}</td>
                    <td className="p-2">{item.dueDate}</td>
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
                      </button>
                      {" | "}
                      <button className="text-red-500 hover:underline ml-2">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BMRForms;
