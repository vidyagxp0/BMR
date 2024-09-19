import React, { useState, useEffect } from "react";
import HeaderTop from "../../../../Components/Header/HeaderTop";
import Select from "react-select";
import axios from "axios";
import { Button } from "@mui/material";

const BMRRecords = ({ selectedBMR, onClose }) => {
  const [activeTab, setActiveTab] = useState("General Information");
  const [initiatorName, setInitiatorName] = useState(selectedBMR.name || "");
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

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const [reviewersResponse, approversResponse] = await Promise.all([
          axios.post(
            "https://bmrapi.mydemosoftware.com/bmr-form/get-user-roles",
            { role_id: 3 },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user-token")}`,
                "Content-Type": "application/json",
              },
            }
          ),
          axios.post(
            "https://bmrapi.mydemosoftware.com/bmr-form/get-user-roles",
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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

  return (
    <div className="w-full h-full absolute flex items-center justify-center mb-4">
      <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden">
        <HeaderTop />
        <div className="flex justify-around items-center bg-gradient-to-r bg-gray-50 mt-2 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-black font-serif">
            Initiate BMR Records
          </h2>
        </div>

        <div className="flex justify-around items-center bg-gradient-to-r from-cyan-400 to-gray-200 mt-2 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-white font-sans">
            BMR ID :{" "}
            <span className="text-gray-800"> {selectedBMR.bmr_id}</span>
          </h2>
          <h2 className="text-lg font-semibold text-white font-sans">
            BMR Name :{" "}
            <span className="text-gray-800"> {selectedBMR.name}</span>
          </h2>
          <h2 className="text-lg font-semibold text-white font-sans">
            Date of Approval :{" "}
            <span className="text-gray-800"> {formattedDate}</span>
          </h2>
          <h2 className="text-lg font-semibold text-white font-sans">
            Status :{" "}
            <span className="text-gray-800 ">{selectedBMR.status}</span>
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
                <input
                  label="Initiator Name"
                  value={initiatorName}
                  onChange={(e) => setInitiatorName(e.target.value)}
                  className="rounded-md p-2 focus:outline-none"
                />
              </div>
              <div className="p-4 border border-gray-300 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 opacity-95 shadow-lg">
                <input
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
        </div>
      </div>
    </div>
  );
};

export default BMRRecords;
