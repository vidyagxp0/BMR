/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BMRForms from "../Process/Modals/BMRForms";
import { useDispatch } from "react-redux";
import { setFormData, setSelectedBMR } from "../../../../../src/userSlice";
import {BASE_URL} from "../../../../config.json"
import { Tooltip } from "@mui/material";

const BMRRecords = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("General Information");
  const [dateOfInitiation, setDateOfInitiation] = useState(
    new Date().toISOString().split("T")[0]
  );

  const dispatch = useDispatch();
  const [selectedBMR, setSelectedBMRState] = useState(
    location.state?.selectedBMR || {}
  );

  const fieldTypes = [];
  selectedBMR.BMR_Tabs[0].BMR_sections[0].BMR_fields.forEach((field) => {
    fieldTypes.push(field.field_type);
  });
  console.log(selectedBMR, "[][]][][][][][][][][]");

  const helpText = [];
  selectedBMR.BMR_Tabs[0].BMR_sections[0].BMR_fields.forEach((field) => {
    helpText.push(field.helpText);
  });
  console.log(helpText, "><><><><><><><><><");

  const [formData, setFormDataState] = useState({
    initiatorName: null,
    dateOfInitiation: new Date().toISOString().split("T")[0],
    selectedReviewers: [],
    selectedApprovers: [],
    dynamicFields: {
      "General Information": {},
      ...selectedBMR.BMR_Tabs.reduce((acc, tab) => {
        acc[tab.tab_name] = {};
        return acc;
      }, {}),
    },
  });
  useEffect(() => {
    dispatch(setFormData(formData));
    dispatch(setSelectedBMR(selectedBMR));
  }, [dispatch, formData, selectedBMR]);
  dispatch(setFormData(formData));

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
  const bmr_id = selectedBMR.bmr_id;
  const [initiatorName, setInitiatorName] = useState(null);
  const navigate = useNavigate();

  const fetchBMRData = () => {
    axios
      .get(`${BASE_URL}/bmr-form/get-a-bmr/${bmr_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        const bmrData = response.data.message[0];
        setInitiatorName(bmrData.Initiator.name);

        setFormData((prevFormData) => ({
          ...prevFormData,
          initiatorName: bmrData.Initiator.name,
        }));
      })
      .catch(() => {
        toast.error("Error Fetching BMR");
      });
  };
  useEffect(() => {
    fetchBMRData();
  }, [bmr_id]);

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
            `${BASE_URL}/bmr-form/get-user-roles`,
            { role_id: 3 },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user-token")}`,
                "Content-Type": "application/json",
              },
            }
          ),
          axios.post(
            `${BASE_URL}/bmr-form/get-user-roles`,
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
    const updatedValues = selected.some(
      (option) => option.value === "select-all"
    )
      ? field === "reviewers"
        ? reviewers.filter((option) => option.value !== "select-all")
        : approvers.filter((option) => option.value !== "select-all")
      : selected;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [field === "reviewers" ? "selectedReviewers" : "selectedApprovers"]:
        updatedValues,
    }));
  };

  // const formattedDate = new Date(selectedBMR.date_of_initiation)
  //   .toISOString()
  //   .split("T")[0];
  const handleDynamicFieldChange = (id, value, tab) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      dynamicFields: {
        ...prevFormData.dynamicFields,
        [tab]: {
          ...prevFormData.dynamicFields[tab],
          [id]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    console.log("Saved Form Data:", formData, selectedBMR);
    dispatch({
      type: "ACTION_TYPE",
      payload: formData,
      selectedBMR,
    });
    navigate("/bmr-forms");
  };

  return (
    <div className="w-full h-full flex items-center justify-center ">
      <div className="w-full h-full bg-white shadow-lg rounded-lg  ">
        <div className="flex justify-around items-center  bg-gradient-to-r bg-gray-50 mt-3 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-black ">
            Initiate BMR Records
          </h2>
        </div>
        <div className="flex justify-start gap-20 items-center bg-gradient-to-r from-[#4f839b] to-[#0c384d] mt-2 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-white ">
            BMR Name :{" "}
            <span className="text-gray-200"> {selectedBMR.name}</span>
          </h2>

          <h2 className="text-lg font-semibold text-white ">
            Status :{" "}
            <span className="text-gray-200 ">{selectedBMR.status}</span>
          </h2>
        </div>
        <div className="flex justify-start space-x-2 px-4 pb-4 ">
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
        <div className="">
          {activeTab === "General Information" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 text-lg font-semibold text-black rounded-lg ">
              <div className="p-4 border border-gray-300 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 opacity-95 shadow-lg">
                <InputField
                  label="Initiator Name"
                  value={initiatorName}
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
                />
              </div>
              <div className="p-4 border border-gray-300 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 opacity-95 shadow-lg">
                <label className="block text-gray-700 font-bold p-2 mb-2">
                  Reviewers
                </label>
                <Select
                  isMulti
                  options={reviewers}
                  value={selectedReviewers.label}
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
                  value={selectedApprovers.label}
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
                  className="grid grid-cols-2 w-full p-2 text-lg font-semibold text-black rounded-lg "
                >
                  {tab.BMR_sections.map((section, index) => (
                    <div
                      key={index}
                      className="p-4 border mb-4 border-gray-500 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 opacity-95 "
                    >
                      <h3 className="font-semibold text-gray-600 mb-3 text-lg bg-gray-200 p-3">
                        <div className="flex items-center gap-5 ">
                          <p>Section :</p>
                          <span className="block text-black">
                            {section.section_name}
                          </span>
                        </div>
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {section.BMR_fields.map((field, idx) => (
                          <div key={idx} className="border border-gray-300 p-2">
                            <InputField
                              label={field.label || "Field Name"}
                              type={field.field_type || "text"}
                              placeholder={field.placeholder}
                              value={field.value}
                              helpText={field.helpText}
                              onChange={(e) =>
                                handleDynamicFieldChange(
                                  field.id,
                                  e.target.value,
                                  activeTab
                                )
                              }
                              className="mb-4 rounded-md p-2"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
          )}
        </div>
        <div className="flex justify-end gap-4 items-end p-4 border-t">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none transition duration-200"
            onClick={handleSave}
          >
            Save
          </button>

          <button
            className="px-4 py-2 bg-green-  600 text-white rounded hover:bg-blue-700 focus:outline-none transition duration-200"
            onClick={() => navigate("/dashboard")}
          >
            Exit
          </button>
        </div>
      </div>

      {/* {initiatorName && <BMRProcessDetails initiatorName2={initiatorName}/>} */}
    </div>
  );
};
const Button1 = ({ label, active, onClick }) => (
  <button
    className={`px-4 py-2 my-4 text-gray-100 font-semibold rounded transition duration-100 ${
      active
        ? "bg-[#195b7a] hover:bg-[#346C86] hover:text-white"
        : "bg-[#195b7a] hover:bg-[#346C86] hover:text-white"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  helpText,
}) => (
  <div>
    <label className=" text-gray-700 font-bold p-2 mb-2 flex items-center">
      {label}
      {type === "text" && <span className="text-red-600">*</span>}
      {helpText && (
        <Tooltip title={helpText} placement="right-start">
          <div className="text-gray-950 cursor-pointer ml-2">
            <span className="text-black">ⓘ</span>
          </div>
        </Tooltip>
      )}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-3 h-10 p-2 border-2 border-gray-500 rounded shadow-md focus:border-blue-500 transition duration-200"
      style={{ border: "1px solid gray" }}
    />
  </div>
);

export default BMRRecords;
