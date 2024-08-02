import React, { useEffect, useState } from 'react';
import AtmButton from '../../../../AtmComponents/AtmButton';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

 const AddTabModal = ({ closeModal, addTab }) => {
  const [tabName, setTabName] = useState("");
  const { bmr_id } = useParams();
  const handleSave = async () => {
    try {
      const response = await axios.post("http://192.168.1.24:7000/bmr/add-bmr-tab", 
        {
          bmr_id: bmr_id,
          tab_name: tabName
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      addTab(tabName);
      closeModal();
      console.log(response.data); 
    } catch (error) {
      console.error("Error adding tab:", error);
    }
  };

  useEffect(()=>{
    handleSave()
  },[])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-sm">
      <div className="bg-white p-4 rounded shadow-lg" style={{ width: '400px' }}>
        <h2 className="text-lg font-bold mb-4">Add Tab</h2>
        <input
          type="text"
          placeholder="Tab Name"
          value={tabName}
          onChange={(e) => setTabName(e.target.value)}
          className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500"
          style={{ border: '1px solid #ccc', padding: '8px', width: '100%' }}
        />
        <div className="flex justify-end space-x-2">
          <AtmButton label="Save" onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded" />
          <AtmButton label="Cancel" onClick={closeModal} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded" />
        </div>
      </div>
    </div>
  );
};

const AddFieldModal = ({ closeModal, addField }) => {
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [options, setOptions] = useState([""]); // Initialize with one empty option
  const [isMandatory, setIsMandatory] = useState(false); // New state for mandatory checkbox

  const handleSave = () => {
    addField({ fieldName, fieldType, options, isMandatory });
    closeModal();
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-sm">
      <div className="bg-white p-4 rounded shadow-lg" style={{ width: '500px', height: 'auto' }}>
        <h2 className="text-lg font-bold mb-2">Add Field</h2>
        <input
          type="text"
          placeholder="Field Name"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500 h-[48px] "
          style={{ border: '1px solid #ccc', padding: '8px', width: '100%' }}
        />
        <select
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value)}
          className="border p-2 w-full mb-4"
        >
          <option value="text">Text</option>
          <option value="password">Password</option>
          <option value="email">Email</option>
          <option value="date">Date</option>
          <option value="number">Number</option>
          <option value="checkbox">Checkbox</option>
          <option value="dropdown">Dropdown</option>
          <option value="multi-select">Multi Select</option>
        </select>
        {(fieldType === "dropdown" || fieldType === "multi-select") && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Options</h3>
            {options.map((option, index) => (
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
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isMandatory}
            onChange={() => setIsMandatory(!isMandatory)}
            className="mr-2"
          />
          <label>Mandatory</label>
        </div>
        <div className="flex justify-end space-x-2">
          <AtmButton label="Save" onClick={handleSave} className='bg-blue-500 hover:bg-blue-700 px-4 py-2' />
          <AtmButton label="Cancel" onClick={closeModal} className='bg-gray-500 hover:bg-gray-700 px-4 py-2' />
        </div>
      </div>
    </div>
  );
};

const BMRProcessDetails = () => {
  const [isAddTabModalOpen, setIsAddTabModalOpen] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [tabs, setTabs] = useState([
    "General Information",
    "Details",
    "Initiator Remarks",
    "Reviewer Remarks",
    "Approver Remarks"
  ]);
  const [flowoTabs, setFlowoTabs] = useState([
    "Initiator",
    "Reviewer",
    "Approver",

  ]);

  const [newTab, setNewtab] = useState([])
  const [newFields, setNewFields] = useState([])
  const [fields, setFields] = useState({
    "General Information": [
      { fieldName: "Initiator", fieldType: "text", options: [], isMandatory: false },
      { fieldName: "Date of Initiation", fieldType: "date", options: [], isMandatory: false },
      { fieldName: "Description", fieldType: "text", options: [], isMandatory: true },
      { fieldName: "Status", fieldType: "dropdown", options: ["Pending", "Completed"], isMandatory: false },
    ],
    "Details": [
      { fieldName: "Department", fieldType: "text", options: [], isMandatory: false },
      { fieldName: "Compression Area with respect to Corridor", fieldType: "text", options: [], isMandatory: false },
      { fieldName: "Limit", fieldType: "number", options: [], isMandatory: false },
    ],
    "Initiator Remarks": [],
    "Reviewer Remarks": [],
    "Approver Remarks": [],
  });
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [showForm, setShowForm] = useState("default");
  
  const navigate = useNavigate();

  const addTab = (tabName) => {
    if (!newTab.includes(tabName)) {
      // Add the new tab and initialize its fields
      setNewtab([...newTab, tabName]);
      setNewFields({ ...newFields, [tabName]: [] });
    }
  };

  const addField = (field) => {
    // Add the new field to the active tab
    setNewFields({
      ...newFields,
      [activeTab]: [...newFields[activeTab], field],
    });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const isLastTab = activeTab === tabs[tabs.length - 1];
  const isFirstTab = activeTab === tabs[0];

  

  return (
    <div className="p-4 relative h-full">
      <header className='bg-gray-200 w-full shadow-lg flex justify-between items-center p-4 mb-4'>
        <p className="text-lg font-bold">BMR Process Details</p>
        <div className="flex space-x-2">
          {showForm === "default" ? (
            <>
              <AtmButton label="Edit Form" onClick={() => setShowForm("sendForm")} className='bg-blue-500 hover:bg-blue-700 px-4 py-2' />
            </>
          ) : showForm === "sendForm" ? (
            <>
              <AtmButton label="Add Tab" onClick={() => setIsAddTabModalOpen(true)} className='bg-pink-950 hover:bg-pink-700 px-4 py-2' />
              <AtmButton label="Add Field" onClick={() => setIsAddFieldModalOpen(true)} className='bg-green-950 hover:bg-green-700 px-4 py-2' />
              <AtmButton label="Back to Default" onClick={() => setShowForm("default")} className='bg-gray-500 hover:bg-gray-700 px-4 py-2' />
            </>
          ) : (
            <AtmButton label="Back to Default" onClick={() => setShowForm("default")} className='bg-gray-500 hover:bg-gray-700 px-4 py-2' />
          )}
        </div>
      </header>
      {showForm === "default" && (
        <div className="flex gap-4 mb-4">
          {flowoTabs.map((tab, index) => (
            <button
              style={{ border: "1px solid gray" }}
              key={index}
              onClick={() => handleTabClick(tab)}
              className={`py-2 px-4 rounded-full border-2 border-black ${activeTab === tab ? 'bg-gray-400 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {showForm === "default" && (
        <div className="flex gap-4 mb-4">
          {tabs.map((tab, index) => (
            <button
              style={{ border: "1px solid gray" }}
              key={index}
              onClick={() => handleTabClick(tab)}
              className={`py-2 px-4 rounded-full border-2 border-black ${activeTab === tab ? 'bg-gray-400 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
      {showForm === "sendForm" && (
        <div className="flex gap-4 mb-4">
          {newTab.map((tab, index) => (
            <button
              style={{ border: "1px solid gray" }}
              key={index}
              onClick={() => handleTabClick(tab)}
              className={`py-2 px-4 rounded-full border-2 border-black ${activeTab === tab ? 'bg-gray-400 text-white' : 'bg-white text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {showForm === "default" && fields[activeTab]?.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {fields[activeTab].map((field, index) => (
            <div key={index} className="p-4 rounded bg-white shadow border border-gray-300">
              <label className="block text-lg font-extrabold text-gray-700 mb-2">{field.fieldName}{field.isMandatory && ' *'}</label>
              {/* Render input fields based on type */}
              {field.fieldType === "text" && <input style={{ border: "1px solid gray", height: "48px" }} type="text" className="border border-gray-600 p-2 w-full rounded" required={field.isMandatory} />}
              {field.fieldType === "password" && <input style={{ border: "1px solid gray", height: "48px" }} type="password" className="border border-gray-600 p-2 w-full rounded" required={field.isMandatory} />}
              {field.fieldType === "date" && <input style={{ border: "1px solid gray", height: "48px" }} type="date" className="border border-gray-600 p-2 w-full rounded" required={field.isMandatory} />}
              {field.fieldType === "email" && <input style={{ border: "1px solid gray", height: "48px" }} type="email" className="border border-gray-600 p-2 w-full rounded" required={field.isMandatory} />}
              {field.fieldType === "number" && <input style={{ border: "1px solid gray", height: "48px" }} type="number" className="border border-gray-600 p-2 w-full rounded" required={field.isMandatory} />}
              {field.fieldType === "checkbox" && <input style={{ border: "1px solid gray", height: "48px" }} type="checkbox" className="border border-gray-600 p-2 rounded" required={field.isMandatory} />}
              {field.fieldType === "dropdown" && (
                <select className="border border-gray-600 p-2 w-full rounded" style={{ border: "1px solid gray", height: "48px" }} required={field.isMandatory}>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              )}
              {field.fieldType === "multi-select" && (
                <select multiple className="border border-gray-600 p-2 w-full rounded" style={{ border: "1px solid gray", height: "48px" }} required={field.isMandatory}>
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm === "sendForm" && newFields[activeTab] && (
        <div className="grid grid-cols-2 gap-4">
          {newFields[activeTab].map((field, index) => (
            <div key={index} className="p-4 rounded bg-white shadow border border-gray-300">
              <label className="block text-lg font-extrabold text-gray-700 mb-2">{field.fieldName}{field.isMandatory && ' *'}</label>
              {/* Render input fields based on type */}
              {field.fieldType === "text" && <input style={{ border: "1px solid gray", height: "48px" }} type="text" className="border border-gray-600 p-2 w-full rounded" required={field.isMandatory} />}
              {field.fieldType === "password" && <input style={{ border: "1px solid gray", height: "48px" }} type="password" className="border border-gray-600 p-2 w-full rounded" required={field.isMandatory} />}
              {field.fieldType === "date" && <input style={{ border: "1px solid gray", height: "48px" }} type="date" className="border border-gray-600 p-2 w-full rounded" required={field.isMandatory} />}
              {field.fieldType === "email" && <input style={{ border: "1px solid gray", height: "48px" }} type="email" className="border border-gray-600 p-2 w-full rounded" required={field.isMandatory} />}
              {field.fieldType === "number" && <input style={{ border: "1px solid gray", height: "48px" }} type="number" className="border border-gray-600 p-2 w-full rounded" required={field.isMandatory} />}
              {field.fieldType === "checkbox" && <input style={{ border: "1px solid gray", height: "48px" }} type="checkbox" className="border border-gray-600 p-2 rounded" required={field.isMandatory} />}
              {field.fieldType === "dropdown" && (
                <select className="border border-gray-600 p-2 w-full rounded" style={{ border: "1px solid gray", height: "48px" }} required={field.isMandatory}>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              )}
              {field.fieldType === "multi-select" && (
                <select multiple className="border border-gray-600 p-2 w-full rounded" style={{ border: "1px solid gray", height: "48px" }} required={field.isMandatory}>
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      {isAddTabModalOpen && <AddTabModal closeModal={() => setIsAddTabModalOpen(false)} addTab={addTab} />}
      {isAddFieldModalOpen && <AddFieldModal closeModal={() => setIsAddFieldModalOpen(false)} addField={addField} />}

      {showForm && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <AtmButton label="Save" onClick={() => { }} className='bg-blue-500 hover:bg-blue-700 px-4 py-2' />
          {!isLastTab && <AtmButton label="Next" onClick={handleNext} className='bg-blue-500 hover:bg-blue-700 px-4 py-2' />}
          {!isFirstTab && <AtmButton label="Back" onClick={handleBack} className='bg-blue-500 hover:bg-blue-700 px-4 py-2' />}
          <AtmButton label="Exit" onClick={() => { navigate("/dashboard") }} className='bg-gray-500 hover:bg-gray-700 px-4 py-2' />
        </div>
      )}
    </div>
  );
};


export default BMRProcessDetails;
