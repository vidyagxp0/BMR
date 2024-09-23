import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function UserWisePrintControl() {
  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const { id } = useParams(); // Get the ID from the route params

  const [userWiseData, setUserwiseData] = useState({
    userArray: [],
    printLimitDay: "",
    printLimitWeek: "",
    printLimitMonth: "",
    printLimitYear: "",
    selectedReviewer: [],
    selectedApprover: [],
  });

  // Fetch user-wise data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/bmr-form/get-user-print-control/${id}`);
        setUserwiseData(response.data.message);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  // Fetch reviewers and approvers
  useEffect(() => {
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

  const handleInputChange = (e, field) => {
    setUserwiseData({
      ...userWiseData,
      [field]: e.target.value,
    });
  };

  const handleReviewerChange = (selected) => {
    const updatedReviewers = selected.some((option) => option.value === "select-all")
      ? reviewers.filter((option) => option.value !== "select-all")
      : selected;
    setUserwiseData({ ...userWiseData, selectedReviewer: updatedReviewers });
  };

  const handleApproverChange = (selected) => {
    const updatedApprovers = selected.some((option) => option.value === "select-all")
      ? approvers.filter((option) => option.value !== "select-all")
      : selected;
    setUserwiseData({ ...userWiseData, selectedApprover: updatedApprovers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/bmr-form/edit-user-print-control/${id}`, userWiseData);
      alert("User-wise data updated successfully");
    } catch (error) {
      console.error("Error updating user-wise data: ", error);
    }
  };

  return (
    <form className="grid grid-cols-1 gap-6 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
      {/* Users Selection */}
      <div className="group-input col-span-2" style={{ margin: "0px" }}>
        <label htmlFor="users" className="text-blue-500">
          Users
        </label>
        <Select
          name="users"
          options={reviewers}
          value={reviewers.filter((option) => userWiseData.userArray.includes(option.value))}
          isMulti
          onChange={handleReviewerChange}
        />
      </div>

      {/* Print Limits */}
      <div className="group-input">
        <label className="text-blue-500">Print Limit Per Day</label>
        <input
          type="number"
          value={userWiseData.printLimitDay}
          onChange={(e) => handleInputChange(e, "printLimitDay")}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="group-input">
        <label className="text-blue-500">Print Limit Per Week</label>
        <input
          type="number"
          value={userWiseData.printLimitWeek}
          onChange={(e) => handleInputChange(e, "printLimitWeek")}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="group-input">
        <label className="text-blue-500">Print Limit Per Month</label>
        <input
          type="number"
          value={userWiseData.printLimitMonth}
          onChange={(e) => handleInputChange(e, "printLimitMonth")}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="group-input">
        <label className="text-blue-500">Print Limit Per Year</label>
        <input
          type="number"
          value={userWiseData.printLimitYear}
          onChange={(e) => handleInputChange(e, "printLimitYear")}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Reviewers */}
      <div className="group-input" style={{}}>
        <label htmlFor="reviewers" className="text-blue-500">
          Select Reviewers
        </label>
        <Select
          name="reviewers"
          options={reviewers}
          value={userWiseData.selectedReviewer}
          isMulti
          onChange={handleReviewerChange}
        />
      </div>

      {/* Approvers */}
      <div className="group-input" style={{}}>
        <label htmlFor="approvers" className="text-blue-500">
          Select Approvers
        </label>
        <Select
          name="approvers"
          options={approvers}
          value={userWiseData.selectedApprover}
          isMulti
          onChange={handleApproverChange}
        />
      </div>

      {/* Submit Button */}
      <div className="col-span-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </form>
  );
}
