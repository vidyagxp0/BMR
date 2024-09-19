import React, { useState } from "react";
import AtmButton from "../../../AtmComponents/AtmButton";
import { useNavigate } from "react-router-dom";
import AtmTable from "../../../AtmComponents/AtmTable";

export default function PrintControl() {
  const navigate = useNavigate();
  const rolewiseColumns = [
    { header: "Role Name", accessor: "role" },
    { header: "Total Prints Allowed", accessor: "tpc" },
    { header: "Prints Taken", accessor: "taken" },
    { header: "Available Prints", accessor: "availablePrints" },
  ];
  const [rolePrints, setrolePrints] = useState([
    { name: "Mayank Rathore", role: "Admin", tpc: 100, taken: 50, availablePrints: 50 },
    { name: "Gaurav Meena", role: "Approver", tpc: 50, taken: 20, availablePrints: 30 },
    { name: "Farhan Khan", role: "Reviewer", tpc: 20, taken: 5, availablePrints: 15 },
    { name: "Pankaj Jat", role: "HOD", tpc: 30, taken: 10, availablePrints: 20 },
    { name: "Anshul Thakur", role: "Initiator", tpc: 80, taken: 40, availablePrints: 40 },
  ]);
  const userwiseColumns = [
    { header: "User Name", accessor: "name" },
    { header: "Role", accessor: "role" },
    { header: "Total Prints Allowed", accessor: "tpc" },
    { header: "Prints Taken", accessor: "taken" },
    { header: "Available Prints", accessor: "availablePrints" },
  ];
  const [userPrints, setuserPrints] = useState([
    { name: "Mayank Rathore", role: "Admin", tpc: 100, taken: 50, availablePrints: 50 },
    { name: "Gaurav Meena", role: "Approver", tpc: 50, taken: 20, availablePrints: 30 },
    { name: "Farhan Khan", role: "Reviewer", tpc: 20, taken: 5, availablePrints: 15 },
    { name: "Pankaj Jat", role: "HOD", tpc: 30, taken: 10, availablePrints: 20 },
    { name: "Anshul Thakur", role: "Initiator", tpc: 80, taken: 40, availablePrints: 40 },
    { name: "Mayank Rathore", role: "Admin", tpc: 100, taken: 50, availablePrints: 50 },
    { name: "Gaurav Meena", role: "Approver", tpc: 50, taken: 20, availablePrints: 30 },
    { name: "Farhan Khan", role: "Reviewer", tpc: 20, taken: 5, availablePrints: 15 },
    { name: "Pankaj Jat", role: "HOD", tpc: 30, taken: 10, availablePrints: 20 },
    { name: "Anshul Thakur", role: "Initiator", tpc: 80, taken: 40, availablePrints: 40 },
    { name: "Mayank Rathore", role: "Admin", tpc: 100, taken: 50, availablePrints: 50 },
    { name: "Gaurav Meena", role: "Approver", tpc: 50, taken: 20, availablePrints: 30 },
    { name: "Farhan Khan", role: "Reviewer", tpc: 20, taken: 5, availablePrints: 15 },
    { name: "Pankaj Jat", role: "HOD", tpc: 30, taken: 10, availablePrints: 20 },
    { name: "Anshul Thakur", role: "Initiator", tpc: 80, taken: 40, availablePrints: 40 },
  ]);

  return (
    <div>
      <div className="Header_Bottom shadow-xl my-3 py-5">
        <div className="headerBottomInner flex items-center">
          <div className="headerBottomLft mr-auto">
            <div className="navItem flex items-center">
              <i className="ri-home-3-fill mr-2 text-2xl text-[#EFA035]"></i>
              <h3 className="m-0 text-[#333] text-2xl font-semibold">Print Control</h3>
            </div>
          </div>
          <div className="headerBottomRgt" onClick={() => navigate("/add-print-control")}>
            <AtmButton label="Set Print Control" />
          </div>
        </div>
      </div>

      <div className="mt-5 mb-3 text-center">
        <h5 className="text-2xl font-semibold text-[#77528c]">Rolewise Available Prints</h5>
        <p className="text-lg text-[#989797] mt-2">Available prints for each role</p>
        <div className="w-full h-1 bg-[#ae8dc2] my-4"></div>
      </div>
      <AtmTable columns={rolewiseColumns} data={rolePrints} />

      <div className="mt-5 mb-3 text-center">
        {/* <h2 className="text-3xl font-semibold text-[#de8181]">Userwise Available Prints</h2> */}
        <h2 className="text-2xl font-semibold text-[#77528c]">Userwise Available Prints</h2>
        <p className="text-lg text-[#989797] mt-2">Available prints for each user</p>
        <div className="w-full h-1 bg-[#ae8dc2] my-4"></div>
      </div>
      <AtmTable columns={userwiseColumns} data={userPrints} />
    </div>
  );
}
