import React from "react"
import { useNavigate } from "react-router-dom";
import "../../styles/adminHome.scss"

export default function AdminHome() {

  let navigate = useNavigate();
  
  // Function to handle routing
  const handleNavigation = (path) => {
    navigate(path);
  };

  const buttons = [
      { id:'degreeRequirements', label: 'Edit Degree Requirements', path: '/admin/degree'},
      { id: 'editCourses', label: 'Edit Department Courses', path: `/admin/dept-courses`}
    ];

  return (
    <div className="background-box">
      <h1>Admin Dashboard</h1>
      <div className="buttons">
      {buttons.map((button) => (
          <button
            key={button.id}
            className="webtool-button"
            onClick={() => handleNavigation(button.path)}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}