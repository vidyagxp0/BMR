import { useState, useEffect } from "react";
import "../General.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import Select from "react-select";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateBmr } from "../../../../userSlice";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditRecordModal=({ onClose, bmrData })=> {
  const [formData, setFormData] = useState({
    name: bmrData.name || "",
    reviewers: bmrData.reviewers || [],
    approvers: bmrData.approvers || [],
  });
  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [isSelectedReviewer, setIsSelectedReviewer] = useState(formData.reviewers);
  const [isSelectedApprover, setIsSelectedApprover] = useState(formData.approvers);
  const dispatch = useDispatch();

  const updateBMR = (e) => {
    e.preventDefault();
    axios.put(`http://192.168.1.15:7000/bmr/edit-bmr/${bmrData.id}`, {
      name: formData.name,
      reviewers: isSelectedReviewer.map((reviewer) => ({
        reviewerId: reviewer.value,
        status: "pending",
        comment: null
      })),
      approvers: isSelectedApprover.map((approver) => ({
        approverId: approver.value,
        status: "pending",
        comment: null
      }))
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
        toast.success("BMR updated successfully!");
        dispatch(updateBmr(response.data.bmr));
        onClose();
      }).catch((err) => {
        console.error(err);
        toast.error("Failed to update BMR");
      });
    }

    useEffect(() => {
        const fetchRoles = async () => {
          try {
            const reviewerResponse = await axios.post("http://192.168.1.15:7000/bmr/get-user-roles", {
              role_id: 3,
            }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user-token")}`,
                "Content-Type": "application/json",
              },
            });
            const reviewerOptions = [
              ...new Map(reviewerResponse.data.message.map((role) => [role.user_id, {
                value: role.user_id,
                label: `${role.User.name}`,
              }])).values()
            ];
            setReviewers(reviewerOptions);
    
            const approverResponse = await axios.post("http://192.168.1.15:7000/bmr/get-user-roles", {
              role_id: 4,
            }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user-token")}`,
                "Content-Type": "application/json",
              },
            });
            const approverOptions = [
              ...new Map(approverResponse.data.message.map((role) => [role.user_id, {
                value: role.user_id,
                label: `${role.User.name}`,
              }])).values()
            ];
            setApprovers(approverOptions);
          } catch (error) {
            console.error("Error: ", error);
          }
        };
    
        fetchRoles();
      }, []);
    
      useEffect(() => {
        if (bmrData && reviewers.length > 0 && approvers.length > 0) {
            // Convert the roles data into a format that Select can use
            const reviewerOptions = reviewers.map(role => ({
                value: role.role_id,
                label: role.role
            }));
            const approverOptions = approvers.map(role => ({
                value: role.role_id,
                label: role.role
            }));
    
            // Set the selected reviewers and approvers based on bmrData
            const selectedReviewers = bmrData.reviewers.map(reviewer => ({
                value: reviewer.reviewerId,
                label: reviewer.label // Assuming label is available in reviewer
            }));
            const selectedApprovers = bmrData.approvers.map(approver => ({
                value: approver.approverId,
                label: approver.label // Assuming label is available in approver
            }));
    
            // Update form data
            setFormData({
                ...formData,
                reviewers: selectedReviewers,
                approvers: selectedApprovers,
            });
    
            // Update the selected options for Select components
            setIsSelectedReviewer(selectedReviewers);
            setIsSelectedApprover(selectedApprovers);
        }
    }, [bmrData, reviewers, approvers]);
    

  return (
    <>
      <Modal open={true} onClose={onClose}>
        <Box sx={modalStyle}>
          <div className="flex justify-center items-center pb-5 font-bold">
            <Typography
              variant="h6"
              component="h2"
              style={{ fontWeight: "bold" }}
            >
              Edit BMR
            </Typography>
          </div>
          <form
           onSubmit={updateBMR}
           >
            <TextField
              label="BMR Name"
              name="name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                onChange={(selected) => setIsSelectedReviewer(selected)}
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
                onChange={(selected) => setIsSelectedApprover(selected)}
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
              >
                Update BMR
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default EditRecordModal;
