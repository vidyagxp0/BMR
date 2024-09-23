import React, { useState, useEffect } from "react";
import ProgressBar from "../../../../Components/ProgressBar/ProgressBar";
import Select from "react-select";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ViewPrintControl() {
  const [activeTab, setActiveTab] = useState("general");
  const [roles, setRoles] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);

  const { id } = useParams();

  const [roleWiseData, setRolewiseData] = useState({
    rolesArray: [],
    printLimitDay: "",
    printLimitWeek: "",
    printLimitMonth: "",
    printLimitYear: "",
    selectedReviewer: [],
    selectedApprover: [],
  });

  const [userWiseData, setUserwiseData] = useState({
    userArray: [],
    printLimitDay: "",
    printLimitWeek: "",
    printLimitMonth: "",
    printLimitYear: "",
    selectedReviewer: [],
    selectedApprover: [],
  });

  useEffect(() => {
    const fetchPrintControlData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/bmr-form/get-print-control/${id}`);
        setRolewiseData(response.data.message);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPrintControlData();
  }, []);

  const [activityLog, setActivityLog] = useState({
    initiatedBy: "John Doe",
    initiatedOn: "10-02-2024",
    reviewedBy: "Jane Smith",
    reviewedOn: "11-02-2024",
    approvedBy: "Jane Smith",
    approvedOn: "20-11-2024",
  });

  // Fetch roles, reviewers, and approvers from APIs
  useEffect(() => {
    // Fetch roles
    axios
      .get("https://bmrapi.mydemosoftware.com/user/get-all-roles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      })
      .then((response) => {
        const roleOptions = response.data.response.map((role) => ({
          value: role.role_id,
          label: role.role,
        }));
        setRoles([{ value: "select_all", label: "Select All" }, ...roleOptions]);
      })
      .catch((error) => console.error("Error fetching roles: ", error));

    // Fetch reviewers
    axios
      .post(
        "https://bmrapi.mydemosoftware.com/bmr-form/get-user-roles",
        { role_id: 3 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          },
        }
      )
      .then((response) => {
        const reviewerOptions = response.data.message.map((role) => ({
          value: role.user_id,
          label: role.User.name,
        }));
        setReviewers([{ value: "select-all", label: "Select All" }, ...reviewerOptions]);
      })
      .catch((error) => console.error("Error fetching reviewers: ", error));

    // Fetch approvers
    axios
      .post(
        "https://bmrapi.mydemosoftware.com/bmr-form/get-user-roles",
        { role_id: 4 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          },
        }
      )
      .then((response) => {
        const approverOptions = response.data.message.map((role) => ({
          value: role.user_id,
          label: role.User.name,
        }));
        setApprovers([{ value: "select-all", label: "Select All" }, ...approverOptions]);
      })
      .catch((error) => console.error("Error fetching approvers: ", error));
  }, []);

  const handleRoleChange = (selectedOptions) => {
    setRolewiseData({
      ...roleWiseData,
      rolesArray: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    });
  };

  const handleInputChange = (e, field) => {
    setRolewiseData({
      ...roleWiseData,
      [field]: e.target.value,
    });
  };

  const handleReviewerChange = (selected) => {
    const updatedReviewers = selected.some((option) => option.value === "select-all")
      ? reviewers.filter((option) => option.value !== "select-all")
      : selected;
    setRolewiseData({ ...roleWiseData, selectedReviewer: updatedReviewers });
  };

  const handleApproverChange = (selected) => {
    const updatedApprovers = selected.some((option) => option.value === "select-all")
      ? approvers.filter((option) => option.value !== "select-all")
      : selected;
    setRolewiseData({ ...roleWiseData, selectedApprover: updatedApprovers });
  };

  return (
    <div>
      <header className="bg-[#2a323e] w-full shadow-lg flex justify-between items-center p-4 mb-4">
        <p className="text-lg text-gray-200 font-bold">Print Control Details</p>
      </header>

      <div>
        <ProgressBar stage={2} status={"Reviewer"} />

        {/* Tabs for General Information and Activity Log */}
        <div className="border-b border-gray-200 mt-4 mb-4 flex justify-center space-x-4">
          <button
            className={`px-6 py-2 font-bold rounded-lg ${
              activeTab === "general"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General Information
          </button>
          <button
            className={`px-6 py-2 font-bold rounded-lg ${
              activeTab === "activity"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("activity")}
          >
            Activity Log
          </button>
        </div>

        {/* Conditionally render content based on active tab */}
        <div className="p-4">
          {/* General Information Tab */}
          {activeTab === "general" && (
            <div>
              {/* <h2 className="text-xl font-bold mb-4">General Information</h2> */}

              {/* Role-Wise Form */}
              <form className="grid grid-cols-1 gap-6 md:grid-cols-2 gap-4">
                {/* Roles */}
                <div className="group-input col-span-2" style={{ margin: "0px" }}>
                  <label htmlFor="roles" className="text-blue-500">
                    Roles
                  </label>
                  <Select
                    name="roles"
                    options={roles}
                    value={roles.filter((option) => roleWiseData.rolesArray.includes(option.value))}
                    isMulti
                    onChange={handleRoleChange}
                  />
                </div>

                {/* Print Limits */}
                <div className="group-input">
                  <label className="text-blue-500">Print Limit Per Day</label>
                  <input
                    type="number"
                    value={roleWiseData.printLimitDay}
                    onChange={(e) => handleInputChange(e, "printLimitDay")}
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div className="group-input">
                  <label className="text-blue-500">Print Limit Per Week</label>
                  <input
                    type="number"
                    value={roleWiseData.printLimitWeek}
                    onChange={(e) => handleInputChange(e, "printLimitWeek")}
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div className="group-input">
                  <label className="text-blue-500">Print Limit Per Month</label>
                  <input
                    type="number"
                    value={roleWiseData.printLimitMonth}
                    onChange={(e) => handleInputChange(e, "printLimitMonth")}
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div className="group-input">
                  <label className="text-blue-500">Print Limit Per Year</label>
                  <input
                    type="number"
                    value={roleWiseData.printLimitYear}
                    onChange={(e) => handleInputChange(e, "printLimitYear")}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Select Reviewers */}
                <div className="group-input" style={{}}>
                  <label htmlFor="reviewers" className="text-blue-500">
                    Select Reviewers
                  </label>
                  <Select
                    name="reviewers"
                    options={reviewers}
                    value={roleWiseData.selectedReviewer}
                    isMulti
                    onChange={handleReviewerChange}
                  />
                </div>

                {/* Select Approvers */}
                <div className="group-input" style={{}}>
                  <label htmlFor="approvers" className="text-blue-500">
                    Select Approvers
                  </label>
                  <Select
                    name="approvers"
                    options={approvers}
                    value={roleWiseData.selectedApprover}
                    isMulti
                    onChange={handleApproverChange}
                  />
                </div>
              </form>
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === "activity" && (
            <div>
              {/* <h2 className="text-xl font-bold mb-4">Activity Log</h2> */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex border border-gray-400 p-4">
                  <p className="font-semibold w-1/2">Initiated By:</p>
                  <p className="w-1/2">{activityLog.initiatedBy}</p>
                </div>
                <div className="flex border border-gray-400 p-4">
                  <p className="font-semibold w-1/2">Initiated On:</p>
                  <p className="w-1/2">{activityLog.initiatedOn}</p>
                </div>
                <div className="flex border border-gray-400 p-4">
                  <p className="font-semibold w-1/2">Reviewed By:</p>
                  <p className="w-1/2">{activityLog.reviewedBy}</p>
                </div>
                <div className="flex border border-gray-400 p-4">
                  <p className="font-semibold w-1/2">Reviewed On:</p>
                  <p className="w-1/2">{activityLog.reviewedOn}</p>
                </div>
                <div className="flex border border-gray-400 p-4">
                  <p className="font-semibold w-1/2">Approved By:</p>
                  <p className="w-1/2">{activityLog.approvedBy}</p>
                </div>
                <div className="flex border border-gray-400 p-4">
                  <p className="font-semibold w-1/2">Approved On:</p>
                  <p className="w-1/2">{activityLog.approvedOn}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
