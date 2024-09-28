/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import HeaderBottom from "../../../../Components/Header/HeaderBottom";
import AtmTable from "../../../../AtmComponents/AtmTable";
import CreateRecordModal from "../../Modals/CreateRecordModal/CreateRecordModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditRecordModal from "../../Modals/CreateRecordModal/EditRecordModal";
import DeleteUserModal from "../../Modals/CreateRecordModal/DeleteUserModal";
import { formattedDate } from "../../../../AtmComponents/Helper";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineSearch } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../../../config.json";
import { IconButton, Tooltip } from "@mui/material";
import { IoInformationCircleOutline } from "react-icons/io5";
import "./BMRProcess.css";
//import CreateRecordModal from "../../Pages/UserSide/Modals/CreateRecordModal/CreateRecordModal";

const BMRProcess = () => {
  const [data, setData] = useState([]);
  console.log(data, "000000000000000000");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState(0);
  const [isFocused, setIsFocused] = useState(false); // New state for focus
  const [showCreateRecordModal, setShowCreateRecordModal] = useState(false); // Renamed state to control modal visibility

  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    if (tab === "Design BMR") {
      setShowCreateRecordModal(true); // Open modal when "Design BMR" is clicked
    } else {
      setActiveTab(tab); // Set active tab for other tabs
    }
  };

  const columns = [
    {
      header: "BMR Id",
      accessor: "bmr_id",
      Cell: ({ row }) => {
        const bmrId = row.original.bmr_id;
        const formattedBmrId = bmrId < 10 ? `1000${bmrId}` : `100${bmrId}`;
        return <span>{formattedBmrId}</span>;
      },
    },
    {
      header: "BMR Name",
      accessor: "name",
      Cell: ({ row }) => {
        return (
          <span className="cursor-pointer hover:text-blue-500">
            <div
              onClick={() => {
                navigate(`/process/processdetails/${row.original.bmr_id}`);
              }}
            >
              {row.original.name}
            </div>
          </span>
        );
      },
    },
    {
      header: "Division",
      accessor: "division",
      Cell: ({ row }) => {
        return (
          <>
            {" "}
            {row.original.division_id === 1
              ? "India"
              : row.original.division_id === 2
                ? "Malaysia "
                : row.original.division_id === 3
                  ? "EU"
                  : "EMEA"}
          </>
        );
      },
    },
    {
      header: "Date Of Initiation",
      accessor: "date_of_initiation",
      Cell: ({ row }) => formattedDate(row.original.date_of_initiation),
    },
    { header: "Description", accessor: "description" },
    {
      header: "Due Date",
      accessor: "due_date",
      Cell: ({ row }) => formattedDate(row.original.due_date),
    },
    {
      header: "Department",
      accessor: "department",
      Cell: ({ row }) => {
        return (
          <>
            {" "}
            {row.original.department_id === 1
              ? "Coorporate Quality Assurance"
              : row.original.department_id === 2
                ? "Quality Assurance Biopharma "
                : row.original.department_id === 3
                  ? "Central Quality Control"
                  : row.original.department_id === 4
                    ? "Manufacturing"
                    : row.original.department_id === 5
                      ? "Plasma Sourcing Group"
                      : row.original.department_id === 6
                        ? "Central Stores"
                        : row.original.department_id === 7
                          ? "Information Technology Group"
                          : row.original.department_id === 8
                            ? "Molecular Medicine"
                            : row.original.department_id === 9
                              ? "Central Laboratory"
                              : row.original.department_id === 10
                                ? "Tech Team"
                                : row.original.department_id === 11
                                  ? "Quality Assurance"
                                  : row.original.department_id === 12
                                    ? "Quality Management"
                                    : row.original.department_id === 13
                                      ? "IT Administration"
                                      : row.original.department_id === 14
                                        ? "Accounting"
                                        : row.original.department_id === 15
                                          ? "Logistics"
                                          : row.original.department_id === 16
                                            ? "Senior Management"
                                            : row.original.department_id === 17
                                              ? "Business Administration"
                                              : row.original.department_id === 18
                                                ? "Others"
                                                : row.original.department_id === 19
                                                  ? "Quality Control"
                                                  : row.original.department_id === 20
                                                    ? "Production"
                                                    : row.original.department_id === 21
                                                      ? "Accounting Manager"
                                                      : row.original.department_id === 22
                                                        ? "Quality Assurance Director"
                                                        : row.original.department_id === 23
                                                          ? "Quality Manager"
                                                          : row.original.department_id === 24
                                                            ? "Supervisor"
                                                            : "Director"}
          </>
        );
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
          <div className="flex items-center justify-between w-[140px] ">
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
    { header: "Status", accessor: "status" },
    {
      header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSelectedUser(user);
                setIsEditModalOpen(true);
              }}
              className="bg-gradient-to-r from-[#403f3f] to-[#3f4348] text-white px-4 py-2 rounded-full shadow-lg hover:from-blue-500 hover:to-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Edit
            </button>

            <button
              onClick={() => {
                setSelectedUser(user);
                setShowDeleteUser(true);
              }}
              className="bg-gradient-to-r from-red-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:from-red-500 hover:to-red-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  const fetchBMRData = () => {
    axios
      .get(`${BASE_URL}/bmr-form/get-all-bmr`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.message.sort(
          (a, b) =>
            new Date(b.date_of_initiation) - new Date(a.date_of_initiation)
        );
        setData(sortedData);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error Fetching BMR");
      });
  };

  useEffect(() => {
    fetchBMRData();
  }, []);

  const [selectedFilter, setSelectedFilter] = useState("");

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
    setSelectedDivision(""); // Reset division when changing filter
    setSelectedDepartment(""); // Reset department when changing filter
  };
  const handleDivisionChange = (e) => {
    setSelectedDivision(parseInt(e.target.value));
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(parseInt(e.target.value));
  };

  const getSecondDropdownOptions = () => {
    if (selectedFilter === "division") {
      return (
        <>
          <option value="">Select Division</option>
          <option value={1}>India</option>
          <option value={2}>Malaysia</option>
          <option value={3}>EU</option>
          <option value={4}>EMEA</option>
        </>
      );
    } else if (selectedFilter === "department") {
      return (
        <>
          <option value="">Select Department</option>
          <option value={1}>Corporate Quality Assurance</option>
          <option value={2}>Quality Assurance Biopharma</option>
          <option value={3}>Central Quality Control</option>
          <option value={4}>Manufacturing</option>
          <option value={5}>Plasma Sourcing Group</option>
          <option value={6}>Central Stores</option>
          <option value={7}>Information Technology Group</option>
          <option value={8}>Molecular Medicine</option>
          <option value={9}>Central Laboratory</option>
          <option value={10}>Tech Team</option>
          <option value={11}>Quality Assurance</option>
          <option value={12}>Quality Management</option>
          <option value={13}>IT Administration</option>
          <option value={14}>Accounting</option>
          <option value={15}>Logistics</option>
          <option value={16}>Senior Management</option>
          <option value={17}>Business Administration</option>
          <option value={18}>Others</option>
          <option value={19}>Quality Control</option>
          <option value={20}>Production</option>
          <option value={21}>Accounting Manager</option>
          <option value={22}>Quality Assurance Director</option>
          <option value={23}>Quality Manager</option>
          <option value={24}>Supervisor</option>
          <option value={25}>Director</option>
        </>
      );
    } else {
      return <option value="">Please select a filter first</option>;
    }
  };

  const filteredData = data
    .filter((item) => {
      switch (activeTab) {
        case "Under Initiation":
          return item.status === "Under Initiation";
        case "Under Reviewer":
          return item.status === "Under Review";
        case "Under Approver":
          return item.status === "Under Approval";
        case "Approved":
          return item.status === "Approved";
        case "All":
        default:
          return true;
      }
    })
    .filter((item) => {
      if (selectedDivision) {
        return item.division_id === selectedDivision;
      }
      return true;
    })
    .filter((item) => {
      if (selectedDepartment) {
        return item.department_id === selectedDepartment;
      }
      return true;
    })
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleAddBMR = (
    name,
    reviewers,
    approvers,
    status,
    date_of_initiation,
    bmr_tab_id
  ) => {
    const reviewerNames = reviewers.map((rev) => rev.label).join(", ");
    const approverNames = approvers.map((app) => app.label).join(", ");

    setData((prevData) => [
      {
        name,
        status,
        date_of_initiation: formattedDate(date_of_initiation),
        reviewers: reviewerNames,
        approvers: approverNames,
        bmr_tab_id,
      },
      ...prevData,
    ]);
    setIsModalOpen(false);
    fetchBMRData();
  };

  return (
    <div>
      <ToastContainer />
      <HeaderBottom openModal={() => setIsModalOpen(true)} />
      {/* Container for search bar and tabs */}
      <div className="flex flex-col w-full mb-0">
        <div className="flex flex-col w-full mb-3">
          <div className="flex items-center w-full mb-2">
            <div className="relative flex items-center w-[500px] rounded">
              {/* Conditionally render the search icon */}
              {searchQuery.length === 0 && !isFocused && (
                <AiOutlineSearch
                  className="absolute left-2 text-gray-500 pointer-events-none"
                  size={20}
                />
              )}
              <input
                type="text"
                placeholder={
                  !isFocused ? "Search by BMR NamefsetActiveTab" : ""
                } // Conditional placeholder
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)} // Set focus state to true
                onBlur={() => setIsFocused(false)} // Set focus state to false
                className="border h-10 rounded pl-8 pr-4 w-full focus:outline-none"
                style={{ border: "1px solid black" }}
              />
            </div>
            {/* Tabs positioned next to the search input with slight gap */}
            <div className="flex justify-between gap-1 ml-2">
              {/* Adjusted gap and margin */}
             <div className="flex justify-end items-end">
             <button
                onClick={() => handleTabClick("Design BMR")}
                className={`relative px-4 py-2 text-sm font-semibold focus:outline-none transition 
      ${activeTab === "Design BMR"
                    ? "bg-[#2a323e] text-white font-semibold rounded-md hover:bg-[#123e53] transition-all" // Active tab: Dark gradient without hover effect
                    : "bg-[#2a323e] text-white font-semibold rounded-md hover:bg-[#123e53] transition-all" // Non-active: Light gray with blue hover effects
                  }
      rounded-lg`} // Added margin-x for horizontal spacing
              >
                Design BMR
              </button>
             </div>
              {/* Create Record Modal */}
              {showCreateRecordModal && (
                <CreateRecordModal
                  onClose={() => setShowCreateRecordModal(false)}
                /> // Adjust your modal component as necessary
              )}
            </div>
          </div>

          {/* Row for Select Filters positioned below the search bar */}
          <div className="flex gap-4 mt-2">
            {" "}
            {/* Increased gap for better spacing */}
            {/* First Dropdown - Select Filter */}
            <select
              name="Select Filter"
              value={selectedFilter}
              onChange={handleFilterChange}
              className="custom-select text-gray-500 hover:text-black hover:bg-blue-100 text-sm font-semibold rounded border border-black px-2 focus:outline-none" // Applied custom class
            >
              <option value="">Select Filter</option>
              <option value="division">Division</option>
              <option value="department">Department</option>
            </select>
            {/* Second Dropdown - Options based on selected filter */}
            <select
              value={
                selectedFilter === "division"
                  ? selectedDivision
                  : selectedDepartment
              }
              onChange={
                selectedFilter === "division"
                  ? handleDivisionChange
                  : handleDepartmentChange
              }
              className="custom-select text-gray-500 hover:text-black hover:bg-blue-100 text-sm font-semibold rounded border border-black px-3 focus:outline-none" // Applied custom class
            >
              {getSecondDropdownOptions()}
            </select>
          </div>
        </div>
      </div>
      <div>
            {[
                "All",
                "Under Initiation",
                "Under Reviewer",
                "Under Approver",
                "Approved",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)} // Use the new handler
                  className={`relative px-6 py-3 text-sm font-semibold focus:outline-none transition 
        ${activeTab === tab
                      ? "text-white bg-gradient-to-r from-blue-800 to-blue-900 shadow-lg transform scale-100 transition duration-300 rounded-md border border-blue-900 opacity-95" // Active tab: Dark gradient without hover effect
                      : "text-gray-800 bg-gray-300 border border-gray-400 hover:bg-gray-400 hover:text-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 rounded-md" // Non-active: Light gray with blue hover effects
                    }
        rounded-lg mx-2`} // Added margin-x for horizontal spacing
                >
                  {tab}
                </button>
              ))}
            </div>
      <div className="table-container">
        <AtmTable columns={columns} data={filteredData} />
      </div>
      {isModalOpen && (
        <CreateRecordModal
          onClose={() => {
            setIsModalOpen(false);
            fetchBMRData();
          }}
          addBMR={handleAddBMR}
        />
      )}
      {isEditModalOpen && (
        <EditRecordModal
          onClose={() => {
            setIsEditModalOpen(false);
            fetchBMRData();
          }}
          bmrData={selectedUser}
          fetchBMRData={fetchBMRData}
          bmr_tab_id={selectedUser?.bmr_tab_id}
        />
      )}
      {showDeleteUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => setShowDeleteUser(false)}
          id={selectedUser?.bmr_id}
          setData={setData}
        />
      )}
    </div>
  );
};

export default BMRProcess;
