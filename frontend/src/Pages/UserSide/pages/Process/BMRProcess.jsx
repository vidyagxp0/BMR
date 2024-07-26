import React, { useEffect, useState } from "react";
import HeaderBottom from "../../../../Components/Header/HeaderBottom";
import AtmTable from "../../../../AtmComponents/AtmTable";
import CreateRecordModal from "../../Modals/CreateRecordModal/CreateRecordModal";
import axios from "axios";
import { toast } from "react-toastify";
const BMRProcess = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(data, "data");

  const columns = [
    { header: "BMR Name", accessor: "name" },
    { header: "Status", accessor: "status" },
    { header: "Date Of Initiation", accessor: "date_of_initiation" },
    { header: "Actions", accessor: "actions" },
  ];

  const handleAddBMR = (
    name,
    reviewers,
    approvers,
    status,
    date_of_initiation,
  ) => {
    const reviewerNames = reviewers.map((rev) => rev.label).join(", ");
    const approverNames = approvers.map((app) => app.label).join(", ");

    setData((prevData) => [
      ...prevData,
      {
        name,
        status,
        date_of_initiation,
        reviewers: reviewerNames,
        approvers: approverNames,
        actions: "Edit/Delete",
      },
    ]);
    setIsModalOpen(false);
  };

  useEffect(()=>{
    axios.get("http://192.168.1.20:7000/bmr/get-all-bmr", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
      },
    }).then((response) => {
      setData(response.data.message)
      console.log(response.data.message, "response")
    }).catch((error)=>{
      console.log(error)
      toast.error("Error Fetching BMR")
    })
  },[])


  return (
    <div>
      <HeaderBottom openModal={() => setIsModalOpen(true)} />
      <AtmTable columns={columns} data={data} />
      {isModalOpen && (
        <CreateRecordModal
          onClose={() => setIsModalOpen(false)}
          addBMR={handleAddBMR}
        />
      )}
    </div>
  );
};

export default BMRProcess;
