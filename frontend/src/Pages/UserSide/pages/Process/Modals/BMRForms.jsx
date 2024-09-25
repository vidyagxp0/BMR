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

const BMRForms = () => {
  const [approvedBMR, setApprovedBMR] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bmrRecordsData, setBmrRecordsData] = useState([]);
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
            ? `${row.original.BMR.name} 000${record_id}`
            : `${row.original.BMR.name} 00${record_id}`;
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
        return <>{row.original.BMR.name}</>;
      },
    },

    {
      header: "Initiator Name",
      accessor: "initiator_name",
      Cell: ({ row }) => {
        return <>{row.original.InitiatorUser.name}</>;
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

          <AtmTable columns={columns} data={bmrRecordsData} />
        </div>
      </main>
    </div>
  );
};

export default BMRForms;
