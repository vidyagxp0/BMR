import React, { useEffect, useState } from "react";
import HeaderTop from "../../../Components/Header/HeaderTop";
import HeaderBottom from "../../../Components/Header/HeaderBottom";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import axios from "axios";
import InitiateModal from "../Modals/InitiateModal";

const Dashboard = () => {
  const navigate = useNavigate();
  // const [eLogSelect, setELogSelect] = useState("All_Records");
  // const [differentialPressureElogs, setDifferentialPressureElogs] = useState(
  //   []
  // );
  // const [tempratureRecordElogs, setTempratureRecordElogs] = useState([]);
  // const [areaAndERecordElogs, setAreaAndERecordElogs] = useState([]);
  // const [equipmentCRecordElogs, setEquipmentCRecordElogs] = useState([]);
  // const userDetails = JSON.parse(localStorage.getItem("user-details"));
  const [showModal, setShowModal] = useState(false);
  const [approvedBMR, setApprovedBMR] = useState([]);
  useEffect(() => {
    axios
      .get(
        "http://195.35.6.197:7000/bmr-form/get-approved-bmrs",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          },
        },
        approvedBMR
      )

      .then((response) => {
        setApprovedBMR(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Function to open the modal
  const openModal = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  // useEffect(() => {
  //   const newConfig = {
  //     method: "get",
  //     url: "http://localhost:1000/differential-pressure/get-all-differential-pressure",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("user-token")}`,
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   axios(newConfig)
  //     .then((response) => {
  //       const allDifferentialPressureElogs = response.data.message;
  //       let filteredArray = allDifferentialPressureElogs.filter((elog) => {
  //         const userId = userDetails.userId;

  //         return (
  //           userId === elog.reviewer_id ||
  //           userId === elog.initiator_id ||
  //           userId === elog.approver_id ||
  //           hasAccess(4, elog.site_id, 1)
  //         );
  //       });
  //       setDifferentialPressureElogs(filteredArray);
  //     })
  //     .catch((error) => {
  //       console.error("Error: ", error);
  //     });

  //   const newConfigTemp = {
  //     method: "get",
  //     url: "http://localhost:1000/temprature-record/get-all-temprature-record",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("user-token")}`,
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   axios(newConfigTemp)
  //     .then((response) => {
  //       const allTempratureRecordElogs = response.data.message;
  //       let filteredArray = allTempratureRecordElogs.filter((elog) => {
  //         const userId = userDetails.userId;

  //         return (
  //           userId === elog.reviewer_id ||
  //           userId === elog.initiator_id ||
  //           userId === elog.approver_id ||
  //           hasAccess(4, elog.site_id, 4)
  //         );
  //       });
  //       setTempratureRecordElogs(filteredArray);
  //     })
  //     .catch((error) => {
  //       console.error("Error: ", error);
  //     });
  // }, []);

  // const combinedRecords = [
  //   ...differentialPressureElogs,
  //   ...areaAndERecordElogs,
  //   ...equipmentCRecordElogs,
  //   ...tempratureRecordElogs,
  // ];

  // const handleNavigation = (item) => {
  //   if (item.DifferentialPressureRecords) {
  //     navigate("/dpr-panel", { state: item });
  //   } else if (item.process === "Area and equipment") {
  //     navigate("/area-and-equipment-panel", { state: item });
  //   } else if (item.TempratureRecords) {
  //     navigate("/tpr-panel", { state: item });
  //   } else if (item.process === "Equipment cleaning checklist") {
  //     navigate("/ecc-panel", { state: item });
  //   } else {
  //     // Handle default or fallback navigation if needed
  //   }
  // };
  return (
    <div>
      <div className="desktop-input-table-wrapper">
        <div className="input-wrapper">
          <div className="group-input-2">
            <label>BMR</label>
            <select id="options" name="options">
              {approvedBMR.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn" onClick={openModal}>
            Initiate
          </button>
        </div>

        {showModal && (
          <InitiateModal approvedBMR={approvedBMR} onClose={closeModal} />
        )}

        <table className="mb-5">
          <thead>
            <tr>
              <th>S no</th>
              <th>BMR no</th>
              <th>Initiator</th>
              <th>Date of initiation</th>
              <th>Short description</th>
              <th>Status</th>
              <th>Site</th>
            </tr>
          </thead>
          <tbody>
            {/* {eLogSelect === "diffrential_pressure"
              ? differentialPressureElogs?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() => navigate("/dpr-panel", { state: item })}
                        onMouseEnter={(e) => {
                          e.target.style.color = "blue";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "black";
                        }}
                      >
                        {`DP${item.form_id}`}
                      </td>
                      <td>{item.initiator_name}</td>
                      <td>{item.date_of_initiation.split("T")[0]}</td>
                      <td>{item.description}</td>
                      <td>{item.status}</td>
                      <td>
                        {item.site_id === 1
                          ? "India"
                          : item.site_id === 2
                          ? "Malaysia"
                          : item.site_id === 3
                          ? "EMEA"
                          : "EU"}
                      </td>
                    </tr>
                  );
                })
              : null} */}

            {/* {eLogSelect === "area_and_equipment"
              ? areaAndERecordElogs?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td onClick={() => navigate("/area-and-equipment-panel")}>
                        {item.eLogId}
                      </td>
                      <td>{item.initiator}</td>
                      <td>{item.dateOfInitiation}</td>
                      <td>{item.shortDescription}</td>
                      <td>{item.status}</td>
                      <td>{item.process}</td>
                    </tr>
                  );
                })
              : null} */}

            {/* {eLogSelect === "equipment_cleaning"
              ? equipmentCRecordElogs?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td onClick={() => navigate("/ecc-panel")}>
                        {item.eLogId}
                      </td>
                      <td>{item.initiator}</td>
                      <td>{item.dateOfInitiation}</td>
                      <td>{item.shortDescription}</td>
                      <td>{item.status}</td>
                      <td>{item.process}</td>
                    </tr>
                  );
                })
              : null} */}

            {/* {eLogSelect === "temperature_records"
              ? tempratureRecordElogs?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() => navigate("/tpr-panel", { state: item })}
                        onMouseEnter={(e) => {
                          e.target.style.color = "blue";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "black";
                        }}
                      >
                        {`TR${item.form_id}`}
                      </td>
                      <td>{item.initiator_name}</td>
                      <td>{item.date_of_initiation.split("T")[0]}</td>
                      <td>{item.description}</td>
                      <td>{item.status}</td>
                      <td>
                        {item.site_id === 1
                          ? "India"
                          : item.site_id === 2
                          ? "Malaysia"
                          : item.site_id === 3
                          ? "EMEA"
                          : "EU"}
                      </td>
                    </tr>
                  );
                })
              : null} */}

            {/* {eLogSelect === "All_Records" &&
              combinedRecords?.map((item, index) => {
                return (
                  <tr key={item.eLogId}>
                    <td> {index + 1}</td>
                    <td
                      style={{
                        cursor: "pointer",
                        color: "black",
                      }}
                      onClick={() => {
                        handleNavigation(item);
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "blue";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "black";
                      }}
                    >
                      {item.DifferentialPressureRecords
                        ? `DP${item.form_id}`
                        : item.TempratureRecords
                        ? `TR${item.form_id}`
                        : null}
                    </td>
                    <td>{item.initiator_name}</td>
                    <td>{item.date_of_initiation.split("T")[0]}</td>
                    <td>{item.description}</td>
                    <td>{item.status}</td>
                    <td>
                      {item.site_id === 1
                        ? "India"
                        : item.site_id === 2
                        ? "Malaysia"
                        : item.site_id === 3
                        ? "EMEA"
                        : "EU"}
                    </td>
                  </tr>
                );
              })} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
