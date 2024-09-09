import { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import Select from "react-select";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addBmr } from "../../../../userSlice";
import axios from "axios";
import UserVerificationPopUp from "../../../../Components/UserVerificationPopUp/UserVerificationPopUp";

const modalStyle = {
  position: "absolute",
  top: "60%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  maxHeight: "70vh",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

function CreateRecordModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    reviewers: [],
    approvers: [],
    department: "",
    division: "",
    due_date: "",
  });
  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [department, setDepartment] = useState([]);
  const [division, setDivision] = useState([
    { value: 1, label: "India" },
    { value: 2, label: "Malaysia" },
    { value: 3, label: "EU" },
    { value: 4, label: "EMEA" },
  ]);

  const [isSelectedReviewer, setIsSelectedReviewer] = useState([]);
  const [isSelectedApprover, setIsSelectedApprover] = useState([]);
  const [isSelectedDivision, setIsSelectedDivision] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const dispatch = useDispatch();

  const closeUserVerifiedModal = () => {
    setShowVerificationModal(false);
  };

  const handleVerificationSubmit = (verified) => {
    axios
      .post(
        "http://192.168.1.14:7000/bmr-form/add-bmr",
        {
          name: formData.name,
          description: formData.description,
          due_date: formData.due_date,
          division_id:formData.division,
          department_id:formData.department,
          reviewers: isSelectedReviewer.map((reviewer) => ({
            reviewerId: reviewer.value,
            status: "pending",
            reviewer: reviewer.label,
            date_of_review: "NA",
            comment: null,
          })),
          approvers: isSelectedApprover.map((approver) => ({
            approverId: approver.value,
            status: "pending",
            approver: approver.label,
            date_of_approval: "NA",
            comment: null,
          })),
          email: verified.email,
          password: verified.password,
          declaration: verified.declaration,
          comments: verified.comments,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        toast.success(response.data.message || "BMR added successfully!");
        dispatch(addBmr(response.data.bmr));
        setFormData({ name: "", reviewers: [], approvers: [] });
        setIsSelectedReviewer([]);
        setIsSelectedApprover([]);
        setTimeout(() => {
          closeUserVerifiedModal();
          onClose();
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        toast.error("BMR Already Registered");
      });
  };

  useEffect(() => {
    axios
      .post(
        "http://192.168.1.14:7000/bmr-form/get-user-roles",
        { role_id: 3 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const reviewerOptions = [
          { value: "select-all", label: "Select All" },
          ...new Map(
            response.data.message.map((role) => [
              role.user_id,
              {
                value: role.user_id,
                label: `${role.User.name}`,
              },
            ])
          ).values(),
        ];
        setReviewers(reviewerOptions);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    axios
      .post(
        "http://192.168.1.14:7000/bmr-form/get-user-roles",
        { role_id: 4 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const approverOptions = [
          { value: "select-all", label: "Select All" },
          ...new Map(
            response.data.message.map((role) => [
              role.user_id,
              {
                value: role.user_id,
                label: `${role.User.name}`,
              },
            ])
          ).values(),
        ];
        setApprovers(approverOptions);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    axios
      .get("http://192.168.1.14:7000/user/get-all-user-departments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const departmentOptions = [
          ...response.data.message.map((department) => ({
            value: department.department_id,
            label: department.name,
          })),
        ];
        setDepartment(departmentOptions);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);
  const getTomorrowDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Add 1 day to the current date
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (selected, field) => {
    console.log(selected, "<><><><>");
    if (selected?.some((option) => option.value === "select-all")) {
      const allOptions = field === "reviewers" ? reviewers : approvers;
      const nonSelectAllOptions = allOptions.filter(
        (option) => option.value !== "select-all"
      );
      setIsSelectedReviewer(
        field === "reviewers" ? nonSelectAllOptions : isSelectedReviewer
      );
      setIsSelectedApprover(
        field === "approvers" ? nonSelectAllOptions : isSelectedApprover
      );
    } else {
      if (field === "reviewers") {
        setIsSelectedReviewer(selected);
      } else if (field === "approvers") {
        setIsSelectedApprover(selected);
      }
    }
  };

  useEffect(() => {
    setFormData({
      ...formData,
      reviewers: isSelectedReviewer,
      approvers: isSelectedApprover,
    });
  }, [isSelectedReviewer, isSelectedApprover]);

  const handleAddBmrClick = () => {
    setShowVerificationModal(true);
  };

  const handleDepartmentSelect = (selected) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      department: selected.value, // Update the department value in formData
    }));
  };

  // Function to handle division selection
  const handleDivisionSelect = (selected) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      division: selected.value, // Update the division value in formData
    }));
  };

  return (
    <>
      <div className="h-[40%]">
        <Box open={true} onClose={onClose} sx={{ zIndex: 10 }}>
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2" align="center" gutterBottom>
              Add BMR
            </Typography>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <TextField
                label="BMR Name"
                name="name"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  style: {
                    height: "48px",
                  },
                }}
                InputLabelProps={{
                  style: {
                    top: "0",
                  },
                }}
              />
              <TextField
                label="Description"
                name="description"
                fullWidth
                margin="normal"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  style: {
                    height: "48px",
                  },
                }}
                InputLabelProps={{
                  style: {
                    top: "0",
                  },
                }}
              />

              <div>
                {/* Department Dropdown */}
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  Department
                </Typography>
                <Select
                  name="department"
                  options={department}
                  value={department.find(
                    (dep) => dep.value === formData.department
                  )} // Match selected value
                  onChange={handleDepartmentSelect} // Single-select handling function
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderColor: "#d0d0d0",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#a0a0a0",
                      },
                    }),
                  }}
                />

                {/* Division Dropdown */}
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  Division
                </Typography>
                <Select
                  name="division"
                  options={division}
                  value={division.find(
                    (div) => div.value === formData.division
                  )} // Match selected value
                  onChange={handleDivisionSelect} // Single-select handling function
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderColor: "#d0d0d0",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#a0a0a0",
                      },
                    }),
                  }}
                />
              </div>
              <div>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  Due Date
                </Typography>
                <TextField
                  // label="Due Date"
                  name="due_date"
                  type="date"
                  fullWidth
                  margin="normal"
                  value={formData.due_date}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    style: {
                      height: "48px",
                    },
                  }}
                  inputProps={{
                    min: getTomorrowDate(), // Disable past dates
                    style: { height: "48px" },
                  }}
                />
              </div>
              <div>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  Reviewer
                </Typography>
                <Select
                  name="reviewers"
                  isMulti
                  options={reviewers}
                  value={isSelectedReviewer}
                  onChange={(selected) =>
                    handleSelectChange(selected, "reviewers")
                  }
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderColor: "#d0d0d0",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#a0a0a0",
                      },
                    }),
                  }}
                />
              </div>

              <div>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  Approver
                </Typography>
                <Select
                  name="approvers"
                  isMulti
                  options={approvers}
                  value={isSelectedApprover}
                  onChange={(selected) =>
                    handleSelectChange(selected, "approvers")
                  }
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderColor: "#d0d0d0",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#a0a0a0",
                      },
                    }),
                  }}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleAddBmrClick}
                >
                  Add BMR
                </Button>
              </div>
            </form>
          </Box>
        </Box>
      </div>
      {showVerificationModal && (
        <UserVerificationPopUp
          onClose={closeUserVerifiedModal}
          onSubmit={handleVerificationSubmit}
        />
      )}
    </>
  );
}

export default CreateRecordModal;
