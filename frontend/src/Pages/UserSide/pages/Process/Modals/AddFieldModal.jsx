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
    acceptsMultiple: { columns: [], rows: [] },
    selectedValues: [], // Manage selected values here
    bmr_tab_id: bmr_tab_id,
    bmr_section_id: bmr_section_id,
  });
  // console.log(fieldData, "datasaaaa");

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showGridColumnConfigModal, setShowGridColumnConfigModal] =
    useState(false);
  // console.log(fieldData.acceptsMultiple.columns, "<><><><><>");

  useEffect(() => {
    if (updateField === "edit-field" && existingFieldData) {
      setFieldData((prevData) => ({
        ...prevData,
        ...existingFieldData,
        selectedValues: existingFieldData.selectedValues || [],
        acceptsMultiple: existingFieldData.acceptsMultiple || {
          columns: [],
          rows: [],
        }, // Ensure proper structure when editing
      }));
    }
  }, [existingFieldData, updateField]);

  const handleSave = () => {
    setShowVerificationModal(true);
  };

  const handleGridColumnConfigSave = (columns) => {
    setFieldData((prevData) => ({
      ...prevData,
      acceptsMultiple: { ...prevData.acceptsMultiple, columns },
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

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFieldData((prevData) => ({
      ...prevData,
      selectedValues: selectedOptions,
    }));
  };

  const handleVerificationSubmit = async (verified) => {
    try {
      const response = await axios({
        method: updateField === "add-field" ? "post" : "put",
        url:
          updateField === "add-field"
            ? "https://bmrapi.mydemosoftware.com/bmr-form/add-bmr-field"
            : `https://bmrapi.mydemosoftware.com/bmr-form/edit-bmr-field/${bmr_field_id}`,
        data: {
          bmr_id,
          ...fieldData,
          email: verified.email,
          password: verified.password,
          declaration: verified.declaration,
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

  const handleOptionChange = (index, value) => {
    const newOptions = [...fieldData.acceptsMultiple];
    newOptions[index] = value;
    setFieldData((prevData) => ({
      ...prevData,
      acceptsMultiple: newOptions,
    }));
  };

  const handleAddOption = () => {
    setFieldData((prevData) => ({
      ...prevData,
      acceptsMultiple: [...prevData.acceptsMultiple, ""],
    }));
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
          {fieldData.field_type === "grid" && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Grid Columns
              </h3>
              {fieldData?.acceptsMultiple?.columns?.length > 0 ? (
                <table className="w-full border border-gray-300">
                  <thead>
                    <tr>
                      {fieldData.acceptsMultiple.columns.map((col, idx) => (
                        <th key={idx} className="border border-gray-300 p-2">
                          {col.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fieldData?.acceptsMultiple?.rows?.map((_, rowIdx) => (
                      <tr key={rowIdx}>
                        {fieldData?.acceptsMultiple?.columns.map(
                          (_, colIdx) => (
                            <td
                              key={colIdx}
                              className="border border-gray-300 p-2"
                            ></td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No columns available.</p>
              )}
            </div>
          )}

          {fieldData.field_type !== "grid" && (
            <>
              <input
                type="text"
                name="placeholder"
                placeholder="Placeholder"
                value={fieldData.placeholder}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  width: "100%",
                }}
              />
              <input
                type="text"
                name="defaultValue"
                placeholder="Default Value"
                value={fieldData.defaultValue}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  width: "100%",
                }}
              />
              <input
                type="text"
                name="helpText"
                placeholder="Help Text"
                value={fieldData.helpText}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  width: "100%",
                }}
              />

              <input
                type="number"
                name="minValue"
                placeholder="Min Value"
                value={fieldData.minValue}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  width: "100%",
                }}
              />
              <input
                type="number"
                name="maxValue"
                placeholder="Max Value"
                value={fieldData.maxValue}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  width: "100%",
                }}
              />
              <input
                type="number"
                name="order"
                placeholder="Order"
                value={fieldData.order}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  width: "100%",
                }}
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
                  {fieldData.acceptsMultiple?.rows?.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
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
            </>
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
          columns={fieldData.acceptsMultiple.columns}
          onSave={handleGridColumnConfigSave}
          onClose={() => setShowGridColumnConfigModal(false)}
        />
      )}
    </div>
  );
};

const GridColumnConfigModal = ({ columns = [], onClose, onSave }) => {
  const [columnConfig, setColumnConfig] = useState(columns);

  const handleColumnChange = (index, field, value) => {
    const newConfig = [...columnConfig];
    newConfig[index] = { ...newConfig[index], [field]: value };
    setColumnConfig(newConfig);
  };

  const handleAddColumn = () => {
    setColumnConfig([
      ...columnConfig,
      { name: "", isRequired: false, isVisible: true },
    ]);
  };

  const handleRemoveColumn = (index) => {
    const newConfig = columnConfig.filter((_, colIndex) => colIndex !== index);
    setColumnConfig(newConfig);
  };

  const handleSave = () => {
    onSave(columnConfig);
  };

  return (
    <div className="fixed  inset-0 flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-sm">
      <div
        className="bg-white p-4 rounded shadow-lg"
        style={{ width: "600px", maxHeight: "600px", overflowY: "auto" }}
      >
        <h2 className="text-lg font-bold mb-2">Configure Columns</h2>
        <div>
          {columnConfig?.map((col, index) => (
            <div key={index} className="mb-2">
              <div className=" items-center mb-2">
                <input
                  type="text"
                  value={col.name}
                  onChange={(e) =>
                    handleColumnChange(index, "name", e.target.value)
                  }
                  className="border border-gray-300 p-2 w-full mr-2 mb-3"
                  placeholder="Column Name"
                  style={{ border: "1px solid gray" }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveColumn(index)}
                  className="border p-2 bg-red-500 text-white"
                >
                  Remove
                </button>
                <>
                  <input
                    type="text"
                    name="placeholder"
                    placeholder="Placeholder"
                    value={col.placeholder}
                    onChange={(e) =>
                      handleColumnChange(index, "placeholder", e.target.value)
                    }
                    className="border border-gray-300 p-2 mt-4 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      width: "100%",
                    }}
                  />
                  <input
                    type="text"
                    name="defaultValue"
                    placeholder="Default Value"
                    value={col.defaultValue}
                    onChange={(e) =>
                      handleColumnChange(index, "defaultValue", e.target.value)
                    }
                    className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      width: "100%",
                    }}
                  />

                  <input
                    type="text"
                    name="helpText"
                    placeholder="Help Text"
                    value={col.helpText}
                    onChange={(e) =>
                      handleColumnChange(index, "helpText", e.target.value)
                    }
                    className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      width: "100%",
                    }}
                  />

                  <input
                    type="number"
                    name="minValue"
                    placeholder="Min Value"
                    value={col.minValue}
                    onChange={(e) =>
                      handleColumnChange(index, "minValue", e.target.value)
                    }
                    className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      width: "100%",
                    }}
                  />
                  <input
                    type="number"
                    name="maxValue"
                    placeholder="Max Value"
                    value={col.maxValue}
                    onChange={(e) =>
                      handleColumnChange(index, "maxValue", e.target.value)
                    }
                    className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      width: "100%",
                    }}
                  />
                  <input
                    type="number"
                    name="order"
                    placeholder="Order"
                    value={col.order}
                    onChange={(e) =>
                      handleColumnChange(index, "order", e.target.value)
                    }
                    className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px]"
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      width: "100%",
                    }}
                  />
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="isVisible"
                      value={col.isVisible}
                      onChange={(e) =>
                        handleColumnChange(index, "isVisible", e.target.checked)
                      }
                      className="mr-2"
                    />
                    <label>Is Visible</label>
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="isRequired"
                      value={col.isRequired}
                      onChange={(e) =>
                        handleColumnChange(
                          index,
                          "isRequired",
                          e.target.checked
                        )
                      }
                      className="mr-2"
                    />
                    <label>Is Required</label>
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="isReadOnly"
                      value={col.isReadOnly}
                      onChange={(e) =>
                        handleColumnChange(
                          index,
                          "IsReadOnly",
                          e.target.checked
                        )
                      }
                      className="mr-2"
                    />
                    <label>Is Read Only</label>
                  </div>
                </>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddColumn}
          className="border p-2 bg-green-500 text-white mt-2"
        >
          Add Column
        </button>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="border p-2 bg-blue-500 text-white mr-2"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border p-2 bg-red-500 text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFieldModal;
