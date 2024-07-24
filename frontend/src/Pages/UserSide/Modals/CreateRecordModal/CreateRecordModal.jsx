import { useState, useEffect } from "react";
import "../General.css";
import "./CreateRecordModal.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";



function CreateRecordModal(_props) {
    const sitess = [
        {
          id: "1",
          name: "Site 1"
        },
        {
          id: "2",
          name: "Site 2"
        },
        {
          id: "3",
          name: "Site 3"
        },
        {
          id: "4",
          name: "Site 4"
        },
        {
          id: "5",
          name: "Site 5"
        },
      ];
  const [division, setDivision] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [sites, setSites] = useState(sitess);
  const [project, setProject] = useState("");
  const [processVisible, setProcessVisible] = useState(false);
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user-details"));

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
      <div className="custom-modal" id="create-record-modal">
        <div className="modal-container">
          <div className="modal-top">
            <div className="head">Initiate BMR</div>
          </div>

          <div className="modal-middle">
            <div className="selection-block">
              <div className="division">
                <div className="head">Site/Location</div>
                <div className="select-list division-list">
                  {sites.map((item) => (
                    <div
                      className={division === item.site ? "active" : ""}
                      key={item.id}
                      onClick={() => {
                        setDivision(item);
                        setProcessVisible(true);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="project">
                <div className="head">Process</div>
                <div className="select-list division-list">
                  {processes.map((item, index) => (
                    <div
                      className={project === item.process ? "active" : ""}
                      key={index}
                      onClick={() => handleSelectProcess(item)}
                    >
                      {item.process}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-bottom">
            <div className="modal-btn btn-2" onClick={_props.closeModal}>
              Cancel
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateRecordModal;
