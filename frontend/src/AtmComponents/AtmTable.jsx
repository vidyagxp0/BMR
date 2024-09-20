import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AtmTable = ({ columns = [], data = [], rowsPerPage = 9 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const navigate = useNavigate();

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBMRClick = (row) => {
    navigate(`/details/${row.id}`);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex flex-col h-full pt-4">
      <div className="flex-grow overflow-x-auto mb-16">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-300 bg-[#2a323e]">
                Sr No
              </th>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-300 bg-[#2a323e]"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row, rowIndex) => (
            <tr
            key={rowIndex}
            style={{
              backgroundColor: rowIndex % 2 === 0 ? "#fafbfc" : "#cad2de", // Softer Gray for even rows, Softer Blue for odd rows
            }}
            className="border-b border-gray-300"
          >
            <td
              className={`px-4 py-2 whitespace-nowrap text-sm ${
                rowIndex % 2 === 0 ? "text-[#000000]" : "text-[#000000]" // Dark text on Softer Gray, Light text on Softer Blue
              } border-r border-gray-300`}
            >
              {(currentPage - 1) * rowsPerPage + rowIndex + 1}
            </td>
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className={`px-4 py-2 whitespace-nowrap text-sm ${
                  rowIndex % 2 === 0 ? "text-[#000000]" : "text-[#090808]" // Adjust text color for readability
                }`}
                onClick={
                  column.header === "BMR NAME"
                    ? () => handleBMRClick(row)
                    : null
                }
                style={{
                  cursor: column.header === "BMR NAME" ? "pointer" : "default",
                }}
              >
                {column.Cell
                  ? column.Cell({ row: { original: row } })
                  : row[column.accessor]}
              </td>
            ))}
          </tr>
          
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center p-4 border-t border-gray-300 bg-white fixed bottom-0 left-0 right-0 sm:left-64 sm:right-0">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
        >
          Previous
        </button>
        <span className="text-sm sm:text-base">
          Total BMRs: {data.length} &nbsp; Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AtmTable;
