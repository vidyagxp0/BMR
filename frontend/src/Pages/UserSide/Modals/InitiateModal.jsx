import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcSearch } from "react-icons/fc";

const InitiateModal = ({ approvedBMR, onClose }) => {
  const [selectedBMR, setSelectedBMR] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleOpenRecordModal = (item) => {
    setSelectedBMR(item);
    navigate("/bmr_records", { state: { selectedBMR: item } });
  };

  const filteredBMR = approvedBMR.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl  flex flex-col overflow-hidden">
        <div className="flex justify-center gap-14 items-center p-5 bg-gradient-to-r from-[#207ec6] to-[#198ae0]">
          <h2 className="text-2xl font-bold text-white">Initiate BMR Record</h2>
          <button
            className="text-white text-2xl rounded-full p-2 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-4 relative flex justify-center items-center w-full" >
            <div className="relative w-[35%] rounded-lg shadow-lg" style={{border:"1px solid lightgray"}}>
              {/* <span className="absolute top-1/2 left-80 transform -translate-y-1/2 text-[20px] text-gray-500">
                <FcSearch />
              </span> */}
              <input
                type="text"
                placeholder="Search BMR Records..."
                className="w-full p-3 pl-10 rounded-lg  focus:ring-2 focus:ring-green-600 focus:p-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{border:"1px solid gray"}}
              />
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[50vh]">
            {filteredBMR.map((item, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-white hover:bg-blue-100 rounded-md cursor-pointer shadow-lg"
                onClick={() => handleOpenRecordModal(item)}
              >
                <button
                  className="text-gray-800 font-thin hover:font-extrabold "
                 
                >
                  • {item.name}
                </button>
              </div>
            ))}
            {filteredBMR.length === 0 && (
              <p className="text-center text-gray-500">No records found.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end p-4 bg-white border-t border-gray-200">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-blue-700 transition duration-500 focus:outline-none"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitiateModal;
