import React, { useState } from 'react';
import "../styles/toggle.scss"

const Toggle = ({ onToggleChange }) => {
    const [isActive, setIsActive] = useState(true);
  
    const handleToggle = () => {
      const newActiveState = !isActive;
      setIsActive(newActiveState);
      onToggleChange(newActiveState); // Call the passed-in callback with the new state
    };

  return (
    <div className="toggle-container">
      {/* Step 3: Set the className based on the isActive state */}
      <div className={`toggle ${isActive ? 'active' : 'inactive'}`} onClick={handleToggle}>
        <div className="toggle-button" />
      </div>
      <span><strong>Currently Viewing:</strong><br />{isActive ? 'All Courses' : 'Required Courses'}</span>
    </div>
  );
};

export default Toggle;