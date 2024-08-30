import React, { useState, useEffect } from "react";
import HeaderTop from "../../../../Components/Header/HeaderTop";

const BMRRecords = ({ selectedBMR, onClose }) => {
  const [activeTab, setActiveTab] = useState("General Information");
  const [initiatorName, setInitiatorName] = useState(selectedBMR.name || "");
  const [initiatorComment, setInitiatorComment] = useState(selectedBMR.initiatorComment || "");
  const [dateOfInitiation, setDateOfInitiation] = useState(selectedBMR.date_of_initiation || "");

  // State to hold dynamic field values for each tab
  const [dynamicFields, setDynamicFields] = useState({
    "General Information": {},
    ...selectedBMR.BMR_Tabs.reduce((acc, tab) => {
      acc[tab.tab_name] = {};
      return acc;
    }, {}),
  });

  useEffect(() => {
    // Initialize dynamic fields state based on selectedBMR.BMR_Tabs
    const initialFields = {};
    selectedBMR.BMR_Tabs.forEach(tab => {
      tab.BMR_sections.forEach(section => {
        section.BMR_fields.forEach(field => {
          initialFields[field.id] = field.value || ""; // Assuming each field has a unique 'id'
        });
      });
    });
    setDynamicFields((prevFields) => ({
      ...prevFields,
      "General Information": initialFields,
    }));
  }, [selectedBMR]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const formattedDate = new Date(dateOfInitiation).toISOString().split("T")[0]; // Format date for input

  // Handler for dynamic field changes
  const handleDynamicFieldChange = (id, value, tab) => {
    setDynamicFields((prevFields) => ({
      ...prevFields,
      [tab]: {
        ...prevFields[tab],
        [id]: value,
      },
    }));
  };

  return (
    <div className="w-full h-full absolute flex items-center justify-center mb-4">
      <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden ">
        <HeaderTop />
        <div className="flex justify-around items-center bg-gradient-to-r bg-gray-50 mt-2 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-black font-serif">Initiate BMR Records</h2>
        </div>

        <div className="flex justify-around items-center bg-gradient-to-r from-cyan-400 to-gray-200 mt-2 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-white font-sans">
            BMR ID : <span className="text-gray-800"> {selectedBMR.bmr_id}</span>
          </h2>
          <h2 className="text-lg font-semibold text-white font-sans">
            BMR Name : <span className="text-gray-800"> {selectedBMR.name}</span>
          </h2>
          <h2 className="text-lg font-semibold text-white font-sans">
            Date of Initiation : <span className="text-gray-800"> {formattedDate}</span>
          </h2>
          <h2 className="text-lg font-semibold text-white font-sans">
            Status : <span className="text-gray-800 ">{selectedBMR.status}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 text-lg font-semibold text-black rounded-lg shadow-lg">
              <div className="p-4 border border-gray-300 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 opacity-95 shadow-lg">
                <InputField
                  label="Initiator Name"
                  value={selectedBMR.name}
                  // onChange={(e) => setInitiatorName(e.target.value)}
                  className="rounded-md p-2 focus:outline-none"
                />
              </div>
              <div className="p-4 border border-gray-300 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 opacity-95 shadow-lg">
                <InputField
                  label="Date of Initiation"
                  type="date"
                  value={formattedDate}
                  onChange={(e) => setDateOfInitiation(e.target.value)}
                  className="rounded-md p-2 focus:outline-none"
                />
              </div>
              <div className="p-4 border border-gray-300 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 opacity-95 shadow-lg">
                <InputField
                  label="Initiator Comments"
                  value={initiatorComment}
                  onChange={(e) => setInitiatorComment(e.target.value)}
                  className="rounded-md p-2 focus:outline-none"
                />
              </div>
            </div>
          )}

          {selectedBMR.BMR_Tabs.map(
            (tab) =>
              activeTab === tab.tab_name && (
                <div
                  key={tab.tab_name}
                  className="grid grid-cols-1 md:grid-cols-3 gap-10 p-6 text-lg font-semibold text-black rounded-lg shadow-lg"
                >
                  {tab.BMR_sections.map((section, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 opacity-95 shadow-lg "
                    >
                      <h3 className="font-semibold text-gray-600 mb-3 text-lg">
                        <div className="flex items-center gap-5 ">
                          <p>Section :</p>
                          <span className="block text-black">
                            {section.section_name}
                          </span>
                        </div>
                      </h3>
                      {section.BMR_fields.map((field, idx) => (
                        <InputField
                          key={idx}
                          label={field.label || "Field Name"}
                          type={field.type || "text"}
                          value={dynamicFields[activeTab][field.id] || ""} // Bind to dynamic field state based on active tab
                          placeholder={field.placeholder}
                          onChange={(e) => handleDynamicFieldChange(field.id, e.target.value, activeTab)} // Update dynamic field value based on active tab
                          className="mb-4 rounded-md p-2"
                        />
                      ))}
                    </div>
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
            Save
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

const InputField = ({ label, type = "text", placeholder, value, onChange }) => (
  <div>
    <label className="block text-gray-700 font-bold p-2 mb-2">
      {label}
      {type === "text" && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-3 h-10 p-2 border border-gray-500 rounded shadow-md focus:border-blue-500 transition duration-200"
    />
  </div>
);

export default BMRRecords;