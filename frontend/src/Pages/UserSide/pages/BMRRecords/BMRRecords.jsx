import React, { useState } from "react";
import HeaderTop from "../../../../Components/Header/HeaderTop";

const BMRRecords = ({ selectedBMR, onClose }) => {
  const [activeTab, setActiveTab] = useState("General Information");
  console.log(activeTab, "activeTab");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const date = new Date(selectedBMR.date_of_initiation);
  const formattedDate =
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2);

  return (
    <div className="w-full h-full absolute flex items-center justify-center">
      <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden">
        <HeaderTop />
        <div className="flex justify-around items-center bg-gradient-to-r from-cyan-300 to-blue-400 mt-2 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-black font-serif">
            Initiate BMR Records
          </h2>
        </div>

        <div className="flex justify-around items-center bg-gradient-to-r from-blue-400 to-cyan-500 mt-2 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-white font-sans">
            BMR ID :{" "}
            <span className="text-gray-800"> {selectedBMR.bmr_id}</span>
          </h2>
          <h2 className="text-lg font-semibold text-white font-sans">
            BMR Name :{" "}
            <span className="text-gray-800"> {selectedBMR.name}</span>
          </h2>
          <h2 className="text-lg font-semibold text-white font-sans">
            Date of Initiation :{" "}
            <span className="text-gray-800"> {formattedDate}</span>
          </h2>
          <h2 className="text-lg font-semibold text-white font-sans">
            Status : <span className="text-gray-800">{selectedBMR.status}</span>
          </h2>
        </div>

        <div className="flex justify-start space-x-2 px-4 pb-4">
          {[
            "General Information",
            ...selectedBMR.BMR_Tabs.map((tab) => tab.tab_name),
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <InputField label="Initiator Name" value={selectedBMR.name} />
              <InputField
                label="Date of Initiation"
                type="date"
                value={formattedDate}
              />
              <div className="relative">
                <InputField
                  label="Initiator Comments"  
                  value={selectedBMR.initiatorComment || ""}
                />
              </div>
            </div>
          )}

          {selectedBMR.BMR_Tabs.map(
            (tab) =>
              activeTab === tab.tab_name && (
                <div
                  key={tab.tab_name}
                  className="grid grid-cols-1 md:grid-cols-3 gap-10"
                >
                  {tab.BMR_sections.map((section, index) => (
                    <InputField
                      key={index}
                      label={section.label}
                      type={section.type || "text"}
                      value={section.value || ""}
                      placeholder={section.placeholder}
                    />
                  ))}
                </div>
              )
          )}
        </div>

        <div className="flex justify-end gap-4 items-end p-4 border-t">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none transition duration-200"
            onClick={onClose}
          >
            Submit
          </button>
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
    className={`px-4 py-2 my-4 text-gray-600 font-serif font-bold rounded-3xl transition duration-100 ${
      active
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-blue-200 hover:bg-blue-600 hover:text-white"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const InputField = ({ label, type = "text", placeholder, value }) => (
  <div>
    <label
      className="block text-gray-700 font-bold p-2 mb-2"
      style={{ border: "1px solid lightgray" }}
    >
      {label}
      {type === "text" && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      className="w-full px-3 h-10 p-2 border border-gray-400 rounded shadow-md  focus:border-blue-500 transition duration-200"
    />
  </div>
);

export default BMRRecords;
