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

import AtmTable from "../../../../../AtmComponents/AtmTable";
import { useSelector } from "react-redux";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const BMRForms = () => {
  const [approvedBMR, setApprovedBMR] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBMRData, setSelectedBMRData] = useState(null);
  const navigate = useNavigate();
  const data = useSelector((state) => state.users);
  const openBMRDetailsPage = (bmrId) => {
    navigate(`/bmr-details/${bmrId}`);
  };

  const formData = useSelector((state) => state.users.formData);
  const selectedBMR = useSelector((state) => state.users.selectedBMR);

  const dateOfInitiation = formatDate(selectedBMR.date_of_initiation);
  // console.log(dateOfInitiation, "doi");

  const dueDate = formatDate(selectedBMR.due_date);
  // console.log(dueDate, "dueDate");

  // const divisionn = selectedBMR.division_id
  // console.log(divisionn,"division");

  useEffect(() => {
    axios
      .get("https://bmrapi.mydemosoftware.com/bmr-form/get-all-bmr", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        const approvedItems = response.data.message.filter(
          (item) => item.status === "Approved"
        );
        setApprovedBMR(approvedItems);
        // console.log(approvedItems, "kkkkkkkkk");
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

  // const openDetailsModal = (bmrData) => {
  //   setSelectedBMRData(bmrData);
  //   setShowDetailsModal(true);
  // };
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
      header: "Date of Initiation",
      accessor: "date_of_initiation",
      cell: () => {
        const date =
          formData.dateOfInitiation || selectedBMR.date_of_initiation;
        return date ? formatDate(date) : "N/A";
      },
    },
    {
      header: "Current Date",
      accessor: "current_date",
      Cell: () => formatDate(new Date()),
    },
    {
      header: "Due Date",
      accessor: "due_date",
      cell: () => {
        const dueDate = selectedBMR.due_date;
        return dueDate ? formatDate(dueDate) : "N/A";
      },
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
          <div className="flex items-center justify-between">
            {(diffDays < 0 && (
              <Tooltip title="Due date is crossed" placement="top-start">
                <IconButton>
                  <div className="icon-animate">
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
                  <div className="icon-animate">
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

  const [filter, setFilter] = useState("");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredBMR = approvedBMR.filter((item) =>
    filter === "" ? true : item.name.toLowerCase() === filter.toLowerCase()
  );

  const calculateProgress = (dueDate) => {
    const currentDate = new Date();
    const endDate = new Date(dueDate);

    const totalDuration = endDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(totalDuration / (1000 * 60 * 60 * 24));

    const overdueProgress = Math.max(
      0,
      Math.min(100, (10 - daysRemaining) * 10)
    );
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
                style={{ border: "2px solid gray" }}
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="">All Records</option>
                {approvedBMR.map((item, index) => (
                  <option key={index} value={item.name}>
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

          <AtmTable columns={columns} data={filteredBMR} rowsPerPage={7} />
        </div>
      </main>
    </div>
  );
};

export default BMRForms;
