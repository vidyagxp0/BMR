import { useState } from "react";
import "./HeaderBortoom.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CreateRecordModal from "../../Pages/UserSide/Modals/CreateRecordModal/CreateRecordModal";

function HeaderBottom({ openModal }) {
  const [recordModal, setRecordModal] = useState(false);
  const closeRecordModal = () => setRecordModal(false);
  // const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);

  return (
    <>
      <div className="Header_Bottom">
        <div className="headerBottomInner">
          {/* {loggedInUser.roles?.some(
            (itm) => itm.role_id === 5 || itm.role_id === 1
          ) ? ( */}
          <div className="headerBottomRgt">
            <div
              className="themeBtn bg-[#1a9e66] hover:bg-[#0a6249]  mt-3 font-bold"
              onClick={openModal}
            >
              Create BMR
            </div>
          </div>
          {/* ) : null} */}
        </div>
      </div>
    </>
  );
}

export default HeaderBottom;
