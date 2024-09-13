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

const BMRProcess = () => {
  const [data, setData] = useState([]);
  // console.log(data, "000000000000000000");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState(0);
  console.log(setSelectedDivision, "55555555555");
  console.log(setSelectedDepartment, "111111111111f");
  const navigate = useNavigate();

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
              className="bg-gradient-to-r from-indigo-300 to-indigo-500 text-white px-4 py-2 rounded-full shadow-lg hover:from-indigo-200 hover:to-indigo-400 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Edit
            </button>

            <button
              onClick={() => {
                setSelectedUser(user);
                setShowDeleteUser(true);
              }}
              className="bg-gradient-to-r from-red-300 to-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:from-red-200 hover:to-red-400 transition duration-300 ease-in-out transform hover:-translate-y-1"
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
      .get("http://192.168.1.34:7000/bmr-form/get-all-bmr", {
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
      {/* Search Input */}
      <div className=" flex items-center justify-center w-full mb-2">
        <div className="relative flex items-center mr-5 w-[350px] rounded ">
          {/* Fixed width container */}
          <input
            type="text"
            placeholder="Search by BMR Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2  h-10 rounded pl-4 pr-10 w-full focus:p-3 focus:outline-none" // Padding for icon space
            style={{ border: "1px solid black" }}
          />
          <AiOutlineSearch
            className="absolute right-3 text-gray-500"
            size={20}
          />{" "}
        </div>
        {/* Search Icon after input */}
      </div>

      <div className="tabs flex justify-stretch gap-16 border-b">
        {[
          "All",
          "Under Initiation",
          "Under Reviewer",
          "Under Approver",
          "Approved",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative  px-3 py-2 text-sm font-semibold focus:outline-none transition
              ${
                activeTab === tab
                  ? "text-black bg-blue-50 border-b-2 border-black"
                  : "text-gray-500 hover:text-black hover:bg-blue-100"
              } 
              rounded-t-lg`}
            style={{
              borderBottom: activeTab === tab ? "2px solid blue" : "",
              backgroundColor: activeTab === tab ? "#f3f4f6" : "",
            }}
          >
            {tab}
          </button>
        ))}

        {/* First Dropdown - Select Filter */}
        <select
          name="Select Filter"
          value={selectedFilter}
          onChange={handleFilterChange}
          className="text-gray-500 hover:text-black hover:bg-blue-100 text-sm  hover:rounded-t-lg font-semibold"
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
          className="text-gray-500 hover:text-black hover:bg-blue-100 hover:rounded-t-lg text-sm font-semibold"
        >
          {getSecondDropdownOptions()}
        </select>
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
