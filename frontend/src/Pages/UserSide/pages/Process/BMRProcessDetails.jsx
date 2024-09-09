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
import UserVerificationPopUp from "../../../../Components/UserVerificationPopUp/UserVerificationPopUp";
import { FaRegFilePdf } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { IoIosCreate } from "react-icons/io";
import { AiOutlineAudit } from "react-icons/ai";
import { DeleteIcon } from "../../../../Components/Icons/Icon";

const BMRProcessDetails = ({ bmrFields }) => {
  const [data, setData] = useState([]);
  const [isAddTabModalOpen, setIsAddTabModalOpen] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  // console.log(bmrFields, "0000000000000000000000000");
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
  // console.log(section, "sectionnnnnnnnnnnnnnnnn");
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
  console.log(fields,"fieldssssssssssssssss")

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

  const renderTable = (field) => {
    if (
      field.field_type === "grid" &&
      field.acceptsMultiple.columns.length > 0
    ) {
      return (
        <div key={field.label}>
          <h3>{field.label}</h3>
          <table className="table-auto w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                {field.acceptsMultiple.columns.map((column, index) => (
                  <th key={index} className="border border-gray-300 p-2">
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {field.acceptsMultiple.rows.length > 0 ? (
                field.acceptsMultiple.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {field.acceptsMultiple.columns.map((column, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 p-2">
                        {row[column.name]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={field.acceptsMultiple.columns.length}
                    className="border border-gray-300 p-2 text-center"
                  >
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }
  };

  const handleAddRow = (tabName) => {
    setFields((prevFields) => {
      const updatedFields = { ...prevFields };
      const field = updatedFields[tabName].find(
        (fld) => fld.field_type === "grid"
      );

      if (field) {
        const newRow = field.acceptsMultiple.columns.reduce((acc, column) => {
          acc[column.name] = "";
          return acc;
        }, {});
        field.gridData.push(newRow);
      }
      return updatedFields;
    });
  };

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

  const renderGridTable = (tabName) => {
    const field = fields[tabName]?.find((fld) => fld.field_type === "grid");
    if (!field) return null;

    return (
      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {field.acceptsMultiple.columns.map((column, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.name}
                </th>
              ))}
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {field.gridData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {field.acceptsMultiple.columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={row[column.name] || ""}
                      onChange={(e) =>
                        handleGridChange(
                          tabName,
                          rowIndex,
                          column.name,
                          e.target.value
                        )
                      }
                      className="border border-gray-300 p-2 w-full"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => handleAddRow(tabName)}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Row
        </button>
      </div>
    );
  };

  const userDetails = JSON.parse(localStorage.getItem("user-details"));
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
  const formatOptionLabel = (option) => <div>{option.label}</div>;
  const fetchBMRData = () => {
    axios
      .get(`https://bmrapi.mydemosoftware.com/bmr-form/get-a-bmr/${bmr_id}`, {
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
        .put(
          "https://bmrapi.mydemosoftware.com/bmr-form/send-BMR-for-review",
          dataObject,
          config
        )
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
          "https://bmrapi.mydemosoftware.com/bmr-form/send-BMR-from-review-to-approval",
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
          "https://bmrapi.mydemosoftware.com/bmr-form/send-BMR-from-review-to-open",
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
        .put(
          "https://bmrapi.mydemosoftware.com/bmr-form/approve-BMR",
          dataObject,
          config
        )
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
          "https://bmrapi.mydemosoftware.com/bmr-form/send-BMR-from-approval-to-open",
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

  async function generateReport() {
    // Create the confirmation popup container
    const confirmationContainer = document.createElement("div");
    confirmationContainer.style.position = "fixed";
    confirmationContainer.style.top = "20px"; // Adjusted top position
    confirmationContainer.style.left = "50%";
    confirmationContainer.style.transform = "translate(-50%, 0)";
    confirmationContainer.style.backgroundColor = "#ffffff";
    confirmationContainer.style.border = "1px solid #ccc";
    confirmationContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    confirmationContainer.style.padding = "20px";
    confirmationContainer.style.borderRadius = "5px";
    confirmationContainer.style.zIndex = "1000";
    confirmationContainer.style.width = "300px";

    // Create the confirmation message
    const confirmationMessage = document.createElement("div");
    confirmationMessage.textContent =
      "Are you sure you want to generate the PDF?";
    confirmationMessage.style.fontSize = "16px";
    confirmationMessage.style.marginBottom = "15px";

    // Create the buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.textAlign = "center";

    // Create the confirm button
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    confirmButton.style.padding = "10px 20px";
    confirmButton.style.margin = "0 10px";
    confirmButton.style.cursor = "pointer";
    confirmButton.style.border = "none";
    confirmButton.style.borderRadius = "5px";
    confirmButton.style.backgroundColor = "#4CAF50";
    confirmButton.style.color = "white";
    confirmButton.style.fontSize = "14px";

    // Create the cancel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.padding = "10px 20px";
    cancelButton.style.margin = "0 10px";
    cancelButton.style.cursor = "pointer";
    cancelButton.style.border = "none";
    cancelButton.style.borderRadius = "5px";
    cancelButton.style.backgroundColor = "#f44336";
    cancelButton.style.color = "white";
    cancelButton.style.fontSize = "14px";

    // Append buttons to the buttons container
    buttonsContainer.appendChild(confirmButton);
    buttonsContainer.appendChild(cancelButton);

    // Append message and buttons to the confirmation container
    confirmationContainer.appendChild(confirmationMessage);
    confirmationContainer.appendChild(buttonsContainer);

    // Append the confirmation container to the document body
    document.body.appendChild(confirmationContainer);

    // Add event listener to the confirm button
    confirmButton.addEventListener("click", async () => {
      try {
        // Close the confirmation popup
        confirmationContainer.remove();

        // Make API request to generate PDF
        const response = await axios({
          url: "https://bmrapi.mydemosoftware.com/bmr-form/generate-report",
          method: "POST",
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
          data: {
            reportData: data[0],
          },
        });

        // Create a blob URL for the PDF content
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create an anchor element to trigger the download
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `BMRform${data[0].bmr_id}.pdf`;
        document.body.appendChild(a);
        a.click();

        // Clean up the blob URL
        window.URL.revokeObjectURL(url);

        // Display success message as styled popup
        const successMessage = document.createElement("div");
        successMessage.textContent = "PDF generated successfully!";
        successMessage.style.position = "fixed";
        successMessage.style.top = "20px";
        successMessage.style.left = "50%";
        successMessage.style.transform = "translateX(-50%)";
        successMessage.style.backgroundColor =
          "rgba(76, 175, 80, 0.8)"; /* Green for success */
        successMessage.style.color = "white";
        successMessage.style.padding = "15px";
        successMessage.style.borderRadius = "5px";
        successMessage.style.zIndex = "1000";
        successMessage.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
        successMessage.style.fontSize = "14px";
        document.body.appendChild(successMessage);

        // Remove the success message after 3 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
      } catch (error) {
        console.error("Error:", error);
        // Display error message as styled popup
        const errorMessage = document.createElement("div");
        errorMessage.textContent =
          "Failed to generate PDF. Please try again later.";
        errorMessage.style.position = "fixed";
        errorMessage.style.top = "20px";
        errorMessage.style.left = "50%";
        errorMessage.style.transform = "translateX(-50%)";
        errorMessage.style.backgroundColor =
          "rgba(244, 67, 54, 0.8)"; /* Red for error */
        errorMessage.style.color = "white";
        errorMessage.style.padding = "15px";
        errorMessage.style.borderRadius = "5px";
        errorMessage.style.zIndex = "1000";
        errorMessage.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
        errorMessage.style.fontSize = "14px";
        document.body.appendChild(errorMessage);

        // Remove the error message after 3 seconds
        setTimeout(() => {
          errorMessage.remove();
        }, 3000);
      }
    });

    // Add event listener to the cancel button
    cancelButton.addEventListener("click", () => {
      // Close the confirmation popup
      confirmationContainer.remove();

      // Display cancel message as styled popup
      const cancelMessage = document.createElement("div");
      cancelMessage.textContent = "PDF generation canceled.";
      cancelMessage.style.position = "fixed";
      cancelMessage.style.top = "20px";
      cancelMessage.style.left = "50%";
      cancelMessage.style.transform = "translateX(-50%)";
      cancelMessage.style.backgroundColor =
        "rgba(183, 28, 28, 0.8)"; /* Dark red for cancel */
      cancelMessage.style.color = "white";
      cancelMessage.style.padding = "15px";
      cancelMessage.style.borderRadius = "5px";
      cancelMessage.style.zIndex = "1000";
      cancelMessage.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
      cancelMessage.style.fontSize = "14px";
      document.body.appendChild(cancelMessage);

      // Remove the cancel message after 3 seconds
      setTimeout(() => {
        cancelMessage.remove();
      }, 3000);
    });
  }

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

  return (
    <div className="p-4 relative h-full">
      <header className="bg-green-200 w-full shadow-lg flex justify-between items-center p-4 mb-4">
        <p className="text-lg font-bold">BMR Process Details</p>
        <div className="flex space-x-2">
          {showForm === "default" ? (
            <>
              <Tooltip title="Audit Trail">
                <IconButton>
                  <AiOutlineAudit
                    size={28}
                    className="flex justify-center items-center cursor-pointer "
                    onClick={() => {
                      navigate("/audit-trail", { state: data[0] });
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Generate PDF">
                <IconButton>
                  <FaRegFilePdf
                    size={28}
                    className="flex justify-center items-center cursor-pointer "
                    onClick={() => {
                      generateReport();
                    }}
                  />
                </IconButton>
              </Tooltip>

              {activeFlowTab === "INITIATION" && (
                <>
                  <Tooltip title="Create Form">
                    <IconButton>
                      <IoIosCreate
                        size={28}
                        className="flex justify-center items-center cursor-pointer "
                        onClick={() => setShowForm("sendForm")}
                      />
                    </IconButton>
                  </Tooltip>
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
              className={`py-2 px-4 rounded border-2 border-black ${
                activeFlowTab === tab ? "bg-[#6beeac]  " : "bg-[#8dccac]  "
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
              className={`py-2 px-4 rounded border-2 border-black ${
                activeDefaultTab === tab
                  ? "bg-[#6beeac] hover:bg-[#0a6249] hover:text-[#4bf6c6]"
                  : "bg-[#8dccac] hover:bg-[#0a6249] hover:text-[#4bf6c6]"
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
        <div className="relative h-screen ">
          <div className="overflow-auto border border-gray-500 p-6 mb-16">
            {activeDefaultTab === "Initiator Remarks" &&
              fields["Initiator Remarks"]?.length > 0 && (
                <div className="mb-20">
                  <div className="grid grid-cols-2 gap-4  ">
                    {fields["Initiator Remarks"].map((field, index) => (
                      <div
                        key={index}
                        className="p-4 flex flex-col bg-white rounded-2xl shadow-lg border border-gray-300 mb-4"
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
                <div key={secIndex} className="mb-20">
                  <div className="col-span-3 p-4 mt-4 rounded bg-gray-100 mb-5 font-semibold text-gray-700 border border-gray-300">
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
          <div className="fixed bottom-0 left-0 w-full bg-white border-gray-300 p-4 flex justify-end gap-5">
            {data[0]?.stage === 1 &&
              data[0]?.initiator === userDetails.userId && (
                <AtmButton
                  label={"Send For Review"}
                  className="bg-blue-500 hover:bg-blue-700 p-2"
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
                    className="bg-blue-500 hover:bg-blue-700 p-2"
                    onClick={() => {
                      setIsPopupOpen(true);
                      setPopupAction("sendFromReviewToApproval"); // Set the action when opening the popup
                    }}
                  />
                  <AtmButton
                    label={"Open BMR"}
                    className="bg-blue-500 hover:bg-blue-700 p-2"
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
                    className="bg-blue-500 hover:bg-blue-700 p-2"
                    onClick={() => {
                      setIsPopupOpen(true);
                      setPopupAction("sendFromApprovalToApproved"); // Set the action when opening the popup
                    }}
                  />
                  <AtmButton
                    label={"Open BMR"}
                    className="bg-blue-500 hover:bg-blue-700 p-2"
                    onClick={() => {
                      setIsPopupOpen(true);
                      setPopupAction("sendFromApprovalToOpen"); // Set the action when opening the popup
                    }}
                  />
                </>
              )
            ) : null}
            <AtmButton
              label={"Exit"}
              onClick={() => {
                navigate(-1);
              }}
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
                  <div className="grid grid-cols-2 shadow-xl gap-4 px-5 py-[64px]">
                    {section.BMR_fields?.map((field, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => handleFieldClick(field)}
                          className="p-4 rounded bg-gray-50 shadow border border-gray-600"
                        >
                          <label className="text-lg font-extrabold text-gray-900 flex gap-1 mb-2">
                            {field.label}
                            <div className="text-red-500">
                              {field.isMandatory && " *"}
                            </div>
                          </label>

                          {/* Render input fields based on type */}

                          {field.field_type === "text" && (
                            <>
                              <div className="relative">
                                <div
                                  className="absolute border w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center left-[90%] bottom-16"
                                  style={{ padding: "5px" }}
                                >
                                  <Tooltip
                                    title="react developer "
                                    placement="bottom-start"
                                  >
                                    <div className="text-gray-50 text-lg">
                                      i
                                    </div>
                                  </Tooltip>
                                </div>
                                <input
                                  placeholder={field.placeholder}
                                  style={{
                                    border: "1px solid gray",
                                    height: "48px",
                                  }}
                                  type="text"
                                  className="border border-gray-600 p-2 w-full rounded"
                                  required={field.isMandatory}
                                  readOnly={field.isReadonly}
                                />
                              </div>
                            </>
                          )}

                          {field.field_type === "grid" && (
                            <div className="relative">
                              <div
                                className="absolute border w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center left-[90%] bottom-16"
                                style={{ padding: "5px" }}
                              >
                                <Tooltip
                                  title="react developer "
                                  placement="right-start"
                                >
                                  <div className="text-gray-50 text-lg">i</div>
                                </Tooltip>
                              </div>
                              <table className="table-auto w-full border border-gray-600 mb-4">
                                <thead>
                                  <tr>
                                    {field?.acceptsMultiple?.columns?.map(
                                      (column, idx) => {
                                        console.log(column, "columns");
                                        return (
                                          <th
                                            key={idx}
                                            className="border border-gray-600 p-2"
                                          >
                                            {column}
                                          </th>
                                        );
                                      }
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {field?.gridData?.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                      {field?.acceptsMultiple?.columns?.map(
                                        (column, colIdx) => (
                                          <td
                                            key={colIdx}
                                            className="border border-gray-600 p-2"
                                          >
                                            <input
                                              type="text"
                                              placeholder={column.placeholder}
                                              value={row[column.name] || ""}
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
                                  ))}
                                </tbody>
                              </table>
                              <button
                                onClick={() => handleAddRow(activeDefaultTab)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                              >
                                Add Row
                              </button>
                            </div>
                          )}

                          {field.field_type === "password" && (
                            <div className="relative">
                              <div
                                className="absolute border w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center left-[90%] bottom-16"
                                style={{ padding: "5px" }}
                              >
                                <Tooltip
                                  title="react developer "
                                  placement="right-start"
                                >
                                  <div className="text-gray-50 text-lg">i</div>
                                </Tooltip>
                              </div>
                              <input
                                placeholder={field.placeholder}
                                style={{
                                  border: "1px solid gray",
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
                              <div
                                className="absolute border w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center left-[90%] bottom-16"
                                style={{ padding: "5px" }}
                              >
                                <Tooltip
                                  title="react developer "
                                  placement="right-start"
                                >
                                  <div className="text-gray-50 text-lg">i</div>
                                </Tooltip>
                              </div>
                              <input
                                placeholder={field.placeholder}
                                style={{
                                  border: "1px solid gray",
                                  height: "48px",
                                }}
                                type="date"
                                className="border border-gray-600 p-2 w-full rounded"
                                required={field.isMandatory}
                                readOnly={field.isReadonly}
                              />
                            </div>
                          )}

                          {field.field_type === "email" && (
                            <div className="relative">
                              <div
                                className="absolute border w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center left-[90%] bottom-16"
                                style={{ padding: "5px" }}
                              >
                                <Tooltip
                                  title="react developer "
                                  placement="right-start"
                                >
                                  <div className="text-gray-50 text-lg">i</div>
                                </Tooltip>
                              </div>
                              <input
                                placeholder={field.placeholder}
                                style={{
                                  border: "1px solid gray",
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
                              <div
                                className="absolute border w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center left-[90%] bottom-16"
                                style={{ padding: "5px" }}
                              >
                                <Tooltip
                                  title="react developer "
                                  placement="right-start"
                                >
                                  <div className="text-gray-50 text-lg">i</div>
                                </Tooltip>
                              </div>
                              <input
                                placeholder={field.placeholder}
                                style={{
                                  border: "1px solid gray",
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
                              <div
                                className="absolute border w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center left-[90%] bottom-16"
                                style={{ padding: "5px" }}
                              >
                                <Tooltip
                                  title="react developer "
                                  placement="right-start"
                                >
                                  <div className="text-gray-50 text-lg">i</div>
                                </Tooltip>
                              </div>
                              <input
                                placeholder={field.placeholder}
                                style={{
                                  border: "1px solid gray",
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
                              <div
                                className="absolute border w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center left-[90%] bottom-16"
                                style={{ padding: "5px" }}
                              >
                                <Tooltip
                                  title="react developer "
                                  placement="right-start"
                                >
                                  <div className="text-gray-50 text-lg">i</div>
                                </Tooltip>
                              </div>
                              <select
                                className="border border-gray-600 p-2 w-full rounded"
                                style={{
                                  border: "1px solid gray",
                                  height: "48px",
                                }}
                                required={field.isMandatory}
                              >
                                {field?.acceptsMultiple?.map((option, idx) => (
                                  <option key={idx} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {field.field_type === "multi-select" && (
                            <div className="relative">
                              <div
                                className="absolute border w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center left-[90%] bottom-16"
                                style={{ padding: "5px" }}
                              >
                                <Tooltip
                                  title="react developer "
                                  placement="right-start"
                                >
                                  <div className="text-gray-50 text-lg">i</div>
                                </Tooltip>
                              </div>
                              <>
                                <Select
                                  isMulti
                                  options={field?.acceptsMultiple?.map(
                                    (option) => ({
                                      value: option,
                                      label: option,
                                    })
                                  )}
                                  value={selectedOptions[field.id] || []}
                                  onChange={(options) =>
                                    handleMultiSelectChange(field.id, options)
                                  }
                                  formatOptionLabel={formatOptionLabel}
                                  className="text-start"
                                />
                              </>
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
  );
};

export default BMRProcessDetails;
