import React, { useEffect, useState } from "react";
import AtmInput from "../../../../AtmComponents/AtmInput";
import AtmButton from "../../../../AtmComponents/AtmButton";
import Select from "react-select";
import axios from "axios";

export default function AddPrintControl() {
  const [activeTab, setActiveTab] = useState("role");
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("user-details"));

  const [roleWiseData, setRolewiseData] = useState({
    userId: userDetails?.userId || "",
    role_id: userDetails?.roles?.[0]?.role_id || "",
    initiator_id: userDetails?.userId || "",
    rolesArray: [],
    printLimitDay: "",
    printLimitWeek: "",
    printLimitMonth: "",
    printLimitYear: "",
    selectedReviewer: [],
    selectedApprover: [],
  });
  const [userWiseData, setUserwiseData] = useState({
    userId: userDetails?.userId || "",
    role_id: userDetails?.roles?.[0]?.role_id || "",
    initiator_id: userDetails?.userId || "",
    userArray: [],
    printLimitDay: "",
    printLimitWeek: "",
    printLimitMonth: "",
    printLimitYear: "",
    selectedReviewer: [],
    selectedApprover: [],
  });

  // const userDetails2 = JSON.parse(localStorage.getItem("user-details"));

  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const [reviewersResponse, approversResponse] = await Promise.all([
          axios.post(
            "https://bmrapi.mydemosoftware.com/bmr-form/get-user-roles",
            { role_id: 3 },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user-token")}`,
                "Content-Type": "application/json",
              },
            }
          ),
          axios.post(
            "https://bmrapi.mydemosoftware.com/bmr-form/get-user-roles",
            { role_id: 4 },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user-token")}`,
                "Content-Type": "application/json",
              },
            }
          ),
        ]);
        const reviewerOptions = [
          { value: "select-all", label: "Select All" },
          ...new Map(
            reviewersResponse.data.message.map((role) => [
              role.user_id,
              {
                value: role.user_id,
                label: `${role.User.name}`,
              },
            ])
          ).values(),
        ];
        setReviewers(reviewerOptions);

        const approverOptions = [
          { value: "select-all", label: "Select All" },
          ...new Map(
            approversResponse.data.message.map((role) => [
              role.user_id,
              {
                value: role.user_id,
                label: `${role.User.name}`,
              },
            ])
          ).values(),
        ];
        setApprovers(approverOptions);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchUserRoles();
  }, []);

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
        const userOptions = response.data.response.map((user) => ({
          value: user.user_id,
          label: user.name,
        }));
        setAllUsers([{ value: "select_all", label: "Select All" }, ...userOptions]);
      })

      .catch((error) => {
        toast.error("Error fetching users!");
        console.error(error);
      });
  }, []);

  const handleRoleChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === "select_all")) {
      setRolewiseData({
        ...roleWiseData,
        rolesArray: roles.filter((role) => role.value !== "select_all").map((role) => role.value),
      });
    } else {
      setRolewiseData({
        ...roleWiseData,
        rolesArray: selectedOptions ? selectedOptions.map((option) => option.value) : [],
      });
    }
  };

  const handleUserChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === "select_all")) {
      setUserwiseData({
        ...userWiseData,
        userArray: allUsers.filter((user) => user.value !== "select_all").map((role) => role.value),
      });
    } else {
      setUserwiseData({
        ...userWiseData,
        userArray: selectedOptions ? selectedOptions.map((option) => option.value) : [],
      });
    }
  };

  const handleDropdownChange = (selected, field) => {
    let updatedValues;
    if (selected.some((option) => option.value === "select-all")) {
      updatedValues =
        field === "reviewers"
          ? reviewers.filter((option) => option.value !== "select-all")
          : approvers.filter((option) => option.value !== "select-all");
    } else {
      updatedValues = selected;
    }

    setRolewiseData((prevFormData) => ({
      ...prevFormData,
      [field === "reviewers" ? "selectedReviewer" : "selectedApprover"]: updatedValues,
    }));
  };

  const handleUserDropdownChange = (selected, field) => {
    let updatedValues;
    if (selected.some((option) => option.value === "select-all")) {
      updatedValues =
        field === "reviewers"
          ? reviewers.filter((option) => option.value !== "select-all")
          : approvers.filter((option) => option.value !== "select-all");
    } else {
      updatedValues = selected;
    }

    setUserwiseData((prevFormData) => ({
      ...prevFormData,
      [field === "reviewers" ? "selectedReviewer" : "selectedApprover"]: updatedValues,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let dataToSubmit;
      if (activeTab === "role") {
        console.log("roleWiseData:", roleWiseData);

        dataToSubmit = {
          ...roleWiseData,
        };
      } else if (activeTab === "user") {
        console.log("userWiseData:", userWiseData);
        dataToSubmit = {
          ...userWiseData,
        };
      }

      const response = await axios.post(
        "https://bmrapi.mydemosoftware.com/your-endpoint-here",
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div className=" mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between border-b-2 border-gray-200 mb-6">
        <div
          className={`w-1/2 text-center py-2 cursor-pointer font-bold ${
            activeTab === "role" ? "border-b-2 border-blue-600  text-blue-600" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("role")}
        >
          Add Print Control Role Wise
        </div>
        <div
          className={`w-1/2 text-center py-2 cursor-pointer font-bold ${
            activeTab === "user" ? "border-b-2 border-blue-600  text-blue-600" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("user")}
        >
          Add Print Control User Wise
        </div>
      </div>

      <div>
        {activeTab === "role" && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="group-input" style={{ margin: "15px", padding: "15px" }}>
              <label htmlFor="roles" className=" text-blue-600">
                Roles
              </label>
              <Select
                name="roles"
                options={roles}
                value={roles.filter((option) => roleWiseData.rolesArray.includes(option.value))}
                isMulti
                onChange={handleRoleChange}
              />
              {errors.rolesArray && <p className=" text-blue-600 text-sm">{errors.rolesArray}</p>}
            </div>

            <div className="group-input" style={{ margin: "15px" }}>
              <AtmInput
                label="Print Limit Per Day"
                name="plpd"
                value={roleWiseData.printLimitDay}
                onChange={(e) =>
                  setRolewiseData({
                    ...roleWiseData,
                    printLimitDay: e.target.value,
                  })
                }
                labelClassName=" text-blue-600"
                type="number"
              />
            </div>

            <div className="group-input" style={{ margin: "15px" }}>
              <AtmInput
                label="Print Limit Per Week"
                name="plpw"
                value={roleWiseData.printLimitWeek}
                onChange={(e) =>
                  setRolewiseData({
                    ...roleWiseData,
                    printLimitWeek: e.target.value,
                  })
                }
                labelClassName=" text-blue-600"
                // error={errors.name}
                type="number"
              />
            </div>

            <div className="group-input" style={{ margin: "15px" }}>
              <AtmInput
                label="Print Limit Per Month"
                name="plpm"
                value={roleWiseData.printLimitMonth}
                onChange={(e) =>
                  setRolewiseData({
                    ...roleWiseData,
                    printLimitMonth: e.target.value,
                  })
                }
                labelClassName=" text-blue-600"
                // error={errors.name}
                type="number"
              />
            </div>

            <div className="group-input" style={{ margin: "15px" }}>
              <AtmInput
                label="Print Limit Per Year"
                name="plpy"
                value={roleWiseData.printLimitYear}
                onChange={(e) =>
                  setRolewiseData({
                    ...roleWiseData,
                    printLimitYear: e.target.value,
                  })
                }
                labelClassName=" text-blue-600"
                // error={errors.name}
                type="number"
              />
            </div>

            <div className="group-input" style={{ margin: "15px", padding: "15px" }}>
              <label htmlFor="roles" className=" text-blue-600">
                Select Reviewers
              </label>

              <Select
                name="roles"
                options={reviewers}
                value={roleWiseData.selectedReviewer}
                isMulti
                onChange={(selected) => handleDropdownChange(selected, "reviewers")}
              />
              {errors.rolesArray && <p className=" text-blue-600 text-sm">{errors.rolesArray}</p>}
            </div>

            <div className="group-input" style={{ margin: "15px", padding: "15px" }}>
              <label htmlFor="roles" className=" text-blue-600">
                Select Approvers
              </label>
              <Select
                name="roles"
                options={approvers}
                value={roleWiseData.selectedApprover}
                isMulti
                onChange={(selected) => handleDropdownChange(selected, "approvers")}
              />
              {errors.rolesArray && <p className=" text-blue-600 text-sm">{errors.rolesArray}</p>}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <AtmButton
                label="Create Print Control"
                type="submit"
                className="bg-blue-500 hover:bg-blue-700"
              />
            </div>
          </form>
        )}

        {activeTab === "user" && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="group-input" style={{ margin: "15px", padding: "15px" }}>
              <label htmlFor="roles" className=" text-blue-600">
                Users
              </label>
              <Select
                name="users"
                options={allUsers}
                value={allUsers.filter((option) => userWiseData.userArray.includes(option.value))}
                isMulti
                onChange={handleUserChange}
              />
              {errors.rolesArray && <p className=" text-blue-600 text-sm">{errors.rolesArray}</p>}
            </div>

            <div className="group-input" style={{ margin: "15px" }}>
              <AtmInput
                label="Print Limit Per Day"
                name="plpd"
                value={userWiseData.printLimitDay}
                onChange={(e) =>
                  setUserwiseData({
                    ...userWiseData,
                    printLimitDay: e.target.value,
                  })
                }
                labelClassName=" text-blue-600"
                type="number"
              />
            </div>

            <div className="group-input" style={{ margin: "15px" }}>
              <AtmInput
                label="Print Limit Per Week"
                name="plpw"
                value={userWiseData.printLimitWeek}
                onChange={(e) =>
                  setUserwiseData({
                    ...userWiseData,
                    printLimitWeek: e.target.value,
                  })
                }
                labelClassName=" text-blue-600"
                // error={errors.name}
                type="number"
              />
            </div>

            <div className="group-input" style={{ margin: "15px" }}>
              <AtmInput
                label="Print Limit Per Month"
                name="plpm"
                value={userWiseData.printLimitMonth}
                onChange={(e) =>
                  setUserwiseData({
                    ...userWiseData,
                    printLimitMonth: e.target.value,
                  })
                }
                labelClassName=" text-blue-600"
                // error={errors.name}
                type="number"
              />
            </div>

            <div className="group-input" style={{ margin: "15px" }}>
              <AtmInput
                label="Print Limit Per Year"
                name="plpy"
                value={userWiseData.printLimitYear}
                onChange={(e) =>
                  setUserwiseData({
                    ...userWiseData,
                    printLimitYear: e.target.value,
                  })
                }
                labelClassName=" text-blue-600"
                // error={errors.name}
                type="number"
              />
            </div>

            <div className="group-input" style={{ margin: "15px", padding: "15px" }}>
              <label htmlFor="roles" className=" text-blue-600">
                Select Reviewers
              </label>

              <Select
                name="roles"
                options={reviewers}
                value={userWiseData.selectedReviewer}
                isMulti
                onChange={(selected) => handleUserDropdownChange(selected, "reviewers")}
              />
              {errors.rolesArray && <p className=" text-blue-600 text-sm">{errors.rolesArray}</p>}
            </div>

            <div className="group-input" style={{ margin: "15px", padding: "15px" }}>
              <label htmlFor="roles" className=" text-blue-600">
                Select Approvers
              </label>
              <Select
                name="roles"
                options={approvers}
                value={userWiseData.selectedApprover}
                isMulti
                onChange={(selected) => handleUserDropdownChange(selected, "approvers")}
              />
              {errors.rolesArray && <p className=" text-blue-600 text-sm">{errors.rolesArray}</p>}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <AtmButton label="Create Print Control" type="submit" className="bg-blue-400" />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
