import React, { useEffect, useState } from "react";
import AtmButton from "../../../AtmComponents/AtmButton";
import { useNavigate } from "react-router-dom";
import AtmTable from "../../../AtmComponents/AtmTable";
import DeleteUserModal from "../Modals/DeleteUserModal";
import axios from "axios";

export default function PrintControl() {
  const navigate = useNavigate();

  // State to control the table visibility
  const [selectedOption, setSelectedOption] = useState("rolewise");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteUser, setShowDeleteUser] = useState(false);

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    const getUserPrints = async () => {
      // const response = await axios.get(`bmr-form/get-user-prints`);
      // setuserPrints([...userPrints, response.data]);
      // setrolePrints([...rolePrints, ...response.data]);
    };
    getUserPrints();
  }, []);

  const rolewiseColumns = [
    { header: "Role Name", accessor: "role" },
    { header: "Prints Allowed Per Day", accessor: "tpcd" },
    { header: "Prints Allowed Per Week", accessor: "tpcw" },
    { header: "Prints Allowed Per Month", accessor: "tpcm" },
    { header: "Prints Allowed Per Year", accessor: "tpcy" },
    {
      header: "Action",
      accessor: "action",
      Cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-evenly space-x-2a">
            <button
              onClick={() => navigate(`/view-print-control/${user.id}`)}
              className="bg-gradient-to-r from-teal-500 to-teal-700 text-white px-4 py-2 rounded-full shadow-lg hover:from-teal-600 hover:to-teal-800 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              View
            </button>

            <button
              onClick={() => navigate(`/view-print-control/${user.id}`)}
              className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-4 py-2 rounded-full shadow-lg hover:from-indigo-600 hover:to-indigo-800 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Edit
            </button>

            <button
              onClick={() => {
                setSelectedUser(user);
                setShowDeleteUser(true);
              }}
              className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-full shadow-lg hover:from-red-600 hover:to-red-800 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  const [rolePrints, setrolePrints] = useState([
    { id: 1, name: "Admin", role: "Admin", tpcd: 100, tpcw: 500, tpcm: 2000, tpcy: 12000 },
    { id: 2, name: "Approver", role: "Approver", tpcd: 50, tpcw: 250, tpcm: 1000, tpcy: 6000 },
    { id: 3, name: "Reviewer", role: "Reviewer", tpcd: 20, tpcw: 100, tpcm: 400, tpcy: 2400 },
    { id: 4, name: "HOD", role: "HOD", tpcd: 30, tpcw: 150, tpcm: 600, tpcy: 3600 },
    { id: 5, name: "Initiator", role: "Initiator", tpcd: 80, tpcw: 400, tpcm: 1600, tpcy: 9600 },
  ]);

  const userwiseColumns = [
    { header: "User Name", accessor: "name" },
    { header: "Role", accessor: "role" },
    { header: "Prints Allowed Per Day", accessor: "tpcd" },
    { header: "Prints Allowed Per Week", accessor: "tpcw" },
    { header: "Prints Allowed Per Month", accessor: "tpcm" },
    { header: "Prints Allowed Per Year", accessor: "tpcy" },
    {
      header: "Action",
      accessor: "action",
      Cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-evenly space-x-2a">
            <button
              onClick={() =>
                navigate(`/view-print-control/${user.id}`, { state: { role: user.role } })
              }
              className="bg-gradient-to-r from-teal-500 to-teal-700 text-white px-4 py-2 rounded-full shadow-lg hover:from-teal-600 hover:to-teal-800 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              View
            </button>

            <button
              onClick={() =>
                navigate(`/view-print-control/${user.id}`, { state: { role: user.role } })
              }
              className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-4 py-2 rounded-full shadow-lg hover:from-indigo-600 hover:to-indigo-800 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Edit
            </button>

            <button
              onClick={() => {
                setSelectedUser(user);
                setShowDeleteUser(true);
              }}
              className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-full shadow-lg hover:from-red-600 hover:to-red-800 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];
  const [userPrints, setuserPrints] = useState([
    { id: 1, name: "Mayank Rathore", role: "Admin", tpcd: 100, tpcw: 500, tpcm: 2000, tpcy: 12000 },
    { id: 2, name: "Gaurav Meena", role: "Approver", tpcd: 50, tpcw: 250, tpcm: 1000, tpcy: 6000 },
    { id: 3, name: "Farhan Khan", role: "Reviewer", tpcd: 20, tpcw: 100, tpcm: 400, tpcy: 2400 },
    { id: 4, name: "Pankaj Jat", role: "HOD", tpcd: 30, tpcw: 150, tpcm: 600, tpcy: 3600 },
    {
      id: 5,
      name: "Anshul Thakur",
      role: "Initiator",
      tpcd: 80,
      tpcw: 400,
      tpcm: 1600,
      tpcy: 9600,
    },
  ]);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="Header_Bottom shadow-xl my-3 py-5 bg-white rounded-lg">
        <div className="headerBottomInner flex items-center justify-between px-4">
          <div className="headerBottomLft">
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

      {/* Dropdown to select table type */}
      <div className="mt-5 mb-3 text-center">
        <div className="bg-white px-4 py-3 rounded-md shadow-sm inline-block border-2 border-[#3498db]">
          <select
            value={selectedOption}
            onChange={handleDropdownChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:border-[#3498db] transition duration-200"
          >
            <option value="rolewise" className="text-gray-700">
              Rolewise Available Prints
            </option>
            <option value="userwise" className="text-gray-700">
              Userwise Available Prints
            </option>
          </select>
        </div>
      </div>

      {/* Conditionally render tables based on selected option */}
      {selectedOption === "rolewise" && (
        <div className="mt-5 mb-3 text-center">
          <h5 className="text-2xl font-semibold text-[#77528c]">Rolewise Available Prints</h5>
          <p className="text-lg text-[#989797] mt-2">Available prints for each role</p>
          <div className="w-full h-1 bg-[#ae8dc2] my-4"></div>
          <AtmTable columns={rolewiseColumns} data={rolePrints} />
        </div>
      )}

      {selectedOption === "userwise" && (
        <div className="mt-5 mb-3 text-center">
          <h2 className="text-2xl font-semibold text-[#77528c]">Userwise Available Prints</h2>
          <p className="text-lg text-[#989797] mt-2">Available prints for each user</p>
          <div className="w-full h-1 bg-[#ae8dc2] my-4"></div>
          <AtmTable columns={userwiseColumns} data={userPrints} />
        </div>
      )}

      {showDeleteUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => setShowDeleteUser(false)}
          id={selectedUser?.user_id}
          setAllUsers={"setAllUsers"}
          warningHeading="Delete Print Control"
          warningContent="Are you sure you want to delete this print control?"
        />
      )}
    </div>
  );
}
