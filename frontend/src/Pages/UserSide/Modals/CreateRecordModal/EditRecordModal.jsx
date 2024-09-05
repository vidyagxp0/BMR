import { useState, useEffect } from "react";
import "../General.css";
import axios from "axios";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import Select from "react-select";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateBmr } from "../../../../userSlice";
import UserVerificationPopUp from "../../../../Components/UserVerificationPopUp/UserVerificationPopUp";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

const EditRecordModal = ({ onClose, bmrData, fetchBMRData }) => {
  const [formData, setFormData] = useState({
    name: bmrData?.name || "",
    reviewers: [],
    approvers: [],
  });
  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [isSelectedReviewer, setIsSelectedReviewer] = useState([]);
  const [isSelectedApprover, setIsSelectedApprover] = useState([]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

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
      reviewers: isSelectedReviewer.map((reviewer) => ({
        reviewerId: reviewer.value,
        status: "pending",
        comment: null,
      })),

      approvers: isSelectedApprover.map((approver) => ({
        approverId: approver.value,
        status: "pending",
        comment: null,
      })),
      email: e.email,
      password: e.password,
      declaration: e.declaration,
    };

    axios
      .put(
        `https://bmrapi.mydemosoftware.com/bmr-form/edit-bmr/${bmrData.bmr_id}`,
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
          "https://bmrapi.mydemosoftware.com/bmr-form/get-user-roles",
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
          "https://bmrapi.mydemosoftware.com/bmr-form/get-user-roles",
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

    fetchRoles();
  }, []);

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
        reviewers: selectedReviewers,
        approvers: selectedApprovers,
      });

      setIsSelectedReviewer(selectedReviewers);
      setIsSelectedApprover(selectedApprovers);
    }
  }, [bmrData, reviewers, approvers]);

  const handleEditBmrClick = () => {
    // Close the CreateRecordModal and open the UserVerificationPopUp
    setShowVerificationModal(true);
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
