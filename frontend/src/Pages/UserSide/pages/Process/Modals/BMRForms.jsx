import React, { useEffect, useState } from "react";
import InitiateModal from "../../../Modals/InitiateModal";
import HeaderTop from "../../../../../Components/Header/HeaderTop";
import DashboardBottom from "../../../../../Components/Header/DashboardBottom";
import axios from "axios";
import { IconButton, Tooltip } from "@mui/material";
// import BMRDetailsModal from "./BMRDetailsModal";
import { IoInformationCircleOutline } from "react-icons/io5";
import "./BMRForms.css";
import { useNavigate } from "react-router-dom";

import AtmTable from "../../../../../AtmComponents/AtmTable"; // Adjust the import path according to your file structure
import { useSelector } from "react-redux";

const formatDate = (date) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(date).toLocaleDateString("en-GB", options);
};

const BMRForms = ({ Data }) => {
  const [approvedBMR, setApprovedBMR] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBMRData, setSelectedBMRData] = useState(null);
  const navigate = useNavigate();
  const data = useSelector((state) => state.users);
  // console.log(data, "reduxdata");
  const openBMRDetailsPage = (bmrId) => {
    navigate(`/bmr-details/${bmrId}`);
  };

  const formData = useSelector((state) => state.users.formData);
  const selectedBMR = useSelector((state) => state.users.selectedBMR);

  useEffect(() => {
    axios
      .get("http://192.168.1.26:7000/bmr-form/get-all-bmr", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        setApprovedBMR(response.data.message);
      })
      .catch((error) => {
        console.error("Failed to fetch BMR's:", error);
      });
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openDetailsModal = (bmrData) => {
    setSelectedBMRData(bmrData);
    setShowDetailsModal(true);
  };
  const divisionMap = {
    1: "India",
    2: "Malaysia",
    3: "EU",
    default: "EMEA",
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const columns = [
    {
      header: "BMR Name",
      accessor: "name",
      cell: () => selectedBMR.name || formData.name || "N/A",
    },
    {
      header: "Date of Initiation",
      accessor: "date_of_initiation",
      cell: () =>
        formData.dateOfInitiation || selectedBMR.date_of_initiation || "N/A",
    },
    {
      header: "Division",
      accessor: "division",
      Cell: ({ row }) => {
        return (
          <>{divisionMap[selectedBMR.division_id] || divisionMap.default}</>
        );
      },
    },
    {
      header: "Description",
      accessor: "description",
      cell: () => selectedBMR.description || "N/A",
    },
    {
      header: "Current Date",
      accessor: "current_date",
      Cell: () => formatDate(new Date()),
    },
    {
      header: "Due Date",
      accessor: "due_date",
      cell: () => formatDate(selectedBMR.due_date || "N/A"),
    },
    {
      header: "Due Date Progress",
      accessor: "due_date_progress",
      Cell: ({ row }) => {
        const dueDate = new Date(row.original.due_date);
        const currentDate = new Date();

        const timeDiff = dueDate - currentDate;
        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        let color;
        let message;

        if (diffDays > 10) {
          color = `linear-gradient(to right, #00ff00 ${100}%, #00ff00 ${100}%)`;
          message = `${diffDays} Days Remaining`;
        } else if (diffDays > 0) {
          const percentage = (10 - diffDays) * 10;
          color = `linear-gradient(to right, #ff0000 ${percentage}%, #00ff00 ${percentage}%)`;
          message = `${diffDays} Days Remaining`;
        } else {
          color = `linear-gradient(to right, #ff0000 100%, #ff0000 100%)`;
          message = `Overdue (${Math.abs(diffDays)} Days Past Due)`;
        }

        return (
          <div className=" flex items-center justify-between">
            {(diffDays < 0 && (
              <Tooltip title="Due date is crossed " placement="top-start">
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
        );
      },
    },
  ];

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
                className="border-2 border-[#B3C1CB] w-80 shadow-md rounded-lg p-2 focus:p-2 focus:outline-none focus:ring-2 focus:ring-[#346C86]"
                style={{ border: "2px solid gray" }}
              >
                <option value="">All Records</option>
                {approvedBMR.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div>
                {" "}
                {/* <pre>FormData: {JSON.stringify(formData, null, 2)}</pre>---- */}
                {/* <pre>Selected BMR: {JSON.stringify(selectedBMR, null, 2)}</pre> */}
              </div>
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

          <AtmTable columns={columns} data={approvedBMR} rowsPerPage={7} />
        </div>
      </main>
    </div>
  );
};

export default BMRForms;
