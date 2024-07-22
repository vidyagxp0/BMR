import { useState } from "react";
import "./HeaderBottom.css";
import { Link } from "react-router-dom";
import CreateRecordModal from "../Modals/CreateRecordModal/CreateRecordModal";
import { useSelector } from "react-redux";

function HeaderBottom() {
  const [recordModal, setRecordModal] = useState(false);
  const closeRecordModal = () => setRecordModal(false);
  const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);

  return (
    <>
      <div className="Header_Bottom">
        <div className="headerBottomInner">
       
          {loggedInUser.roles?.some(
            (itm) => itm.role_id === 5 || itm.role_id === 1
          ) ? (
            <div className="headerBottomRgt">
              <div className="themeBtn" onClick={() => setRecordModal(true)}>
                Initiate eLog
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {recordModal && <CreateRecordModal closeModal={closeRecordModal} />}
    </>
  );
}

export default HeaderBottom;
