import "./UserSidebar.css";

const UserSidebar = () => {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <h3>Workflow</h3>
        <p>Trust The Process</p>
      </div>
      <div className="workflow-steps">
        <div className="step opened">INITIATION</div>
        <div className="arrow">⬇️</div>
        <div className="step review">UNDER REVIEW</div>
        <div className="arrow">⬇️</div>
        <div className="step review">UNDER APPROVAL</div>
        <div className="arrow">⬇️</div>
        <div className="step review">APPROVED</div>
        <div className="arrow">⬇️</div>
        <div className="step closed">Closed-Done</div>
      </div>
    </aside>
  );
};

export default UserSidebar;
