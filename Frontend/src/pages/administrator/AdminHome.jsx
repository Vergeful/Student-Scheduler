  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import "../../styles/adminHome.scss";
  
  export default function AdminHome() {
    let navigate = useNavigate();
    const [degrees, setDegrees] = useState([]);
    const adminId = "1000";
    const departmentId = '10'; 

  
    useEffect(() => {

      const fetchDegrees = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/admin/departments/${departmentId}/degrees`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Oops, we haven't got JSON!");
          }
          const degreesData = await response.json();
          setDegrees(degreesData);
        } catch (error) {
          console.error('Error fetching degrees:', error);
          // Handle errors as appropriate for your application
        }
      };
  
      fetchDegrees();
    }, []); // The empty array ensures this effect runs once on mount
  
  
    // Function to handle routing
    const handleNavigation = (path) => {
      navigate(path);
    };
  
    return (
      <div className="background-box">
        <h1 style={{paddingBottom: `15px`}}>Admin Dashboard</h1>
        <div className="buttons">
          {degrees.map((degree) => (
            <button
              key={degree.ID}
              className="webtool-button"
              onClick={() => handleNavigation(`/admin/degree-courses/${departmentId}/degree/${degree.ID}`)}
              >
              {degree.Name}
            </button>
          ))}
        </div>
      </div>
    );
  }