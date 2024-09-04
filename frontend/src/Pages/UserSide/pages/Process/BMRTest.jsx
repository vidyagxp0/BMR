import React, { useEffect, useState } from "react";
import AtmButton from "../../../../AtmComponents/AtmButton";
import { useNavigate, useParams } from "react-router-dom";
import AddTabModal from "./Modals/AddTabModal";
import AddFieldModal from "./Modals/AddFieldModal";
import AddSectionModal from "./Modals/AddSectionModal";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "./Modals/DeleteModal";
import "react-toastify/dist/ReactToastify.css";
const BMRProcessDetails = () => {
  const [data, setData] = useState([]);
  console.log(data, "data");
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
        field_type: "text",
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
        field_type: "text",
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
        field_type: "text",
        options: [],
        isMandatory: true,
      },
    ],
  });
  const [activeFlowTab, setActiveFlowTab] = useState(flowoTabs[0]);
  const [activeDefaultTab, setActiveDefaultTab] = useState(tabs[0]);
  const [activeSendFormTab, setActiveSendFormTab] = useState(null);
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

  const handleMultiSelectChange = (fieldId, options) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [fieldId]: options,
    }));
  };

  const formatOptionLabel = (option) => <div>{option.label}</div>;

  const fetchBMRData = () => {
    axios
      .get(`http://195.35.6.197:7000/bmr-form/get-a-bmr/${bmr_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        const bmrData = response.data.message;
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
      .catch((error) => {
        console.log(error);
        toast.error("Error Fetching BMR");
      });
  };

  useEffect(() => {
    fetchBMRData();
  }, []);

  useEffect(() => {
    if (showForm === "sendForm" && newTab.length > 0) {
      // Automatically set the first tab as active
      const firstTab = newTab[0];
      setActiveSendFormTab(firstTab.tab_name);
      setCurrentTabId(firstTab.bmr_tab_id);
    }
  }, [showForm, newTab]);

  const addTab = (tabObject) => {
    if (!newTab.some((tab) => tab.tab_name === tabObject.tab_name)) {
      const updatedTabs = [...newTab, tabObject];
      setNewTab(updatedTabs);
      setNewFields({ ...newFields, [tabObject.tab_name]: [] });
      setNewSection({ ...newSection, [tabObject.tab_name]: [] });

      // Check if it's the first tab being added, then set it as the active tab
      if (updatedTabs.length === 1) {
        setActiveSendFormTab(updatedTabs[0]);
      } else if (!activeSendFormTab) {
        // If no tab is active, set the first tab as active
        setActiveSendFormTab(updatedTabs[0]);
      }

      fetchBMRData();
    }
  };

  const addSection = (sectionName) => {
    setNewSection((prevSections) => {
      const updatedSections = { ...prevSections };

      // Ensure the activeTab exists in the updatedSections object
      if (!updatedSections[activeSendFormTab]) {
        updatedSections[activeSendFormTab] = [];
      }

      // Check if the section already exists, if not, add it
      if (
        !updatedSections[activeSendFormTab].some(
          (section) => section.section_name === sectionName
        )
      ) {
        updatedSections[activeSendFormTab].push({ section_name: sectionName });
        fetchBMRData();
      }

      // Return the updated sections
      return updatedSections;
    });
    // Update the sections state for the active tab
    setSection(activeSendFormTab, newSection[activeSendFormTab]);
  };

  const addField = (field) => {
    setNewFields({
      ...newFields,
      [activeSendFormTab]: [...(newFields[activeSendFormTab] || []), field],
    });
    fetchBMRData();
  };
  const handleFlowTabClick = (tab) => {
    setActiveFlowTab(tab);
  };

  const handleDefaultTabClick = (tab) => {
    setActiveDefaultTab(tab);
  };

  const handleSendFormTabClick = (tab) => {
    setActiveSendFormTab(tab);
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

  return (
    <div className="p-4 relative h-full">
      <header className="bg-gray-200 w-full shadow-lg flex justify-between items-center p-4 mb-4">
        <p className="text-lg font-bold">BMR Process Details</p>
        <div className="flex space-x-2">
          {showForm === "default" ? (
            <>
              <AtmButton
                label="Edit Form"
                onClick={() => setShowForm("sendForm")}
                className="bg-blue-500 hover:bg-blue-700 px-4 py-2"
              />
            </>
          ) : showForm === "sendForm" ? (
            <>
              {/* Only show "Add Tab" button if no tab is added */}
              <AtmButton
                label="Add Tab"
                onClick={() => (
                  setIsAddTabModalOpen(true), setUpdateTabModalOpen("add")
                )}
                className="bg-pink-950 hover:bg-pink-700 px-4 py-2"
              />

              {/* Show "Add Section" button only if a tab is active */}
              {activeSendFormTab && (
                <>
                  <AtmButton
                    label="Add Section"
                    onClick={() => (
                      setIsSectionModalOpen(true),
                      setUpdateSectionModalOpen("add-section")
                    )}
                    className="bg-purple-950 hover:bg-purple-700 px-4 py-2"
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
                      setUpdateFieldModalOpen("add-field")
                    )}
                    className="bg-green-950 hover:bg-green-700 px-4 py-2"
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

      {/* Conditionally render buttons based on active items */}
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
                className="bg-red-600 hover:bg-red-700"
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
              style={{ border: "1px solid gray" }}
              key={index}
              onClick={() => handleFlowTabClick(tab)}
              className={`py-2 px-4 rounded-full border-2 border-black ${
                activeFlowTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-gray-700"
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
              className={`py-2 px-4 rounded-full border-2 border-black ${
                activeDefaultTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-gray-700"
              }`}
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
              className={`py-2 px-4 rounded-full border-2 border-black ${
                activeSendFormTab === tab
                  ? "bg-gray-400 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab.tab_name}
            </button>
          ))}
        </div>
      )}

      {showForm === "default" && (
        <div className="relative h-screen">
          <div className="overflow-auto mb-16">
            {activeDefaultTab === "Initiator Remarks" &&
              fields["Initiator Remarks"]?.length > 0 && (
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    {fields["Initiator Remarks"].map((field, index) => (
                      <div
                        key={index}
                        className="p-4 flex flex-col bg-white shadow border border-gray-300 mb-4"
                      >
                        <label className="text-lg font-extrabold text-gray-700 mb-2">
                          {field.fieldName}
                          {field.isMandatory && (
                            <span className="text-red-500"> *</span>
                          )}
                        </label>
                        {field.field_type === "text" && (
                          <input
                            type="text"
                            className="border border-gray-600 p-2 w-full rounded"
                            style={{ border: "1px solid gray", height: "30px" }}
                            required={field.isMandatory}
                          />
                        )}
                        {field.field_type === "date" && (
                          <input
                            type="date"
                            className="border border-gray-600 p-2 w-full rounded mt-2"
                            style={{ border: "1px solid gray", height: "30px" }}
                            required={field.isMandatory}
                          />
                        )}
                        {field.field_type === "text-area" && (
                          <textarea
                            className="border border-gray-600 p-2 w-full rounded mt-2"
                            value={field.value || ""}
                            required={field.isMandatory}
                            readOnly
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {activeDefaultTab !== "Initiator Remarks" &&
              fields[activeDefaultTab]?.map((section, secIndex) => (
                <div key={secIndex} className="mb-6">
                  <div className="col-span-3 p-4 mt-4 text-right rounded bg-gray-100 mb-5 font-semibold text-gray-700 border border-gray-300">
                    {section.section}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {section.fields?.map((field, index) => (
                      <div
                        key={index}
                        className="p-4 flex flex-col bg-white shadow border border-gray-300"
                      >
                        <label className="text-lg font-extrabold text-gray-700 mb-2">
                          {field.fieldName}
                          {field.isMandatory && (
                            <span className="text-red-500"> *</span>
                          )}
                        </label>
                        {field.field_type === "text" && (
                          <input
                            type="text"
                            className="border border-gray-600 p-2 w-full rounded"
                            style={{ border: "1px solid gray", height: "30px" }}
                            value={field.value || ""}
                            required={field.isMandatory}
                          />
                        )}
                        {field.field_type === "date" && (
                          <input
                            type="date"
                            className="border border-gray-600 p-2 w-full rounded"
                            style={{ border: "1px solid gray", height: "30px" }}
                            required={field.isMandatory}
                          />
                        )}
                        {field.field_type === "text-area" && (
                          <textarea
                            className="border border-gray-600 p-2 w-full rounded mt-2"
                            value={field.value || ""}
                            required={field.isMandatory}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
          <div className="fixed bottom-0 left-0 w-full bg-white  border-gray-300 p-4 flex justify-end gap-5">
            <AtmButton
              label={"Send For Review"}
              className="bg-blue-500 hover:bg-blue-700 p-2"
            />
            <AtmButton
              label={"Send For Approval"}
              className="bg-blue-500 hover:bg-blue-700 p-2"
            />
            <AtmButton
              label={"Open BMR"}
              className="bg-blue-500 hover:bg-blue-700 p-2"
            />
            <AtmButton
              label={"Exit"}
              className="bg-blue-500 hover:bg-blue-700 p-2"
            />
          </div>
        </div>
      )}

      <div className="">
        {showForm === "sendForm" && activeSendFormTab && (
          <div className="text-lg text-right flex flex-col gap-9 font-bold text-gray-500">
            {activeSendFormTab?.BMR_sections?.map((section, index) => (
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
                        ? "bg-gray-400 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {section.section_name}
                  </div>
                </div>
                <div className="grid grid-cols-2 shadow-xl gap-4 px-5 py-[64px]">
                  {section.BMR_fields?.map((field, index) => (
                    <div
                      key={index}
                      onClick={() => handleFieldClick(field)}
                      className="p-4 rounded bg-white shadow border border-gray-300"
                    >
                      <label className="text-lg font-extrabold text-gray-700 flex gap-1 mb-2">
                        {field.label}
                        <div className="text-red-500">
                          {field.isMandatory && " *"}
                        </div>
                      </label>
                      {/* Render input fields based on type */}
                      {field.field_type === "text" && (
                        <input
                          placeholder={field.placeholder}
                          style={{ border: "1px solid gray", height: "48px" }}
                          type="text"
                          className="border border-gray-600 p-2 w-full rounded"
                          required={field.isMandatory}
                          readOnly={field.isReadOnly}
                        />
                      )}
                      {field.field_type === "password" && (
                        <input
                          placeholder={field.placeholder}
                          style={{ border: "1px solid gray", height: "48px" }}
                          type="password"
                          className="border border-gray-600 p-2 w-full rounded"
                          required={field.isMandatory}
                          readOnly={field.isReadOnly}
                        />
                      )}
                      {field.field_type === "date" && (
                        <input
                          placeholder={field.placeholder}
                          style={{ border: "1px solid gray", height: "48px" }}
                          type="date"
                          className="border border-gray-600 p-2 w-full rounded"
                          required={field.isMandatory}
                          readOnly={field.isReadOnly}
                        />
                      )}
                      {field.field_type === "email" && (
                        <input
                          placeholder={field.placeholder}
                          style={{ border: "1px solid gray", height: "48px" }}
                          type="email"
                          className="border border-gray-600 p-2 w-full rounded"
                          required={field.isMandatory}
                          readOnly={field.isReadOnly}
                        />
                      )}
                      {field.field_type === "number" && (
                        <input
                          placeholder={field.placeholder}
                          style={{ border: "1px solid gray", height: "48px" }}
                          type="number"
                          className="border border-gray-600 p-2 w-full rounded"
                          required={field.isMandatory}
                          readOnly={field.isReadOnly}
                        />
                      )}
                      {field.field_type === "checkbox" && (
                        <input
                          placeholder={field.placeholder}
                          style={{ border: "1px solid gray", height: "48px" }}
                          type="checkbox"
                          className="border border-gray-600 p-2 rounded"
                          required={field.isMandatory}
                          readOnly={field.isReadOnly}
                        />
                      )}
                      {field.field_type === "dropdown" && (
                        <select
                          className="border border-gray-600 p-2 w-full rounded"
                          style={{ border: "1px solid gray", height: "48px" }}
                          required={field.isMandatory}
                        >
                          {field?.acceptsMultiple?.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                      {field.field_type === "multi-select" && (
                        <>
                          <Select
                            isMulti
                            options={field?.acceptsMultiple?.map((option) => ({
                              value: option,
                              label: option,
                            }))}
                            value={selectedOptions[field.id] || []}
                            onChange={(options) =>
                              handleMultiSelectChange(field.id, options)
                            }
                            formatOptionLabel={formatOptionLabel}
                            className="text-start"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
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

      <ToastContainer />
    </div>
  );
};

export default BMRProcessDetails;
