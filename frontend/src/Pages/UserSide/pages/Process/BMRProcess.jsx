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
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const columns = [
    { header: "BMR Id", accessor: "bmr_id" },
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
    { header: "Division", accessor: "division" },
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
      .get("https://bmrapi.mydemosoftware.com/bmr-form/get-all-bmr", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.message.sort(
          (a, b) => new Date(b.date_of_initiation) - new Date(a.date_of_initiation)
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

  // Filter data based on active tab and search query
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
          return true; // Show all data
      }
    })
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ); // Filter by search query

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
      <div className="my-4">
        
      </div>

      {/* Tabs for filtering */}
      <div className="tabs flex justify-start border-b">
      <div className="relative flex items-center mr-5 w-[300px]"> {/* Fixed width container */}
  <input
    type="text"
    placeholder="Search by BMR Name"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="border p-2 h-10 rounded pl-4 pr-10 w-full focus:outline-none" // Padding for icon space
    style={{ border: '1px solid black' }}
  />
  <AiOutlineSearch className="absolute right-3 text-gray-500" size={20} /> {/* Search Icon after input */}
</div>
        {["All", "Under Initiation", "Under Reviewer", "Under Approver", "Approved"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2 text-sm font-semibold focus:outline-none transition
              ${activeTab === tab ? "text-black bg-gray-100 border-b-2 border-black" : "text-gray-500 hover:text-black hover:bg-gray-50"} 
              rounded-t-lg`}
              style={{
                borderBottom: activeTab === tab ? "2px solid blue" : "",
                backgroundColor: activeTab === tab ? "#f3f4f6" : "", // Light gray for selected tab
              }}
            >
              {tab}
            </button>
          )
        )}
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
