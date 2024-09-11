import "./UserSidebar.css";

const UserSidebar = () => {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <h3>Workflow</h3>
        <p>Trust The Process</p>
      </div>
      <div className="workflow-steps">
        <div className="step opened">Opened</div>
        <div className="arrow">⬇️</div>
        <div className="step review">HOD Review</div>
        <div className="arrow">⬇️</div>
        <div className="step review">Pending QA Review</div>
        <div className="arrow">⬇️</div>
        <div className="step review">CFT/SME Review</div>
        <div className="arrow">⬇️</div>
        <div className="step review">Pending Change Implementation</div>
        <div className="arrow">⬇️</div>
        <div className="step closed">Closed-Done</div>
      </div>
    </aside>
  );
};

export default UserSidebar;
