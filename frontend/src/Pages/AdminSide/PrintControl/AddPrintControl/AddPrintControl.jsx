import React, { useEffect, useState } from "react";
import AtmInput from "../../../../AtmComponents/AtmInput";
import AtmButton from "../../../../AtmComponents/AtmButton";
import Select from "react-select";
import axios from "axios";

export default function AddPrintControl() {
  const [activeTab, setActiveTab] = useState("role");
  const [roles, setRoles] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [roleWiseData, SetRolewiseData] = useState({
    rolesArray: [],
    printLimit: "",
  });
  const [userWiseData, SetUserwiseData] = useState({
    rolesArray: [],
    printLimit: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("https://bmrapi.mydemosoftware.com/user/get-all-roles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const roleOptions = response.data.response.map((role) => ({
          value: role.role_id,
          label: role.role,
        }));

        // Add "Select All" option
        setRoles([{ value: "select_all", label: "Select All" }, ...roleOptions]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://bmrapi.mydemosoftware.com/user/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      })
      .then((response) => {
        setAllUsers(response.data.response);
        console.log(`response`, response.data.response);
      })

      .catch((error) => {
        toast.error("Error fetching users!");
        console.error(error);
      });
  }, []);

  const handleSelectChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === "select_all")) {
      SetRolewiseData({
        ...roleWiseData,
        rolesArray: roles.filter((role) => role.value !== "select_all").map((role) => role.value),
      });
    } else {
      SetRolewiseData({
        ...roleWiseData,
        rolesArray: selectedOptions ? selectedOptions.map((option) => option.value) : [],
      });
    }
  };
  return (
    <div className=" mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between border-b-2 border-gray-200 mb-6">
        <div
          className={`w-1/2 text-center py-2 cursor-pointer font-bold ${
            activeTab === "role" ? "border-b-2 border-red-400 text-red-400" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("role")}
        >
          Add Print Control Role Wise
        </div>
        <div
          className={`w-1/2 text-center py-2 cursor-pointer font-bold ${
            activeTab === "user" ? "border-b-2 border-red-400 text-red-400" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("user")}
        >
          Add Print Control User Wise
        </div>
      </div>

      <div>
        {activeTab === "role" && (
          <form className="space-y-4">
            <div className="group-input" style={{ margin: "15px", padding: "15px" }}>
              <label htmlFor="roles" className="text-red-400">
                Roles
              </label>
              <Select
                name="roles"
                options={roles}
                value={roles.filter((option) => roleWiseData.rolesArray.includes(option.value))}
                isMulti
                onChange={handleSelectChange}
              />
              {errors.rolesArray && <p className="text-red-500 text-sm">{errors.rolesArray}</p>}
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <AtmInput
                label="Print Limit"
                name="printLimit"
                // value={roleWiseData.name}
                // onChange={handleChange}
                labelClassName="text-red-500"
                // error={errors.name}
                type="number"
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <AtmButton label="Set Print Limit" type="submit" className="bg-red-400" />
            </div>
          </form>
        )}

        {activeTab === "user" && (
          <form className="space-y-4">
            <div className="group-input" style={{ margin: "15px", padding: "15px" }}>
              <label htmlFor="roles" className="text-red-400">
                Users
              </label>
              <Select
                name="roles"
                options={roles}
                value={roles.filter((option) => roleWiseData.rolesArray.includes(option.value))}
                isMulti
                onChange={handleSelectChange}
              />
              {errors.rolesArray && <p className="text-red-500 text-sm">{errors.rolesArray}</p>}
            </div>
            {/* <div className="group-input" style={{ margin: "15px" }}>
              <AtmInput
                label="User Name"
                name="UserName"
                // value={roleWiseData.name}
                // onChange={handleChange}
                labelClassName="text-red-500"
                // error={errors.name}
              />
            </div> */}

            <div className="group-input" style={{ margin: "15px" }}>
              <AtmInput
                label="Print Limit"
                name="printLimit"
                // value={roleWiseData.name}
                // onChange={handleChange}
                labelClassName="text-red-500"
                // error={errors.name}
                type="number"
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <AtmButton label="Set Print Limit" type="submit" className="bg-red-400" />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
