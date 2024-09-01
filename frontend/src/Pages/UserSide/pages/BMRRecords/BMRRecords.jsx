/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import HeaderTop from "../../../../Components/Header/HeaderTop";
import Select from "react-select";
import { Button } from "@mui/material";
import axios from "axios";

const BMRRecords = ({ selectedBMR, onClose }) => {
  const [activeTab, setActiveTab] = useState("General Information");
  const [initiatorName, setInitiatorName] = useState(selectedBMR.name || "");
  const [initiatorComment, setInitiatorComment] = useState(
    selectedBMR.initiatorComment || ""
  );
  const [dateOfInitiation, setDateOfInitiation] = useState(
    selectedBMR.date_of_initiation || ""
  );
  const [dynamicFields, setDynamicFields] = useState({
    "General Information": {},
    ...selectedBMR.BMR_Tabs.reduce((acc, tab) => {
      acc[tab.tab_name] = {};
      return acc;
    }, {}),
  });

  console.log(
    initiatorName,
    initiatorComment,
    dateOfInitiation,
    dynamicFields,
    "Completed Storing Data here Successfully!!"
  );

  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [selectedApprovers, setSelectedApprovers] = useState([]);

  useEffect(() => {
    const initialFields = {};
    selectedBMR.BMR_Tabs.forEach((tab) => {
      tab.BMR_sections.forEach((section) => {
        section.BMR_fields.forEach((field) => {
          initialFields[field.id] = field.value || "";
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

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const [reviewersResponse, approversResponse] = await Promise.all([
          axios.post(
            "http://195.35.6.197:7000/bmr-form/get-user-roles",
            { role_id: 3 },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user-token")}`,
                "Content-Type": "application/json",
              },
            }
          ),
          axios.post(
            "http://195.35.6.197:7000/bmr-form/get-user-roles",
            { role_id: 4 },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user-token")}`,
                "Content-Type": "application/json",
              },
            }
          ),
        ]);

        const reviewerOptions = [
          { value: "select-all", label: "Select All" },
          ...new Map(
            reviewersResponse.data.message.map((role) => [
              role.user_id,
              {
                value: role.user_id,
                label: `${role.User.name}`,
              },
            ])
          ).values(),
        ];
        setReviewers(reviewerOptions);

        const approverOptions = [
          { value: "select-all", label: "Select All" },
          ...new Map(
            approversResponse.data.message.map((role) => [
              role.user_id,
              {
                value: role.user_id,
                label: `${role.User.name}`,
              },
            ])
          ).values(),
        ];
        setApprovers(approverOptions);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchUserRoles();
  }, []);

  const handleSelectChange = (selected, field) => {
    if (selected.some((option) => option.value === "select-all")) {
      const allOptions = field === "reviewers" ? reviewers : approvers;
      const nonSelectAllOptions = allOptions.filter(
        (option) => option.value !== "select-all"
      );
      field === "reviewers"
        ? setSelectedReviewers(nonSelectAllOptions)
        : setSelectedApprovers(nonSelectAllOptions);
    } else {
      field === "reviewers"
        ? setSelectedReviewers(selected)
        : setSelectedApprovers(selected);
    }
  };

  const formattedDate = new Date(dateOfInitiation).toISOString().split("T")[0];

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
          <h2 className="text-2xl font-bold text-black ">
            Initiate BMR Records
          </h2>
        </div>

        <div className="flex justify-around items-center bg-gradient-to-r from-cyan-400 to-gray-200 mt-2 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-white ">
            BMR ID :{" "}
            <span className="text-gray-800"> {selectedBMR.bmr_id}</span>
          </h2>
          <h2 className="text-lg font-semibold text-white ">
            BMR Name :{" "}
            <span className="text-gray-800"> {selectedBMR.name}</span>
          </h2>
          <h2 className="text-lg font-semibold text-white ">
            Date of Approval :{" "}
            <span className="text-gray-800"> {formattedDate}</span>
          </h2>
          <h2 className="text-lg font-semibold text-white ">
            Status :{" "}
            <span className="text-gray-800 ">{selectedBMR.status}</span>
          </h2>
        </div>

        <div className="flex justify-start space-x-2 px-4 pb-4">
          {[
            "General Information",
            ...selectedBMR.BMR_Tabs.map((tab) => tab.tab_name),
          ].map((tab) => (
            <Button1
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
                  value={selectedBMR.initiator}
                  onChange={(e) => setInitiatorName(e.target.value)}
                  className="rounded-md p-2 focus:outline-none"
                />
              </div>
              <div className="p-4 border border-gray-300 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 opacity-95 shadow-lg">
                <InputField
                  label="Date of Initiation"
                  type="date"
                  value={dateOfInitiation}
                  onChange={(e) => setDateOfInitiation(e.target.value)}
                  className="rounded-md p-2 focus:outline-none"
                />
              </div>
              <div className="p-4 border border-gray-300 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 opacity-95 shadow-lg">
                <label className="block text-gray-700 font-bold p-2 mb-2">
                  Reviewers
                </label>
                <Select
                  isMulti
                  options={reviewers}
                  value={selectedReviewers}
                  onChange={(selected) =>
                    handleSelectChange(selected, "reviewers")
                  }
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderColor: "#d0d0d0",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#a0a0a0",
                      },
                    }),
                  }}
                />
              </div>
              <div className="p-4 border border-gray-300 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 opacity-95 shadow-lg">
                <label className="block text-gray-700 font-bold p-2 mb-2">
                  Approvers
                </label>
                <Select
                  isMulti
                  options={approvers}
                  value={selectedApprovers}
                  onChange={(selected) =>
                    handleSelectChange(selected, "approvers")
                  }
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderColor: "#d0d0d0",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#a0a0a0",
                      },
                    }),
                  }}
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
                          onChange={(e) =>
                            handleDynamicFieldChange(
                              field.id,
                              e.target.value,
                              activeTab
                            )
                          } // Update dynamic field value based on active tab
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

const Button1 = ({ label, active, onClick }) => (
  <button
    className={`px-4 py-2 my-4 text-gray-600 font-semibold rounded-3xl transition duration-100 ${
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
