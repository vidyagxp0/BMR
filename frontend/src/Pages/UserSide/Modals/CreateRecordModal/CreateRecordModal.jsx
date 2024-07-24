import { useState, useEffect } from "react";
import "../General.css";
import "./CreateRecordModal.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import Select from 'react-select';


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function CreateRecordModal({ closeModal, addBMR }) {
   
  const [division, setDivision] = useState(null);
  const [project, setProject] = useState("");
  const [processVisible, setProcessVisible] = useState(false);
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user-details"));
  const [bmrName, setBmrName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    addBMR(bmrName);
  };
//   useEffect(() => {
//     const fetchSites = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:1000/site/get-sites"
//         );
//         const userSiteIds = await userDetails.roles
//           .filter((role) => role.role_id === 1 || role.role_id === 5)
//           .map((role) => role.site_id);

//         // Filter sites based on user's roles
//         const filteredSites = await response.data.message.filter((site) =>
//           userSiteIds.includes(site.site_id)
//         );

        
//         setSites(filteredSites);
//       } catch (error) {
//         console.error("Error fetching sites:", error);
//       }
//     };

//     fetchSites();
//   }, []);

//   useEffect(() => {
//     const fetchProcesses = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:1000/differential-pressure/get-processes"
//         );

//         const filteredProcessIds = userDetails.roles
//           .filter(
//             (role) =>
//               (role.role_id === 1 || role.role_id === 5) && role.site_id === division.site_id
//           )
//           .map((role) => role.process_id);

//         // Filter processes based on user's roles
//         const filteredProcesses = response.data.message.filter((process) =>
//           filteredProcessIds.includes(process.process_id)
//         );
//         setProcesses(filteredProcesses);
//       } catch (error) {
//         console.error("Error fetching processes:", error);
//       }
//     };

//     if (processVisible) {
//       fetchProcesses();
//     }
//   }, [processVisible]);

//   const handleSelectProcess = (element) => {
//     setProject(element.process);
//     switch (element.process_id) {
//       case 1:
//         navigate("/differential-pressure-record", {
//           state: division,
//         });
//         break;
//       case 2:
//         navigate("/area-and-equipment-panel", {
//           state: division,
//         });
//         break;
//       case 3:
//         navigate("/equipment-cleaning-checklist", {
//           state: division,
//         });
//         break;
//       case 4:
//         navigate("/temperature-records", {
//           state: division,
//         });
//         break;
//       default:
//         break;
//     }
//   };

  return (
    <>
  <Modal open={true} onClose={closeModal}>
      <Box sx={modalStyle}>
        <div className="flex justify-center items-center pb-5 font-bold">
          <Typography variant="h6" component="h2" style={{ fontWeight: 'bold' }}>
            Add BMR
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <TextField
            label="BMR Name"
            name="bmr_name"
            fullWidth
            margin="normal"
            value={bmrName}
            onChange={(e) => setBmrName(e.target.value)}
            InputProps={{
              style: {
                height: '48px', 
              },
            }}
            InputLabelProps={{
              style: {
                top: '0', 
              },
            }}
          />
          <div className="flex gap-5">
            <Button type="button" variant="contained" color="error" fullWidth sx={{ mt: 2 }} onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} >
              Add BMR
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
    </>
  );
}

export default CreateRecordModal;
