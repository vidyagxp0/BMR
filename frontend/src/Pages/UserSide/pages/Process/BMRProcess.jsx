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
import "react-toastify/dist/ReactToastify.css";
const BMRProcess = () => {
  const [data, setData] = useState([]);
  // console.log(data , "data")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const columns = [
    {
      header: "BMR Name",
      accessor: "name",
      Cell: ({ row }) => {
        return (
          <span
            onClick={() => {
              navigate(`/process/processdetails/${row.original.bmr_id}`);
            }}
            className="cursor-pointer hover:text-blue-500"
          >
            {row.original.name}
          </span>
        );
      },
    },
    { header: "Status", accessor: "status" },
    {
      header: "Date Of Initiation",
      accessor: "date_of_initiation",
      Cell: ({ row }) => formattedDate(row.original.date_of_initiation),
    },
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
              className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
            >
              Edit
            </button>

            <button
              onClick={() => {
                setSelectedUser(user);
                setShowDeleteUser(true);
              }}
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
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
      .get("http://192.168.1.3:7000/bmr-form/get-all-bmr", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        setData(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error Fetching BMR");
      });
  };

  useEffect(() => {
    fetchBMRData();
  }, []);

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
      ...prevData,
      {
        name,
        status,
        date_of_initiation: formattedDate(date_of_initiation),
        reviewers: reviewerNames,
        approvers: approverNames,
        bmr_tab_id,
      },
    ]);
    setIsModalOpen(false);
    fetchBMRData();
  };

  return (
    <div>
      <ToastContainer />
      <HeaderBottom openModal={() => setIsModalOpen(true)} />
      <AtmTable columns={columns} data={data} />
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
