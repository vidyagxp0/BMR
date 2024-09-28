import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../config.json";

const ViewPermissionsModal = ({ user, onClose, id }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/get-user-permissions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const roleData = response.data || [];
        setRoles(roleData.message.map((role) => role.role));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full max-h-[80vh] flex flex-col relative">
        <h2 className="text-center flex justify-center items-center gap-2 text-2xl font-semibold text-blue-600 mb-4">
          Permissions for{" "}
          <p className="font-bold text-blue-900"> {user?.name}</p>
        </h2>
        <div className="flex-grow overflow-auto">
          {roles && roles.length > 0 ? (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-blue-600 text-white">
                    Permissions
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles.map((permission, index) => (
                  <tr key={index} className="bg-gray-100">
                    <td className="py-2 px-4 border-b">{permission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No permissions found</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute bottom-4 right-4 bg-blue-600 text-white py-2 px-4 rounded shadow-md hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewPermissionsModal;
