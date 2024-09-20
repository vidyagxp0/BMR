/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "../General.css";
import axios from "axios";
import { Box, Typography, TextField, Button } from "@mui/material";
import Select from "react-select";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateBmr } from "../../../../userSlice";
import UserVerificationPopUp from "../../../../Components/UserVerificationPopUp/UserVerificationPopUp";
import {BASE_URL} from "../../../../config.json"
const modalStyle = {
  position: "absolute",
  top: "55%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  height: 500,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

const EditRecordModal = ({ onClose, bmrData, fetchBMRData }) => {
  const formatDateToInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };
  const [formData, setFormData] = useState({
    name: bmrData?.name || "",
    description: bmrData?.description || "",
    reviewers: bmrData?.reviewers || [],
    approvers: bmrData?.approvers || [],
    department: bmrData?.department_id || "",
    division: bmrData?.division_id || "",
    due_date: formatDateToInput(bmrData?.due_date) || "",
  });

  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [isSelectedReviewer, setIsSelectedReviewer] = useState([]);
  const [isSelectedApprover, setIsSelectedApprover] = useState([]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [department, setDepartment] = useState([]);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [division, setDivision] = useState([
    { value: 1, label: "India" },
    { value: 2, label: "Malaysia" },
    { value: 3, label: "EU" },
    { value: 4, label: "EMEA" },
  ]);

  useEffect(() => {
    const isDataChanged =
      bmrData.name !== formData.name ||
      bmrData.description !== formData.description ||
      bmrData.department_id !== formData.department ||
      bmrData.division_id !== formData.division ||
      bmrData.due_date !== formData.due_date ||
      !areReviewersSame(bmrData.reviewers, formData.reviewers) ||
      !areApproversSame(bmrData.approvers, formData.approvers);

    setIsButtonEnabled(isDataChanged);
  }, [bmrData, formData]);

  const areReviewersSame = (oldReviewers, newReviewers) => {
    if (oldReviewers.length !== newReviewers.length) return false;
    return oldReviewers.every((oldRev) =>
      newReviewers.some((newRev) => newRev.value === oldRev.reviewerId)
    );
  };

  const areApproversSame = (oldApprovers, newApprovers) => {
    if (oldApprovers.length !== newApprovers.length) return false;
    return oldApprovers.every((oldApp) =>
      newApprovers.some((newApp) => newApp.value === oldApp.approverId)
    );
  };

  const dispatch = useDispatch();

  const closeUserVerifiedModal = () => {
    setShowVerificationModal(false);
  };

  const updateBMR = (e) => {
    if (!bmrData?.bmr_id) {
      toast.error("BMR ID is missing!");
      return;
    }

    const updatedBMRData = {
      name: formData.name,
      description: formData.description,
      division_id: formData.division,
      department_id: formData.department,
      due_date: formData.due_date,
      reviewers: isSelectedReviewer.map((reviewer) => ({
        reviewerId: reviewer.value,
        status: "pending",
        comment: null,
        reviewer: reviewer.label,
        date_of_review: reviewer.date_of_review || "NA",
      })),

      approvers: isSelectedApprover.map((approver) => ({
        approverId: approver.value,
        status: "pending",
        comment: null,
        approver: approver.label,
        date_of_approval: approver.date_of_approval || "NA",
      })),
      email: e.email,
      password: e.password,
      declaration: e.declaration,
      comments: e.comments,
    };

    axios
      .put(
        `${BASE_URL}/bmr-form/edit-bmr/${bmrData.bmr_id}`,
        updatedBMRData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          dispatch(updateBmr(response.data.bmr));
          fetchBMRData(); // Refresh data
          toast.success("BMR updated successfully!");
          onClose();
        } else {
          toast.error("Unexpected response status code: " + response.status);
        }
      })
      .catch((error) => {
        toast.error(
          "Failed to update BMR: " +
            (error.response?.data?.message || error.message)
        );
      });
  };

  const addSelectAllOption = (options, label = "Select All") => {
    return [
      {
        value: "selectAll",
        label,
      },
      ...options.filter(
        (option, index, self) =>
          index === self.findIndex((t) => t.value === option.value)
      ), // Ensure unique options
    ];
  };

  const handleSelectChange = (selected, setSelected, options) => {
    if (selected && selected.some((option) => option.value === "selectAll")) {
      setSelected(options.filter((option) => option.value !== "selectAll"));
    } else {
      setSelected(selected || []);
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const reviewerResponse = await axios.post(
          `${BASE_URL}/bmr-form/get-user-roles`,
          {
            role_id: 3,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const reviewerOptions = reviewerResponse.data.message.map((role) => ({
          value: role.user_id,
          label: role.User.name,
        }));
        setReviewers(addSelectAllOption(reviewerOptions));

        const approverResponse = await axios.post(
          `${BASE_URL}/bmr-form/get-user-roles`,
          {
            role_id: 4,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const approverOptions = approverResponse.data.message.map((role) => ({
          value: role.user_id,
          label: role.User.name,
        }));
        setApprovers(addSelectAllOption(approverOptions));
      } catch (error) {
        console.error("Error fetching roles: ", error);
      }
    };
    axios
      .get(`${BASE_URL}/user/get-all-user-departments`, {
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

    fetchRoles();
  }, []);
  // const isDisabled={enabled}

  useEffect(() => {
    if (bmrData && reviewers.length > 0 && approvers.length > 0) {
      const selectedReviewers = bmrData.reviewers.map((reviewer) => ({
        value: reviewer.reviewerId,
        label:
          reviewers.find((r) => r.value === reviewer.reviewerId)?.label ||
          "Unknown",
      }));
      const selectedApprovers = bmrData?.approvers?.map((approver) => ({
        value: approver.approverId,
        label:
          approvers.find((a) => a.value === approver.approverId)?.label ||
          "Unknown",
      }));

      setFormData({
        name: bmrData.name,
        description: bmrData.description,
        department: bmrData.department_id,
        division: bmrData.division_id,
        due_date: bmrData.due_date,
        reviewers: selectedReviewers,
        approvers: selectedApprovers,
      });

      setIsSelectedReviewer(selectedReviewers);
      setIsSelectedApprover(selectedApprovers);
    }
  }, [bmrData, reviewers, approvers]);

  const handleEditBmrClick = () => {
    setShowVerificationModal(true);
  };

  const handleDepartmentSelect = (selected) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      department: selected.value,
    }));
  };

  const handleDivisionSelect = (selected) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      division: selected.value,
    }));
  };

  const getTomorrowDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <>
      <Box open={true} onClose={onClose} sx={{ zIndex: 10 }}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" align="center" gutterBottom>
            Edit BMR
          </Typography>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <TextField
              label="BMR Name"
              name="name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
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
                )}
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
                value={division.find((div) => div.value === formData.division)} // Match selected value
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
                value={
                  formData.due_date
                    ? new Date(formData.due_date).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                variant="outlined"
                InputProps={{
                  style: {
                    height: "48px",
                    marginTop: "-9px",
                  },
                }}
                inputProps={{
                  min: getTomorrowDate(), // Disable past dates
                  style: { height: "48px" },
                }}
              />
            </div>
            <div>
              <label htmlFor="" className="text-sm text-blue-500">
                Reviewer
              </label>
              <Select
                name="reviewers"
                isMulti
                options={reviewers}
                value={isSelectedReviewer}
                onChange={(selected) =>
                  handleSelectChange(selected, setIsSelectedReviewer, reviewers)
                }
              />
            </div>
            <div>
              <label htmlFor="" className="text-sm text-blue-500">
                Approver
              </label>
              <Select
                name="approvers"
                options={approvers}
                isMulti
                value={isSelectedApprover}
                onChange={(selected) =>
                  handleSelectChange(selected, setIsSelectedApprover, approvers)
                }
              />
            </div>
            <div className="flex gap-5">
              <Button
                type="button"
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 2 }}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleEditBmrClick}
                // onClick={handleUpdate}
                // disabled={!hasChanges()}
                disabled={!isButtonEnabled}
              >
                Update BMR
              </Button>
            </div>
          </form>
        </Box>
      </Box>
      {showVerificationModal && (
        <UserVerificationPopUp
          onClose={closeUserVerifiedModal}
          onSubmit={updateBMR}
        />
      )}
    </>
  );
};

export default EditRecordModal;
