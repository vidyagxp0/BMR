import React, { useEffect, useState } from "react";
import InitiateModal from "../../../Modals/InitiateModal";
import HeaderTop from "../../../../../Components/Header/HeaderTop";
import DashboardBottom from "../../../../../Components/Header/DashboardBottom";
import axios from "axios";
import "./BMRForms.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../../config.json";
import AtmTable from "../../../../../AtmComponents/AtmTable";
import { toast } from "react-toastify";
import { formattedDate } from "../../../../../AtmComponents/Helper";
import DeleteRecordModal from "../../BMRRecords/DeleteRecordModal";
const BMRForms = () => {
  const [approvedBMR, setApprovedBMR] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bmrRecordsData, setBmrRecordsData] = useState([]);
  const [showDeleteRecord, setShowDeleteRecord] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/bmr-form/get-all-bmr`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        const approvedItems = response.data.message.filter(
          (item) => item.status === "Approved"
        );
        setApprovedBMR(approvedItems);
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

  const columns = [
    {
      header: "Record Name",
      accessor: "record_name",
      Cell: ({ row }) => {
        const record_id = row.original.record_id;
        const formattedrecordId =
          record_id < 10
            ? `${row.original.BMR?.name} 000${record_id}`
            : `${row.original.BMR?.name} 00${record_id}`;
        return (
          <>
            <span
              className="cursor-pointer hover:text-blue-500"
              onClick={() => {
                navigate(
                  `/bmr_records/bmr_records_details/${row.original.record_id}`,
                  { state: { original: row.original } }
                );
              }}
            >
              {formattedrecordId}
            </span>
          </>
        );
      },
    },
    {
      header: "BMR Name",
      accessor: "name",
      Cell: ({ row }) => {
        return <>{row?.original?.BMR?.name}</>;
      },
    },

    {
      header: "Initiator Name",
      accessor: "initiator_name",
      Cell: ({ row }) => {
        return <>{row?.original?.InitiatorUser?.name}</>;
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
    {
      header: "Status",
      accessor: "status",
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
                setSelectedRecord(user);
                setShowDeleteRecord(true);
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

  const [filter, setFilter] = useState("");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const fetchBMRData = () => {
    axios
      .get(`${BASE_URL}/bmr-record/get-all-bmr-records`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.message.sort(
          (a, b) =>
            new Date(b.date_of_initiation) - new Date(a.date_of_initiation)
        );
        setBmrRecordsData(sortedData);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error Fetching BMR");
      });
  };

  useEffect(() => {
    fetchBMRData();
  }, []);

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
              {/* <label className="text-gray-700 font-bold">BMR</label>*/}
              <div className="w-full">
                <select
                  id="options"
                  name="options"
                  className="custom-select w-full shadow-md rounded-md text-gray-700 bg-white transition duration-300 ease-in-out hover:border-[#346C86] cursor-pointer"
                  value={filter}
                  onChange={handleFilterChange}
                >
                  <option value="" className="text-gray-600">
                    All Records
                  </option>
                  {approvedBMR.map((item, index) => (
                    <option
                      key={index}
                      value={item.name}
                      className="text-gray-700"
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn bg-[#2a323e] text-white font-semibold py-2 px-5  rounded-md hover:bg-[#123e53] transition-all"
                onClick={openModal}
              >
                Initiate
              </button>
            </div>
          </div>

          {showModal && (
            <InitiateModal approvedBMR={approvedBMR} onClose={closeModal} />
          )}

          <AtmTable columns={columns} data={bmrRecordsData} />
          {showDeleteRecord && (
        <DeleteRecordModal
          user={selectedRecord}                                                             
          onClose={() => setShowDeleteRecord(false)}
          id={selectedRecord?.record_id}
          setData = {setBmrRecordsData}
        />
      )}
        </div>
      </main>
    </div>
  );
};

export default BMRForms;
