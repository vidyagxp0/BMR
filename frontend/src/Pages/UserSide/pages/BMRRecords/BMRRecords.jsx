import React, { useState } from "react";
import HeaderTop from "../../../../Components/Header/HeaderTop";

const BMRRecords = ({ approvedBMR, onClose }) => {
  const [activeTab, setActiveTab] = useState("General Information");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full h-full absolute flex items-center justify-center">
      <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden">
        <HeaderTop />

        <div className="flex justify-center items-center bg-blue-400 p-4">
          <h2 className="text-2xl font-bold text-white font-serif">
            Initiate BMR Records
          </h2>
        </div>
        <div className="flex justify-center items-center bg-gray-200 mt-2 p-4">
          <h2 className="text-2xl font-bold text-gray-700 font-serif">
            BMR Name ={" "}
          </h2>
        </div>

        <div className="flex justify-start space-x-2 px-4 pb-4">
          {[
            "General Information",
            "Details",
            "Initiator Remarks",
            "Reviewer Remarks",
            "Approver Remarks",
          ].map((tab) => (
            <Button
              key={tab}
              label={tab}
              active={activeTab === tab}
              onClick={() => handleTabClick(tab)}
            />
          ))}
        </div>

        <div className="p-6">
          {activeTab === "General Information" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10" >
              <InputField label="Initiator Name" />
              <InputField label="Date of Initiation" type="date" />
              <div className="relative">
                <InputField label="Initiator Comments" type="text" />
              </div>
            </div>
          )}

          {activeTab === "Details" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <InputField label="Detail 1" />
              <InputField label="Detail 2" />
              <InputField label="Detail 3" />
            </div>
          )}

          {activeTab === "Initiator Remarks" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <InputField label="Remark 1" />
              <InputField label="Remark 2" />
              <InputField label="Remark 3" />
            </div>
          )}

          {activeTab === "Reviewer Remarks" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <InputField label="Review 1" />
              <InputField label="Review 2" />
              <InputField label="Review 3" />
            </div>
          )}

          {activeTab === "Approver Remarks" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <InputField label="Approval 1" />
              <InputField label="Approval 2" />
              <InputField label="Approval 3" />
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none transition duration-200"
            onClick={onClose}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

const Button = ({ label, active, onClick }) => (
  <button
    className={`px-4 py-2 my-4 text-gray-700 font-serif font-bold rounded-3xl transition duration-100 ${
      active
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-blue-300 hover:bg-blue-600 hover:text-white"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const InputField = ({ label, type = "text", placeholder }) => (
  <div>
    <label className="block text-gray-700 font-bold p-2 mb-2" style={{border:"1px solid lightgray"}}>
      {label}
      {type === "text" && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-3 h-10 p-2 border border-gray-400 rounded shadow-md  focus:border-blue-500 transition duration-200"
    />
  </div>
);

export default BMRRecords;
