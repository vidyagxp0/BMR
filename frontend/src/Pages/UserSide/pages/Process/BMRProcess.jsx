import React, { useState } from "react";
import HeaderBottom from "../../../../Components/Header/HeaderBottom";
import AtmTable from "../../../../AtmComponents/AtmTable";
import CreateRecordModal from "../../Modals/CreateRecordModal/CreateRecordModal";
const BMRProcess = () => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const columns = [
      { header: "Name", accessor: "name" },
      { header: "Email", accessor: "email" },
      { header: "Actions", accessor: "actions"},
    ];
  
    const handleAddBMR = (bmrName) => {
      setData((prevData) => [
        ...prevData,
        { name: bmrName, email: "example@example.com", actions: "Edit/Delete" }
      ]);
      setIsModalOpen(false);
    };
  return (
    <div>
      <HeaderBottom openModal={() => setIsModalOpen(true)}/>
      <AtmTable columns={columns} data={data} />
      {isModalOpen && <CreateRecordModal closeModal={() => setIsModalOpen(false)} addBMR={handleAddBMR} />}
    </div>
  );
};

export default BMRProcess;
