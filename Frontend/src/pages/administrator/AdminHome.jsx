  import React, { useState, useEffect } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import "../../styles/adminHome.scss";
  
  export default function AdminHome() {
    let navigate = useNavigate();
    const [degrees, setDegrees] = useState([]);
    const { adminId } = useParams(); // Get the parameters from the URL
    const [departmentId, setDepartmentId] = useState(null);


    useEffect(() => {
      // Define the async function inside the useEffect
      const fetchDataAndDegrees = async () => {
        try {
          // Fetching admin info
          const response = await fetch(`http://localhost:3000/api/admin/info/${adminId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Oops, we haven't got JSON!");
          }
          const data = await response.json();
          setDepartmentId(data.Dep_id); // Assume this sets a single ID, not an object
    
          // Fetching degrees after successfully getting the department ID
          if (data) { // Assuming 'data' contains the department ID needed for the next fetch
            const degreesResponse = await fetch(`http://localhost:3000/api/admin/departments/${data.Dep_id}/degrees`);
            if (!degreesResponse.ok) {
              throw new Error(`HTTP error! status: ${degreesResponse.status}`);
            }
            const degreesContentType = degreesResponse.headers.get('content-type');
            if (!degreesContentType || !degreesContentType.includes('application/json')) {
              throw new TypeError("Oops, we haven't got JSON!");
            }
            const degreesData = await degreesResponse.json();
            setDegrees(degreesData);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchDataAndDegrees();
    }, [adminId]);

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
              onClick={() => handleNavigation(`/admin/degree-courses/${departmentId}/degree/${degree.ID}/${adminId}`)}
              >
              {degree.Name}
            </button>
          ))}
        </div>
      </div>
    );
  }