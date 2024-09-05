import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserVerificationPopUp from "../../../../../Components/UserVerificationPopUp/UserVerificationPopUp";

const AddFieldModal = ({
  closeModal,
  addField,
  bmr_tab_id,
  bmr_section_id,
  updateField,
  existingFieldData,
  bmr_field_id,
}) => {
  const { bmr_id } = useParams();

  const [fieldData, setFieldData] = useState({
    field_type: "select",
    isMandatory: false,
    label: "",
    placeholder: "",
    defaultValue: "",
    helpText: "",
    minValue: "",
    maxValue: "",
    order: "",
    isVisible: true,
    isRequired: false,
    isReadOnly: false,
    acceptsMultiple: [],
    selectedValues: [], // Manage selected values here
    bmr_tab_id: bmr_tab_id,
    bmr_section_id: bmr_section_id,
  });

  console.log(fieldData.acceptsMultiple,"hgdhfsdfjh")

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showGridColumnConfigModal, setShowGridColumnConfigModal] = useState(false);

  useEffect(() => {
    if (updateField === "edit-field" && existingFieldData) {
      setFieldData((prevData) => ({
        ...prevData,
        ...existingFieldData,
        selectedValues: existingFieldData.selectedValues || [],
      }));
      if (existingFieldData.field_type === "grid") {
        setFieldData((prevData) => ({
          ...prevData,
          acceptsMultiple: existingFieldData.acceptsMultiple,
        }));
      }
    }
  }, [existingFieldData, updateField]);

  const handleSave = () => {
    setShowVerificationModal(true);
  };

  const handleGridColumnConfigSave = () => {
    setFieldData((prevData) => ({
      ...prevData,
      acceptsMultiple: { ...prevData.acceptsMultiple },
    }));
    setShowGridColumnConfigModal(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFieldData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "field_type" && value === "grid") {
      setShowGridColumnConfigModal(true);
    }
  };

  
  const handleVerificationSubmit = async (verified) => {
    try {
      const response = await axios({
        method: updateField === "add-field" ? "post" : "put",
        url:
          updateField === "add-field"
            ? "http://https://bmrapi.mydemosoftware.com:7000/bmr-form/add-bmr-field"
            : `http://https://bmrapi.mydemosoftware.com:7000/bmr-form/edit-bmr-field/${bmr_field_id}`,
        data: { bmr_id, ...fieldData , 
          email:verified.email,
          password:verified.password,
          declaration:verified.declaration,
          acceptsMultiple: fieldData.field_type === "grid" ? fieldData.acceptsMultiple : fieldData.acceptsMultiple,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          "Content-Type": "application/json",
        },
      });
      addField({ bmr_id, ...fieldData });
      closeModal();
    } catch (error) {
      console.error("Error saving field:", error);
    }
  };

  const handleAddRow = () => {
    setFieldData((prevData) => ({
      ...prevData,
      acceptsMultiple: {
        ...prevData.acceptsMultiple,
        rows: [...prevData.acceptsMultiple.rows, {}],
      },
    }));
  };

  const handleGridChange = (rowIndex, columnName, value) => {
    setFieldData((prevData) => {
      const updatedRows = prevData.acceptsMultiple.rows.map((row, idx) =>
        idx === rowIndex ? { ...row, [columnName]: value } : row
      );
      return {
        ...prevData,
        acceptsMultiple: {
          ...prevData.acceptsMultiple,
          rows: updatedRows,
        },
      };
    });
  };

  const handleVerificationClose = () => {
    setShowVerificationModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-sm">
      <div
        className="bg-white p-4 rounded shadow-lg"
        style={{ width: "800px", height: "500px" }}
      >
        <h2 className="text-lg font-bold mb-2">
          {updateField === "add-field" ? "Add Field" : "Edit Field"}
        </h2>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <input
            type="text"
            name="label"
            placeholder="Label"
            value={fieldData.label}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
            style={{ border: "1px solid #ccc", padding: "8px", width: "100%" }}
          />
          <select
            name="field_type"
            value={fieldData.field_type}
            onChange={handleChange}
            className="border p-2 w-full mb-4"
            style={{ border: "1px solid #ccc", padding: "8px", width: "100%" }}
            placeholder="Field Type"
          >
            <option value="select">Select Field Type</option>
            <option value="text">Text</option>
            <option value="password">Password</option>
            <option value="email">Email</option>
            <option value="date">Date</option>
            <option value="date-time">Date&Time</option>
            <option value="grid">Grid</option>
            <option value="number">Number</option>
            <option value="checkbox">Checkbox</option>
            <option value="dropdown">Dropdown</option>
            <option value="grid">Grid</option>
            <option value="multi-select">Multi Select</option>
          </select>
          <input
            type="text"
            name="placeholder"
            placeholder="Placeholder"
            value={fieldData.placeholder}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
            style={{ border: "1px solid #ccc", padding: "8px", width: "100%" }}
          />
          <input
            type="text"
            name="defaultValue"
            placeholder="Default Value"
            value={fieldData.defaultValue}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
            style={{ border: "1px solid #ccc", padding: "8px", width: "100%" }}
          />
          <input
            type="text"
            name="helpText"
            placeholder="Help Text"
            value={fieldData.helpText}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
            style={{ border: "1px solid #ccc", padding: "8px", width: "100%" }}
          />
          <input
            type="number"
            name="minValue"
            placeholder="Min Value"
            value={fieldData.minValue}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
            style={{ border: "1px solid #ccc", padding: "8px", width: "100%" }}
          />
          <input
            type="number"
            name="maxValue"
            placeholder="Max Value"
            value={fieldData.maxValue}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
            style={{ border: "1px solid #ccc", padding: "8px", width: "100%" }}
          />
          <input
            type="number"
            name="order"
            placeholder="Order"
            value={fieldData.order}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
            style={{ border: "1px solid #ccc", padding: "8px", width: "100%" }}
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="isVisible"
              checked={fieldData.isVisible}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Is Visible</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="isRequired"
              checked={fieldData.isRequired}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Is Required</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="isReadOnly"
              checked={fieldData.isReadOnly}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Is Read Only</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="acceptsMultiple"
              checked={fieldData.acceptsMultiple.length > 0}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Accepts Multiple</label>
          </div>

          {(fieldData.field_type === "dropdown" ||
            fieldData.field_type === "multi-select") && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Options
              </h3>
              {fieldData.acceptsMultiple?.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="border border-gray-300 p-2 w-full mb-2"
                />
              ))}
              <button
                onClick={handleAddOption}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
              >
                Add Option
              </button>
            </div>
          )}
          {fieldData.field_type === "multi-select" && (
            <div>
              <select
                multiple
                className="border border-gray-600 p-2 w-full rounded"
                style={{ border: "1px solid gray", height: "100%" }}
                required={fieldData.isMandatory}
                onChange={handleSelectChange}
                value={fieldData.selectedValues}
              >
                {fieldData.acceptsMultiple?.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="mt-2">
                <strong>Selected: </strong>
                {fieldData.selectedValues.join(", ")}
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
          <button
            onClick={closeModal}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
      {showVerificationModal && (
        <UserVerificationPopUp
          onClose={handleVerificationClose}
          onSubmit={handleVerificationSubmit}
        />
      )}
         {showGridColumnConfigModal && (
          <GridColumnConfigModal
          columns={fieldData.acceptsMultiple}
            onSave={handleGridColumnConfigSave}
            onClose={() => setShowGridColumnConfigModal(false)}
          />
        )}
    </div>
  );
};

const GridColumnConfigModal = ({ onClose, onSave }) => {
  const [columns, setColumns] = useState([
    { name: "", type: "text", required: false, isDisabled: false },
  ]);

  const handleColumnChange = (index, field, value) => {
    const newColumns = [...columns];
    newColumns[index][field] = value;
    setColumns(newColumns);
  };

  const handleAddColumn = () => {
    setColumns([
      ...columns,
      { name: "", type: "text", required: false, isDisabled: false },
    ]);
  };

  const handleSave = () => {
    onSave(columns);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-sm">
      <div className="bg-white p-4 rounded shadow-lg w-[400px]">
        <h2 className="text-lg font-bold mb-2">Configure Grid Columns</h2>
        <div>
          {columns.map((column, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                placeholder="Column Name"
                value={column.name}
                onChange={(e) =>
                  handleColumnChange(index, "name", e.target.value)
                }
                className="border border-gray-300 p-2 w-full mb-2"
              />
              <select
                value={column.type}
                onChange={(e) =>
                  handleColumnChange(index, "type", e.target.value)
                }
                className="border p-2 w-full mb-2"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="checkbox">Checkbox</option>
              </select>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={column.required}
                  onChange={(e) =>
                    handleColumnChange(index, "required", e.target.checked)
                  }
                  className="mr-2"
                />
                <label>Required</label>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={column.isDisabled}
                  onChange={(e) =>
                    handleColumnChange(index, "isDisabled", e.target.checked)
                  }
                  className="mr-2"
                />
                <label>Disabled</label>
              </div>
            </div>
          ))}
          <button
            onClick={handleAddColumn}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
          >
            Add Column
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFieldModal;
