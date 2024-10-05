/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import AtmButton from "../../../../AtmComponents/AtmButton";
import { useNavigate, useParams } from "react-router-dom";
import AddTabModal from "./Modals/AddTabModal";
import AddFieldModal from "./Modals/AddFieldModal";
import AddSectionModal from "./Modals/AddSectionModal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "./Modals/DeleteModal";
import "react-toastify/dist/ReactToastify.css";
import UserVerificationPopUp from "../../../../Components/UserVerificationPopUp/UserVerificationPopUp";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { AiOutlineAudit } from "react-icons/ai";
import { BASE_URL } from "../../../../config.json";
import PDF from "./PDF";

const BMRProcessDetails = ({ fieldData }) => {
  const [data, setData] = useState([]);
  console.log(data[0], "<data>");
  const [isAddTabModalOpen, setIsAddTabModalOpen] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [tabs, setTabs] = useState([
    "Initiator Remarks",
    "Reviewer Remarks",
    "Approver Remarks",
  ]);
  const [flowoTabs, setFlowoTabs] = useState([
    "INITIATION",
    "UNDER REVIEW",
    "UNDER APPROVAL",
    "APPROVED",
  ]);

  const [newTab, setNewTab] = useState([]);
  const [newFields, setNewFields] = useState({});
  const [newSection, setNewSection] = useState([]);
  const [section, setSection] = useState([]);
  const [fields, setFields] = useState({
    "Initiator Remarks": [
      {
        fieldName: "Initiator Name",
        field_type: "text",
        options: [],
        isMandatory: false,
      },
      {
        fieldName: "Date of Initiation",
        field_type: "date",
        options: [],
        isMandatory: false,
      },
      {
        fieldName: "Initiator Comments",
        field_type: "text-area",
        options: [],
        isMandatory: true,
      },
    ],
    "Reviewer Remarks": [
      {
        fieldName: "Reviewer Name",
        field_type: "text",
        options: [],
        isMandatory: false,
      },
      {
        fieldName: "Date of Review",
        field_type: "date",
        options: [],
        isMandatory: false,
      },
      {
        fieldName: "Reviewer Comments",
        field_type: "text-area",
        options: [],
        isMandatory: true,
      },
    ],
    "Approver Remarks": [
      {
        fieldName: "Approver Name",
        field_type: "text",
        options: [],
        isMandatory: false,
      },
      {
        fieldName: "Date of Approve",
        field_type: "date",
        options: [],
        isMandatory: false,
      },
      {
        fieldName: "Approver Comments",
        field_type: "text-area",
        options: [],
        isMandatory: true,
      },
    ],
  });

  const [activeFlowTab, setActiveFlowTab] = useState(flowoTabs[0]);
  const [activeDefaultTab, setActiveDefaultTab] = useState(tabs[0]);
  const [activeSendFormTab, setActiveSendFormTab] = useState(null);
  const [isActiveTab, setIsActiveTab] = useState(0);
  const [showForm, setShowForm] = useState("default");
  const [currentTabId, setCurrentTabId] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [updateTabModalOpen, setUpdateTabModalOpen] = useState(null);
  const [updateSectionModalOpen, setUpdateSectionModalOpen] = useState(null);
  const [updateFieldModalOpen, setUpdateFieldModalOpen] = useState(null);
  const [existingTabName, setExistingTabName] = useState("");
  const [existingSectionName, setExistingSectionName] = useState(null);
  const [existingFieldName, setExistingFieldName] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const { bmr_id } = useParams();
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupAction, setPopupAction] = useState(null);

  const handleGridChange = (tabName, rowIndex, columnName, value) => {
    setFields((prevFields) => {
      const updatedFields = { ...prevFields };

      const field = updatedFields[tabName].find(
        (fld) => fld.field_type === "grid"
      );

      if (field) {
        field.gridData[rowIndex][columnName] = value;
      }

      return updatedFields;
    });
  };

  const userDetails = JSON.parse(localStorage.getItem("user-details"));
  console.log(userDetails,"userDetails")
  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setPopupAction(null);
  };

  const handleMultiSelectChange = (fieldId, options) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [fieldId]: options,
    }));
  };
  const fetchBMRData = () => {
    axios
      .get(`${BASE_URL}/bmr-form/get-a-bmr/${bmr_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        const bmrData = response.data?.message;
        setData(bmrData);
        setNewTab(bmrData[0]?.BMR_Tabs || []);
        const sections = bmrData[0]?.BMR_Sections || [];
        const sectionsByTab = sections.reduce((acc, section) => {
          if (!acc[section.tab_name]) {
            acc[section.tab_name] = [];
          }
          acc[section.tab_name].push(section);
          return acc;
        }, {});
        setNewSection(sectionsByTab);
      })
      .catch(() => {
        toast.error("Error Fetching BMR");
      });
  };

  useEffect(() => {
    fetchBMRData();
  }, []);

  useEffect(() => {
    if (showForm === "sendForm" && newTab.length > 0) {
      const firstTab = newTab[0];
      setActiveSendFormTab(firstTab);
      setCurrentTabId(firstTab.bmr_tab_id);
    } else if (showForm === "sendForm" && newTab.length === 0) {
      setActiveSendFormTab(null);
      setCurrentTabId(null);
    }
  }, [showForm, newTab]);

  const addTab = (tabObject) => {
    if (!newTab.some((tab) => tab.tab_name === tabObject.tab_name)) {
      const updatedTabs = [...newTab, tabObject];
      setNewTab(updatedTabs);
      setNewFields({ ...newFields, [tabObject.tab_name]: [] });
      setNewSection({ ...newSection, [tabObject.tab_name]: [] });
      if (updatedTabs.length === 1) {
        setActiveSendFormTab(updatedTabs[0]);
      } else if (!activeSendFormTab) {
        setActiveSendFormTab(updatedTabs[0]);
      }

      fetchBMRData();
    }
  };
  const handlePopupSubmit = (credentials) => {
    const dataObject = {
      bmr_id: data[0].bmr_id,
      email: credentials?.email,
      password: credentials?.password,
      reviewComment: "editData.reviewComment",
      approverComment: "editData.approverComment",
      declaration: credentials?.declaration,
      comments: credentials?.comments,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    if (popupAction === "sendFromOpenToReview") {
      dataObject.initiatorDeclaration = credentials?.declaration;
      axios
        .put(`${BASE_URL}/bmr-form/send-BMR-for-review`, dataObject, config)
        .then(() => {
          toast.success("BMR successfully sent for review");
          navigate(-1);
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message || "Couldn't send BMR for review!!"
          );
        });
    } else if (popupAction === "sendFromReviewToApproval") {
      dataObject.reviewerDeclaration = credentials?.declaration;
      axios
        .put(
          `${BASE_URL}/bmr-form/send-BMR-from-review-to-approval`,
          dataObject,
          config
        )
        .then(() => {
          toast.success("BMR successfully sent for approval");
          setTimeout(() => navigate(-1), 500);
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message || "Couldn't send BMR for approval!!"
          );
        });
    } else if (popupAction === "sendFromReviewToOpen") {
      dataObject.reviewerDeclaration = credentials?.declaration;
      axios
        .put(
          `${BASE_URL}/bmr-form/send-BMR-from-review-to-open`,
          dataObject,
          config
        )
        .then(() => {
          toast.success("BMR successfully opened");
          navigate(-1);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || "Couldn't open bmr!!");
        });
    } else if (popupAction === "sendFromApprovalToApproved") {
      dataObject.approverDeclaration = credentials?.declaration;
      axios
        .put(`${BASE_URL}/bmr-form/approve-BMR`, dataObject, config)
        .then(() => {
          toast.success("BMR successfully approved");
          navigate(-1);
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message || "Couldn't approve BMR!!"
          );
        });
    } else if (popupAction === "sendFromApprovalToOpen") {
      dataObject.approverDeclaration = credentials?.declaration;
      axios
        .put(
          `${BASE_URL}/bmr-form/send-BMR-from-approval-to-open`,
          dataObject,
          config
        )
        .then(() => {
          toast.success(" BMR successfully opened");
          navigate(-1);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || "Couldn't open BMR!!");
        });
    }
    setIsPopupOpen(false);
    setPopupAction(null);
  };

  const handleFlowTabClick = (tab) => {
    setActiveFlowTab(tab);
  };
  useEffect(() => {
    if (data[0]?.stage === 1) {
      setActiveFlowTab("INITIATION");
    } else if (data[0]?.stage === 2) {
      setActiveFlowTab("UNDER REVIEW");
    } else if (data[0]?.stage === 3) {
      setActiveFlowTab("UNDER APPROVAL");
    } else if (data[0]?.stage === 4) {
      setActiveFlowTab("APPROVED");
    }
  }, [data]);
  const addSection = (sectionName) => {
    setNewSection((prevSections) => {
      const updatedSections = { ...prevSections };
      if (!updatedSections[activeSendFormTab]) {
        updatedSections[activeSendFormTab] = [];
      }
      if (
        !updatedSections[activeSendFormTab].some(
          (section) => section.section_name === sectionName
        )
      ) {
        updatedSections[activeSendFormTab].push({ section_name: sectionName });
        fetchBMRData();
      }
      return updatedSections;
    });
    setSection(activeSendFormTab, newSection[activeSendFormTab]);
  };
  const addField = (field) => {
    setNewFields({
      ...newFields,
      [activeSendFormTab]: [...(newFields[activeSendFormTab] || []), field],
    });
    fetchBMRData();
  };
  const handleDefaultTabClick = (tab) => {
    setActiveDefaultTab(tab);
  };
  const handleSendFormTabClick = (tab) => {
    const tabIndex = newTab.findIndex((t) => t.bmr_tab_id === tab.bmr_tab_id);
    setActiveSendFormTab(tab);
    setIsActiveTab(tabIndex);
    setCurrentTabId(tab.bmr_tab_id);
    setActiveSection(null);
    setActiveField(null);
    setExistingTabName(tab.tab_name);
    setExistingSectionName(tab.section_name);
    setExistingFieldName(tab);
  };
  const handleSectionClick = (section) => {
    setActiveSection(section);
    setExistingSectionName(section.section_name);
    setActiveField(null);
    setExistingFieldName(section);
  };

  const handleFieldClick = (field) => {
    setActiveField(field);
    setExistingFieldName(field);
  };

  const populateApproverFields = () => {
    if (data.length > 0) {
      const approvers = data[0].approvers || [];

      const approverFields = approvers.flatMap((approver, idx) => [
        {
          section: `Approver ${idx + 1}`,
          fields: [
            {
              fieldName: "Approver",
              field_type: "text",
              value: approver.approver,
              isMandatory: false,
            },
            {
              fieldName: "Date of Approval",
              field_type: "date",
              value: "",
              isMandatory: false,
            },
            {
              fieldName: "Approver Comment",
              field_type: "text",
              value: "",
              isMandatory: true,
            },
          ],
        },
      ]);
      setFields((prevFields) => ({
        ...prevFields,
        "Approver Remarks": approverFields,
      }));
    }
  };

  const populateReviewerFields = () => {
    if (data.length > 0) {
      const reviewers = data[0].reviewers || [];
      const reviewerFields = reviewers.flatMap((reviewer, idx) => [
        {
          section: `Reviewer ${idx + 1}`,
          fields: [
            {
              fieldName: "Reviewer",
              field_type: "text",
              value: reviewer.reviewer,
              isMandatory: false,
            },
            {
              fieldName: "Date of Review",
              field_type: "date",
              value: "",
              isMandatory: false,
            },
            {
              fieldName: "Reviewer Comment",
              field_type: "text",
              value: "",
              isMandatory: true,
            },
          ],
        },
      ]);
      setFields((prevFields) => ({
        ...prevFields,

        "Reviewer Remarks": reviewerFields,
      }));
    }
  };

  useEffect(() => {
    populateApproverFields();
    populateReviewerFields();
  }, [data]);

  const formattedDateForInput = (dateString) => {
    if (dateString === "NA" || !dateString) {
      return ""; // Return an empty string if the date is not available
    }

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  return (
    <div className="bg-white">
      <div className=" p-2 relative top-5 h-[55%] ">
        <header className="bg-[#006FC0] w-full shadow-lg flex justify-between items-center p-4 mb-4 h-20">
          <p className="text-lg text-gray-200 font-bold">BMR Process Details</p>
          <div className="flex space-x-2">
            {showForm === "default" ? (
              <>
                <Tooltip title="Audit Trail">
                  <IconButton>
                    <AiOutlineAudit
                      size={28}
                      className="flex justify-center text-gray-50 items-center cursor-pointer "
                      onClick={() => {
                        navigate("/audit-trail", { state: data[0] });
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <PDF data={data} />

                {activeFlowTab === "INITIATION" && (
                  <>
                    <AtmButton
                      label={newTab.length > 0 ? "Edit Form" : "Create Form"}
                      onClick={() => setShowForm("sendForm")}
                      className={`relative px-6 py-3 text-sm font-semibold focus:outline-none transition 
                   bg-gradient-to-r from-black to-black text-white shadow-lg transform scale-100 duration-300 rounded-md border border-blue-900 opacity-95 hover:from-blue-900 hover:to-blue-1000 hover:scale-105 hover:shadow-xl`} // Gradient, shadow, and hover effects
                    />
                  </>
                )}
              </>
            ) : showForm === "sendForm" ? (
              <>
                {/* Only show "Add Tab" button if no tab is added */}
                <AtmButton
                  label="Add Tab"
                  onClick={() => (
                    setIsAddTabModalOpen(true),
                    setUpdateTabModalOpen("add"),
                    setPopupAction("add-tab")
                  )}
                  className="bg-pink-700 hover:bg-pink-900 px-4 py-2"
                />

                {/* Show "Add Section" button only if a tab is active */}
                {activeSendFormTab && (
                  <>
                    <AtmButton
                      label="Add Section"
                      onClick={() => (
                        setIsSectionModalOpen(true),
                        setUpdateSectionModalOpen("add-section"),
                        setPopupAction("add-section")
                      )}
                      className="bg-purple-700 hover:bg-purple-950 px-4 py-2"
                    />
                  </>
                )}

                {/* Show "Add Field" button only if a section is active */}
                {activeSection && (
                  <>
                    <AtmButton
                      label="Add Field"
                      onClick={() => (
                        setIsAddFieldModalOpen(true),
                        setUpdateFieldModalOpen("add-field"),
                        setPopupAction("add-field")
                      )}
                      className="bg-green-700 hover:bg-green-950 px-4 py-2"
                    />
                  </>
                )}

                <AtmButton
                  label="Back to Default"
                  onClick={() => setShowForm("default")}
                  className="bg-gray-500 hover:bg-gray-700 px-4 py-2"
                />
              </>
            ) : (
              <AtmButton
                label="Back to Default"
                onClick={() => setShowForm("default")}
                className="bg-gray-500 hover:bg-gray-700 px-4 py-2"
              />
            )}
          </div>
        </header>

        {showForm === "sendForm" && (
          <div className="flex justify-end gap-4 mb-4">
            {activeField ? (
              <>
                <AtmButton
                  label="Edit Field"
                  className="bg-cyan-500 hover:bg-cyan-700"
                  onClick={() => (
                    setUpdateFieldModalOpen("edit-field"),
                    setIsAddFieldModalOpen(true)
                  )}
                />
                <AtmButton
                  label="Delete Field"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => (
                    setDeleteModalOpen(true), setDeleteItemType("field")
                  )}
                />
              </>
            ) : activeSection ? (
              <>
                <AtmButton
                  label="Edit Section"
                  className="bg-cyan-500 hover:bg-cyan-700"
                  onClick={() => (
                    setUpdateSectionModalOpen("edit-section"),
                    setIsSectionModalOpen(true)
                  )}
                />
                <AtmButton
                  label="Delete Section"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => (
                    setDeleteModalOpen(true), setDeleteItemType("section")
                  )}
                />
              </>
            ) : activeSendFormTab ? (
              <>
                <AtmButton
                  label="Edit Tab"
                  className="bg-cyan-500 hover:bg-cyan-700"
                  onClick={() => (
                    setUpdateTabModalOpen("edit"), setIsAddTabModalOpen(true)
                  )}
                />
                <AtmButton
                  label="Delete Tab"
                  className="bg-red-600 hover:bg-red-800"
                  onClick={() => (
                    setDeleteModalOpen(true), setDeleteItemType("tab")
                  )}
                />
              </>
            ) : null}
          </div>
        )}

        {showForm === "default" && (
          <div className="flex gap-4 mb-4">
            {flowoTabs?.map((tab, index) => (
              <button
                disabled
                style={{ border: "1px solid gray" }}
                key={index}
                onClick={() => handleFlowTabClick(tab)}
                className={`py-2 px-4 rounded border-2 border-black text-white ${
                  activeFlowTab === tab && tab === "APPROVED"
                    ? "bg-[#195b7a] text-white"
                    : flowoTabs.indexOf(activeFlowTab) >= index
                    ? "bg-[#2a323e] text-white"
                    : "bg-[#777778] text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
        {showForm === "default" && (
          <div className="flex flex-wrap gap-4 mb-4">
            {tabs?.map((tab, index) => (
              <button
                style={{ border: "1px solid gray" }}
                key={index}
                onClick={() => handleDefaultTabClick(tab)}
                className={`relative px-6 py-3 text-sm font-semibold focus:outline-none transition 
                ${
                  activeDefaultTab === tab
                    ? "text-white bg-gradient-to-r from-blue-800 to-blue-900 shadow-lg transform scale-100 transition duration-300 rounded-md border border-blue-900 opacity-95" // Active tab: Dark gradient without hover effect
                    : "text-gray-800 bg-gray-300 border border-gray-400 hover:bg-gray-400 hover:text-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 rounded-md" // Non-active: Light gray with blue hover effects
                }
                rounded-lg mx-2`} // Added margin-x for horizontal spacing
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {showForm === "sendForm" && (
          <div className="flex flex-wrap gap-4 mb-4">
            {newTab?.map((tab, index) => (
              <button
                style={{ border: "1px solid gray" }}
                key={index}
                onClick={() => handleSendFormTabClick(tab)}
                className={`py-2 px-4 rounded border-2 border-black ${
                  activeSendFormTab === tab
                    ? "bg-blue-500 text-white text-lg"
                    : "bg-blue-200 text-black text-lg"
                }`}
              >
                {tab.tab_name}
              </button>
            ))}
          </div>
        )}

        {showForm === "default" && (
          <div className="relative m-2">
            <div className="p-3">
              {activeDefaultTab === "Initiator Remarks" &&
                fields["Initiator Remarks"]?.length > 0 && (
                  <div className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                      {fields["Initiator Remarks"].map((field, index) => (
                        <div
                          key={index}
                          className="p-6 flex flex-col bg-white border border-gray-100 shadow-md rounded-lg  mb-4"
                        >
                          <label className="text-lg font-semibold text-gray-800 mb-2">
                            {field.fieldName}
                            {activeFlowTab === "INITIATION" &&
                              field.fieldName === "Initiator Comments" && (
                                <span className="text-red-500">*</span>
                              )}
                          </label>

                          {field.field_type === "text" && (
                            <input
                              type="text"
                              value={data[0]?.Initiator.name}
                              className="border border-gray-600 text-gray-600 p-2 w-full rounded"
                              style={{
                                height: "40px",
                                border: "2.8px solid gray",
                              }}
                              disabled
                            />
                          )}

                          {field.field_type === "date" && (
                            <input
                              type="date"
                              value={formattedDateForInput(
                                data[0]?.date_of_initiation
                              )}
                              className="border border-gray-300 p-3 w-full bg-gray-100 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400 "
                              required={field.isMandatory}
                              readOnly
                            />
                          )}

                          {field.field_type === "text-area" && (
                            <textarea
                              value={(e)=>e.target.valu}
                              className="border border-gray-300 p-3 w-full bg-gray-100 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400 "
                              required={
                                activeFlowTab === "INITIATION" &&
                                field.fieldName === "Initiator Comments" &&
                                field.isMandatory
                              }
                              readOnly={data[0]?.stage !== 1 &&
                                data[0]?.initiator !== userDetails.userId   }
                              rows={4}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {activeDefaultTab === "Reviewer Remarks" &&
                fields[activeDefaultTab]?.map((section, secIndex) => {
                  return (
                    <div key={secIndex} className="mb-20">
                      <div className="p-6 flex flex-col bg-white border border-gray-200 shadow-md rounded-lg  mb-4">
                        {section.section}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {section.fields?.map((field, index) => {
                          return (
                            <div
                              key={index}
                              className="p-6 flex flex-col bg-white shadow  border border-gray-200 rounded"
                            >
                              <label className="text-lg font-semibold text-gray-800 mb-2">
                                {field.fieldName}
                                {activeFlowTab === "UNDER REVIEW" &&
                                  field.fieldName === "Reviewer Comment" && (
                                    <span className="text-red-500"> *</span>
                                  )}
                              </label>
                              {field.field_type === "text" && (
                                <input
                                  type="text"
                                  className=" p-3 w-full bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 "
                                  style={{
                                    // border: "1px solid #D1D5DB",
                                    height: "30px",
                                  }}
                                  value={field.value || ""}
                                  disabled
                                />
                              )}
                              {field.field_type === "date" && (
                                <input
                                  type="date"
                                  value={formattedDateForInput(
                                    data[0]?.reviewers?.map(
                                      (date) => date?.date_of_review
                                    )
                                  )}
                                  className=" p-2 w-full bg-gray-100  rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                  style={{
                                    // border: "1px solid #D1D5DB",
                                    height: "30px",
                                  }}
                                  readOnly
                                />
                              )}
                              {field.field_type === "text-area" && (
                                <textarea
                                  className="border border-gray-300 p-2 w-full rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                  style={{ border: "1px solid #D1D5DB" }}
                                  required={
                                    activeFlowTab === "UNDER REVIEW" &&
                                    field.fieldName === "Reviewer Comment" &&
                                    field.isMandatory
                                  }
                                  readOnly={
                                    !(
                                      activeFlowTab === "UNDER REVIEW" &&
                                      field.fieldName === "Reviewer Comment"
                                    )
                                  }
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

              {activeDefaultTab === "Approver Remarks" &&
                fields[activeDefaultTab]?.map((section, secIndex) => (
                  <div key={secIndex} className="mb-20">
                    <div className="p-6 flex flex-col bg-white border border-gray-200 shadow-md rounded-lg  mb-4">
                      {section.section}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {section.fields?.map((field, index) => (
                        <div
                          key={index}
                          className="p-6 flex flex-col bg-white shadow  border border-gray-200 rounded"
                        >
                          <label className="text-lg font-extrabold text-gray-700 mb-2">
                            {field.fieldName}
                            {activeFlowTab === "UNDER APPROVAL" &&
                              field.fieldName === "Approver Comment" && (
                                <span className="text-red-500"> *</span>
                              )}
                          </label>
                          {field.field_type === "text" && (
                            <input
                              type="text"
                              className="border border-gray-300 p-2 w-full bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                              style={{
                                // border: "1px solid #D1D5DB",
                                height: "30px",
                                border: "2.8px solid gray",
                              }}
                              value={field.value || ""}
                              disabled
                            />
                          )}
                          {field.field_type === "date" && (
                            <input
                              type="date"
                              value={formattedDateForInput(
                                data[0]?.approvers?.map(
                                  (date) => date?.date_of_approval
                                )
                              )}
                              className="border border-gray-300 bg-gray-100  p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                              style={{
                                // border: "1px solid #D1D5DB",
                                height: "30px",
                              }}
                              readOnly
                            />
                          )}
                          {field.field_type === "text-area" && (
                            <textarea
                              className="border border-gray-300 p-2 w-full rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                              required={
                                activeFlowTab === "UNDER APPROVAL" &&
                                field.fieldName === "Approver Comment" &&
                                field.isMandatory
                              }
                              readOnly={
                                !(
                                  activeFlowTab === "UNDER APPROVAL" &&
                                  field.fieldName === "Approver Comment"
                                )
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            <div className="fixed bottom-36 right-[-10px] w-auto flex-col border-gray-300  flex gap-5">
              {newTab.length > 0 ? (
                <>
                  {data[0]?.stage === 1 &&
                    data[0]?.initiator === userDetails.userId && (
                      <AtmButton
                        label={"Send For Review"}
                        className="bg-[#195b7a] hover:bg-[#1f4f5f] p-2 rounded-l-full"
                        onClick={() => {
                          setIsPopupOpen(true);
                          setPopupAction("sendFromOpenToReview"); // Set the action when opening the popup
                        }}
                      />
                    )}
                  {data[0]?.stage === 2 &&
                    data[0]?.reviewers.some(
                      (reviewer) => reviewer.reviewerId === userDetails.userId
                    ) &&
                    (data[0]?.reviewers.find(
                      (reviewer) => reviewer.reviewerId === userDetails.userId
                    )?.status === "reviewed" ? (
                      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
                        <p className="font-semibold text-lg flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m2 0h-1v-4h-1m1 10v1m4-6.582c.594-.34 1-.985 1-1.718V5.5a2.5 2.5 0 00-5 0v2.5c0 .733.406 1.378 1 1.718M10 9v6.034c0 1.386-.803 2.647-2.051 3.302a3.75 3.75 0 00-.95 5.27M19 13v7m0 0h-4m4 0v-3m4 3h-4m4 0v-3m4 3h-4"
                            />
                          </svg>
                          You have already reviewed this.
                        </p>
                      </div>
                    ) : (
                      <>
                        <AtmButton
                          label={"Send For Approval"}
                          className="bg-[#195b7a] hover:bg-[#1f4f5f] p-2 rounded-l-full"
                          onClick={() => {
                            setIsPopupOpen(true);
                            setPopupAction("sendFromReviewToApproval"); // Set the action when opening the popup
                          }}
                        />
                        <AtmButton
                          label={"Open BMR"}
                          className="bg-[#195b7a] hover:bg-[#1f4f5f] p-2 rounded-l-full"
                          onClick={() => {
                            setIsPopupOpen(true);
                            setPopupAction("sendFromReviewToOpen"); // Set the action when opening the popup
                          }}
                        />
                      </>
                    ))}
                  {data[0]?.stage === 3 &&
                  data[0]?.approvers.some(
                    (approver) => approver.approverId === userDetails.userId
                  ) ? (
                    data[0]?.approvers.find(
                      (approver) => approver.approverId === userDetails.userId
                    )?.status === "approved" ? (
                      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md">
                        <p className="font-semibold text-lg flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m2 0h-1v-4h-1m1 10v1m4-6.582c.594-.34 1-.985 1-1.718V5.5a2.5 2.5 0 00-5 0v2.5c0 .733.406 1.378 1 1.718M10 9v6.034c0 1.386-.803 2.647-2.051 3.302a3.75 3.75 0 00-.95 5.27M19 13v7m0 0h-4m4 0v-3m4 3h-4m4 0v-3m4 3h-4"
                            />
                          </svg>
                          You have already approved this.
                        </p>
                      </div>
                    ) : (
                      <>
                        <AtmButton
                          label={"Approve BMR"}
                          className="bg-[#195b7a] hover:bg-[#1f4f5f] p-2 rounded-l-full"
                          onClick={() => {
                            setIsPopupOpen(true);
                            setPopupAction("sendFromApprovalToApproved"); // Set the action when opening the popup
                          }}
                        />
                        <AtmButton
                          label={"Open BMR"}
                          className="bg-[#195b7a] hover:bg-[#1f4f5f] p-2 rounded-l-full"
                          onClick={() => {
                            setIsPopupOpen(true);
                            setPopupAction("sendFromApprovalToOpen"); // Set the action when opening the popup
                          }}
                        />
                      </>
                    )
                  ) : null}
                </>
              ) : (
                ""
              )}
              <AtmButton
                label={"Exit"}
                onClick={() => {
                  navigate(-1);
                }}
                className="rounded-l-full"
              />
            </div>
          </div>
        )}
        <div className="">
          {showForm === "sendForm" && activeSendFormTab && (
            <div className="text-lg flex flex-col gap-9 font-bold text-gray-500">
              {activeSendFormTab?.BMR_sections?.map((section, index) => {
                return (
                  <div
                    key={index}
                    className={`mb-2 cursor-pointer ${
                      activeSection === section ? "border border-black" : ""
                    }`}
                  >
                    <div onClick={() => handleSectionClick(section)}>
                      <div
                        className={`py-2 px-4 mb-2 cursor-pointer ${
                          activeSection === section
                            ? "bg-blue-300 text-gray-700"
                            : "bg-blue-200 text-gray-400"
                        }`}
                      >
                        {section.section_name}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 px-5 py-[64px]">
                      {section.BMR_fields?.map((field, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => handleFieldClick(field)}
                            className={`p-4 rounded bg-gray-50 border-gray-300 ${
                              field.field_type === "grid"
                                ? "col-span-4" // Makes grid field span full width
                                : "col-span-2" // Other fields remain in 2x2 layout
                            }`}
                          >
                            <label className="text-base font-bold text-gray-900 flex gap-1 mb-2">
                              {field.label}
                              {field.isMandatory && (
                                <div className="text-red-500"> *</div>
                              )}
                              {field.helpText && (
                                <Tooltip
                                  title={field.helpText}
                                  placement="right-start"
                                >
                                  <div className="text-gray-950 cursor-pointer">
                                    <span className="text-black">ⓘ</span>
                                  </div>
                                </Tooltip>
                              )}
                            </label>

                            {field.field_type === "text" && (
                              <div className="relative">
                                <input
                                  placeholder={field.placeholder}
                                  style={{
                                    border: "2.8px solid gray",
                                    height: "48px",
                                  }}
                                  type="text"
                                  className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 p-3 w-full"
                                  required={field.isMandatory}
                                  readOnly={field.isReadonly}
                                />
                              </div>
                            )}

                            {field.field_type === "grid" && (
                              <div className="relative">
                                {JSON.parse(field?.acceptsMultiple)?.columns
                                  ?.length > 0 && (
                                  <table className="table-auto w-full border border-gray-600 mb-4">
                                    <thead>
                                      <tr>
                                        {JSON.parse(
                                          field?.acceptsMultiple
                                        )?.columns?.map((column, idx) => {
                                          return (
                                            <th
                                              key={idx}
                                              className="border border-gray-600 p-2"
                                            >
                                              {column?.name || "No Name"}
                                            </th>
                                          );
                                        })}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {field?.gridData?.map((row, rowIndex) => {
                                        return (
                                          <tr key={rowIndex}>
                                            {field?.acceptsMultiple?.columns?.map(
                                              (column, colIdx) => (
                                                <td
                                                  key={colIdx}
                                                  className="border border-gray-600 p-2"
                                                >
                                                  <input
                                                    type="text"
                                                    placeholder={
                                                      column.placeholder
                                                    }
                                                    value={
                                                      row[column.name] || ""
                                                    }
                                                    onChange={(e) =>
                                                      handleGridChange(
                                                        activeDefaultTab,
                                                        rowIndex,
                                                        column.name,
                                                        e.target.value
                                                      )
                                                    }
                                                    className="border border-gray-600 p-2 w-full rounded"
                                                  />
                                                </td>
                                              )
                                            )}
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            )}

                            {field.field_type === "password" && (
                              <div className="relative">
                                <input
                                  placeholder={field.placeholder}
                                  style={{
                                    border: "2.8px solid gray",
                                    height: "48px",
                                  }}
                                  type="password"
                                  className="border border-gray-600 text-gray-600 p-2 w-full rounded"
                                  required={field.isMandatory}
                                  readOnly={field.isReadonly}
                                />
                              </div>
                            )}

                            {field.field_type === "date" && (
                              <div className="relative">
                                <input
                                  placeholder={field.placeholder}
                                  style={{
                                    border: "2.8px solid gray",
                                    height: "48px",
                                  }}
                                  type="date"
                                  className="border border-gray-600 p-2 w-full rounded"
                                  required={field.isMandatory}
                                  readOnly={field.isReadonly}
                                />
                              </div>
                            )}
                            {field.field_type === "file" && (
                              <div className="relative">
                                <input
                                  placeholder={field.placeholder}
                                  style={{
                                    border: "2.8px solid gray",
                                    height: "48px",
                                  }}
                                  type="file"
                                  className="border border-gray-600 p-2 w-full rounded"
                                  required={field.isMandatory}
                                  readOnly={field.isReadonly}
                                />
                              </div>
                            )}
                            {field.field_type === "time" && (
                              <div className="relative">
                                <input
                                  placeholder={field.placeholder}
                                  style={{
                                    border: "2.8px solid gray",
                                    height: "48px",
                                  }}
                                  type="time"
                                  className="border border-gray-600 p-2 w-full rounded"
                                  required={field.isMandatory}
                                  readOnly={field.isReadonly}
                                />
                              </div>
                            )}

                            {field.field_type === "email" && (
                              <div className="relative">
                                <input
                                  placeholder={field.placeholder}
                                  style={{
                                    border: "2.8px solid gray",
                                    height: "48px",
                                  }}
                                  type="email"
                                  className="border border-gray-600 p-2 w-full rounded"
                                  required={field.isMandatory}
                                  readOnly={field.isReadonly}
                                />
                              </div>
                            )}

                            {field.field_type === "number" && (
                              <div className="relative">
                                <input
                                  placeholder={field.placeholder}
                                  style={{
                                    border: "2.8px solid gray",
                                    height: "48px",
                                  }}
                                  type="number"
                                  className="border border-gray-600 p-2 w-full rounded"
                                  required={field.isMandatory}
                                  readOnly={field.isReadonly}
                                />
                              </div>
                            )}

                            {field.field_type === "checkbox" && (
                              <div className="relative">
                                <input
                                  placeholder={field.placeholder}
                                  style={{
                                    border: "2.8px solid gray",
                                    height: "48px",
                                  }}
                                  type="checkbox"
                                  className="border border-gray-600 p-2 rounded"
                                  required={field.isMandatory}
                                  readOnly={field.isReadonly}
                                />
                              </div>
                            )}

                            {field.field_type === "dropdown" && (
                              <div className="relative">
                                <select
                                  className="border border-gray-600 p-2 w-full rounded"
                                  style={{
                                    border: "2.8px solid gray",
                                    height: "48px",
                                  }}
                                  required={field.isMandatory}
                                >
                                  {/* {field?.acceptsMultiple?.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))} */}
                                </select>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {isAddTabModalOpen && (
          <AddTabModal
            isOpen={isAddTabModalOpen}
            closeModal={() => setIsAddTabModalOpen(false)}
            addTab={addTab}
            updateTab={updateTabModalOpen}
            bmr_tab_id={currentTabId}
            existingTabName={existingTabName}
            openConfirmPopup={isPopupOpen}
            setIsPopupOpen={setIsPopupOpen}
          />
        )}

        {activeSection && isAddFieldModalOpen && (
          <AddFieldModal
            isOpen={isAddFieldModalOpen}
            closeModal={() => setIsAddFieldModalOpen(false)}
            addField={addField}
            bmr_tab_id={currentTabId}
            bmr_section_id={activeSection.bmr_section_id}
            updateField={updateFieldModalOpen}
            bmr_field_id={activeField?.bmr_field_id}
            existingFieldData={existingFieldName}
          />
        )}

        {activeSendFormTab && isSectionModalOpen && (
          <AddSectionModal
            isOpen={isSectionModalOpen}
            closeModal={() => setIsSectionModalOpen(false)}
            addSection={addSection}
            bmr_tab_id={currentTabId}
            updateSection={updateSectionModalOpen}
            bmr_section_id={activeSection?.bmr_section_id}
            existingSectionName={existingSectionName}
          />
        )}
        {deleteModalOpen && (
          <DeleteModal
            onClose={() => setDeleteModalOpen(false)}
            id={currentTabId}
            newTab={newTab}
            setNewTab={setNewTab}
            newSection={activeSendFormTab?.BMR_sections}
            setNewSection={setNewSection}
            section_id={activeSection?.bmr_section_id}
            bmr_field_id={activeField?.bmr_field_id}
            newFields={newFields}
            setNewFields={setNewFields}
            itemType={deleteItemType}
            fetchBMRData={fetchBMRData}
          />
        )}
        {isPopupOpen && (
          <UserVerificationPopUp
            onClose={handlePopupClose}
            onSubmit={handlePopupSubmit}
          />
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default BMRProcessDetails;
