import axios from "axios";
import React, { useEffect, useState } from "react";

const ViewPermissionsModal = ({ user, onClose, id }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios
      .get(`http://195.35.6.197:7000/user/get-user-permissions/${id}`, {
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
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-4/12 md:w-3/2 max-h-90 border-black overflow-auto">
        <h2 className="text-center flex justify-center items-center gap-2 text-xl font-semibold text-blue-600 mb-4">
          Permissions for{" "}
          <p className="font-bold text-blue-900"> {user?.name}</p>
        </h2>
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
              {roles?.map((permission, index) => (
                <tr key={index} className="bg-gray-100">
                  <td className="py-2 px-4 border-b">{permission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No permissions found</p>
        )}
        <div className="text-center mt-4">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPermissionsModal;
