/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setFormData, setSelectedBMR } from "../../../../../src/userSlice";
import { BASE_URL } from "../../../../config.json";
import { Tooltip } from "@mui/material";
import UserVerificationPopUp from "../../../../Components/UserVerificationPopUp/UserVerificationPopUp";
import { addTab } from "../../../../bmrTabsSlice";
import { IoIosAddCircle, IoIosTrash } from "react-icons/io";

const BMRRecords = () => {
  const location = useLocation();
  const [selectedBMR, setSelectedBMRState] = useState(
    location.state?.selectedBMR || []
  );

  console.log(selectedBMR);
  
  const [activeTab, setActiveTab] = useState("General Information");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [dateOfInitiation, setDateOfInitiation] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [recordData, setRecordData] = useState({
    bmr_id: "",
    reviewers: [],
    approvers: [],
    data: [],
  });

  const handleChange = (e) => {
    setRecordData({
      ...recordData,
      [e.target.name]: e.target.value,
    });
  };

  const closeUserVerifiedModal = () => {
    setShowVerificationModal(false);
  };
  const dispatch = useDispatch();


  // Initialize empty arrays for fieldTypes and helpText
  const fieldTypes = [];
  const helpText = [];

  // Check if selectedBMR, BMR_Tabs, and BMR_sections exist before iterating
  if (selectedBMR?.BMR_Tabs?.length > 0) {
    const firstTab = selectedBMR.BMR_Tabs[0];

    if (firstTab?.BMR_sections?.length > 0) {
      const firstSection = firstTab.BMR_sections[0];

      if (firstSection?.BMR_fields?.length > 0) {
        firstSection.BMR_fields.forEach((field) => {
          fieldTypes.push(field.field_type);
          helpText.push(field.helpText);
        });
      } else {
        console.log("No fields are present in the first section.");
      }
    } else {
      console.log("No sections are present in the first tab.");
    }
  } else {
    console.log("Tabs are not present here.");
  }

  // Initialize formData with safety checks around BMR_Tabs
  const [formData, setFormDataState] = useState({
    initiatorName: null,
    dateOfInitiation: new Date().toISOString().split("T")[0],
    selectedReviewers: [],
    selectedApprovers: [],
    dynamicFields: {
      "General Information": {},
      ...(selectedBMR?.BMR_Tabs?.length > 0
        ? selectedBMR.BMR_Tabs.reduce((acc, tab) => {
            acc[tab.tab_name] = {};
            return acc;
          }, {})
        : {}),
    },
  });

  // Dispatch formData and selectedBMR
  useEffect(() => {
    dispatch(setFormData(formData));
    dispatch(setSelectedBMR(selectedBMR));
  }, [dispatch, formData, selectedBMR]);

  // No need to dispatch again outside useEffect
  // dispatch(setFormData(formData));

  const [dynamicFields, setDynamicFields] = useState({
    "General Information": {},
    ...selectedBMR?.BMR_Tabs?.reduce((acc, tab) => {
      acc[tab.tab_name] = {};
      return acc;
    }, {}),
  });

  const Tabs = selectedBMR.BMR_Tabs;
  console.log(Tabs, "01201201202");

  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [isSelectedReviewer, setIsSelectedReviewer] = useState([]);
  const [isSelectedApprover, setIsSelectedApprover] = useState([]);
  const bmr_id = selectedBMR.bmr_id;
  const [initiatorName, setInitiatorName] = useState(null);
  const navigate = useNavigate();

  const handleVerificationSubmit = (verified) => {
    axios
      .post(
        `${BASE_URL}/bmr-record/create-bmr-record`,

        {
          data: recordData.data,
          bmr_id: selectedBMR.bmr_id,
          reviewers: isSelectedReviewer.map((reviewer) => ({
            reviewerId: reviewer.value,
            status: "pending",
            reviewer: reviewer.label,
            date_of_review: "NA",
            comment: null,
          })),
          approvers: isSelectedApprover.map((approver) => ({
            approverId: approver.value,
            status: "pending",
            approver: approver.label,
            date_of_approval: "NA",
            comment: null,
          })),
          email: verified.email,
          password: verified.password,
          declaration: verified.declaration,
          comments: verified.comments,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        toast.success(
          response.data.message || "BMR Records added successfully!"
        );
        navigate(`/bmr-forms`, {
          state: { bmr: response.data.bmr },
        });
        setRecordData({
          data: [],
          bmr_id: selectedBMR.bmr_id,
          reviewers: [],
          approvers: [],
        });
        setFormDataState({
          data: [],
          bmr_id: selectedBMR.bmr_id,
          reviewers: [],
          approvers: [],
        });
        setIsSelectedApprover([]);
        setIsSelectedReviewer([]);
        setTimeout(() => {
          closeUserVerifiedModal();
        }, 1000);
      })
      .catch((err) => {
        console.error(err.message);
        toast.error(err.message);
      });
  };

  useEffect(() => {
    axios
      .post(
        `${BASE_URL}/bmr-form/get-user-roles`,
        { role_id: 3 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const reviewerOptions = [
          { value: "select-all", label: "Select All" },
          ...new Map(
            response.data.message.map((role) => [
              role.user_id,
              {
                value: role.user_id,
                label: `${role.User.name}`,
              },
            ])
          ).values(),
        ];
        setReviewers(reviewerOptions);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    axios
      .post(
        `${BASE_URL}/bmr-form/get-user-roles`,
        { role_id: 4 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const approverOptions = [
          { value: "select-all", label: "Select All" },
          ...new Map(
            response.data.message.map((role) => [
              role.user_id,
              {
                value: role.user_id,
                label: `${role.User.name}`,
              },
            ])
          ).values(),
        ];
        setApprovers(approverOptions);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

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
  }, []);

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

  const handleSelectChange = (selected, field) => {
    if (selected?.some((option) => option.value === "select-all")) {
      const allOptions = field === "reviewers" ? reviewers : approvers;
      const nonSelectAllOptions = allOptions.filter(
        (option) => option.value !== "select-all"
      );
      setIsSelectedReviewer(
        field === "reviewers" ? nonSelectAllOptions : isSelectedReviewer
      );
      setIsSelectedApprover(
        field === "approvers" ? nonSelectAllOptions : isSelectedApprover
      );
    } else {
      if (field === "reviewers") {
        setIsSelectedReviewer(selected);
      } else if (field === "approvers") {
        setIsSelectedApprover(selected);
      }
    }
  };

  useEffect(() => {
    setRecordData({
      ...recordData,
      reviewers: isSelectedReviewer,
      approvers: isSelectedApprover,
    });
  }, [isSelectedReviewer, isSelectedApprover]);

  const handleAddRecordsClick = () => {
    const Tabs = selectedBMR?.BMR_Tabs;

    if (!Tabs || Tabs.length === 0) {
      toast.error("No tabs available.");
      return;
    }

    if (isSelectedReviewer.length === 0 || isSelectedApprover.length === 0) {
      toast.error("Please select both reviewers and approvers.");
      return;
    }

    let allRequiredFieldsFilled = true;

    Tabs.forEach((tab) => {
      tab.BMR_sections.forEach((section) => {
        section.BMR_fields.forEach((field) => {
          
          if (field.isRequired) {
            const value = formData[field.label]; // Adjust according to how you track form inputs
            if (value === undefined || value === null || value === "") {
              allRequiredFieldsFilled = false;
              // Log each missing field or you can break early if one missing field is enough to halt the process
              console.log(`Missing required field: ${field.label}`);
            }
          }
        });
      });
    });    
    
    setTimeout(() => {
      if (allRequiredFieldsFilled === false) {
        toast.error("Please fill all required fields to add a new Record.");
        return;
      }
    }, 100);
    dispatch(addTab(Tabs));
    setShowVerificationModal(true);
  };

  const addNewRow = () => {
    const newRow = selectedBMR?.BMR_Tabs?.map(
      (section) => section?.BMR_sections
    );
    setGridData([...gridData, newRow]);
  };

  const deleteRow = (rowIndex) => {
    const updatedGridData = gridData.filter((_, index) => index !== rowIndex);
    setGridData(updatedGridData); // Update the gridData state with the new row data
  };

  const handleGridChange = (activeTab, rowIndex, columnName, value) => {
    setGridData((prevGridData) => {
      // Create a copy of the previous grid data
      const updatedGridData = [...prevGridData];

      // Update the specific row and column
      updatedGridData[rowIndex] = {
        ...updatedGridData[rowIndex], // Copy the current row data
        [columnName]: value, // Update the specific column with the new value
      };

      // Return the updated grid data
      return updatedGridData;
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center ">
      <div className="w-full h-full bg-white shadow-lg rounded-lg  ">
        <div className="flex justify-around items-center  bg-gradient-to-r bg-gray-50 mt-3 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-black">
            Initiate BMR Records
          </h2>
        </div>
        <div className="flex justify-start gap-20 items-center bg-gradient-to-r from-[#4f839b] to-[#0c384d] mt-2 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-white ">
            BMR Name :
            <span className="text-gray-200"> {selectedBMR?.name}</span>
          </h2>

          <h2 className="text-lg font-semibold text-white ">
            Status :{" "}
            <span className="text-gray-200 ">{selectedBMR?.status}</span>
          </h2>
        </div>
        <div className="flex justify-start space-x-2 px-4 pb-4 ">
          {[
            "General Information",
            ...selectedBMR?.BMR_Tabs?.map((tab) => tab.tab_name),
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
              <div className="p-4 border border-gray-300 rounded-lg  bg-gradient-to-r from-gray-50 to-gray-100 opacity-95 shadow-lg">
                <label className="block text-gray-700 font-bold p-2  mb-2">
                  Reviewers
                </label>
                <Select
                  isMulti
                  options={reviewers}
                  value={isSelectedReviewer}
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
                  value={isSelectedApprover}
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
                  className="text-lg flex flex-col gap-9 font-bold text-gray-500"
                >
                  {tab.BMR_sections.map((section, index) => (
                    <div
                      key={index}
                      className="p-4 border mb-4 border-gray-500 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 opacity-95"
                    >
                      <h3 className="font-semibold text-gray-600 mb-3 text-lg bg-gray-200 p-3">
                        <div className="flex items-center gap-5 ">
                          <p>Section :</p>
                          <div className="block text-black">
                            {section.section_name}
                          </div>
                        </div>
                      </h3>
                      <div
                        className={
                          // Conditionally apply `grid-cols-2` if no grid field exists
                          section.BMR_fields.some(
                            (field) => field.field_type === "grid"
                          )
                            ? ""
                            : "grid grid-cols-2 gap-4"
                        }
                      >
                        {section.BMR_fields.map((field, idx) => {
                          return (
                            <div
                              key={idx}
                              className={`${
                                field.field_type !== "grid"
                                  ? "grid grid-cols-2"
                                  : " p-2"
                              }`}
                            >
                              {/* Non-grid fields */}
                              {field.field_type !== "grid" && (
                                <InputField
                                  label={field.label || "Field Name"}
                                  type={field.field_type || "text"}
                                  placeholder={field.placeholder}
                                  value={field.value}
                                  helpText={field.helpText}
                                  isRequired={field.isRequired}
                                  onChange={handleChange}
                                  className={` mb-4 rounded-md p-2 text-black ${
                                    field.label
                                      ? "text-base font-bold text-gray-900 flex gap-1 mb-2"
                                      : ""
                                  } `}
                                />
                              )}
                              {/* Grid field */}
                              <div className="mt-2">
                                {field.field_type === "grid" && (
                                  <div className="relative ">
                                    <div className="flex justify-between items-center">
                                      <div> {field.label} </div>
                                      <div className="flex justify-end">
                                        <button
                                          onClick={addNewRow}
                                          className="p-2 rounded"
                                        >
                                          <IoIosAddCircle size={25} />
                                        </button>
                                      </div>
                                    </div>

                                    {(() => {
                                      let acceptsMultiple =
                                        field?.acceptsMultiple
                                          ? JSON.parse(field.acceptsMultiple)
                                          : { columns: [], rows: [] };
                                      return (
                                        acceptsMultiple?.columns?.length >
                                          0 && (
                                          <table className="table-auto w-full border border-gray-600 mb-4">
                                            <thead>
                                              <tr>
                                                {acceptsMultiple?.columns?.map(
                                                  (column, idx) => {
                                                    return (
                                                      <th
                                                        key={idx}
                                                        className="border border-gray-600 p-2"
                                                      >
                                                        {column?.name ||
                                                          "No Name"}
                                                      </th>
                                                    );
                                                  }
                                                )}
                                                <th className="border border-gray-600 p-2">
                                                  Action
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {gridData.map((row, rowIndex) => {
                                                return (
                                                  <tr key={rowIndex}>
                                                    {acceptsMultiple.columns.map(
                                                      (column, colIdx) => (
                                                        <td
                                                          key={colIdx}
                                                          className="border border-gray-600 p-2"
                                                        >
                                                          <input
                                                            type={
                                                              column.field_type ||
                                                              "text"
                                                            }
                                                            onChange={
                                                              (e) =>
                                                                handleGridChange(
                                                                  rowIndex,
                                                                  column.name,
                                                                  e.target.value
                                                                ) // Update the value when typing
                                                            }
                                                            className="border text-black border-gray-600 p-2 w-full rounded"
                                                          />
                                                        </td>
                                                      )
                                                    )}
                                                    <td className="border border-gray-600 p-2 text-center">
                                                      <button
                                                        onClick={() =>
                                                          deleteRow(rowIndex)
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                      >
                                                        <IoIosTrash size={20} />
                                                      </button>
                                                    </td>
                                                  </tr>
                                                );
                                              })}
                                            </tbody>
                                          </table>
                                        )
                                      );
                                    })()}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
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
            onClick={handleAddRecordsClick}
          >
            Save
          </button>

          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none transition duration-200"
            onClick={() => navigate("/bmr-forms")}
          >
            Exit
          </button>
        </div>
      </div>
      {showVerificationModal && (
        <UserVerificationPopUp
          onClose={closeUserVerifiedModal}
          onSubmit={handleVerificationSubmit}
        />
      )}

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
  isRequired,
}) => (
  <div>
    <label className=" text-gray-700 font-bold p-2 mb-2 flex items-center">
      {label}
      {isRequired && <span className="text-red-600">*</span>}
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
      isRequired={isRequired}
    />
  </div>
);

export default BMRRecords;