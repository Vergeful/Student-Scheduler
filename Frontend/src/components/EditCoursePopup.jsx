import React, {useState, useEffect} from "react"
import "../styles/popup.scss"

export default function EditCoursePopup({courses, profs, onSave, onCancel, courseId}) {

    const [selectedPrerequisites, setSelectedPrerequisites] = useState([]);
    const [selectedAntiRequisites, setSelectedAntirequisites] = useState([]);
    const [selectedTaughtById, setSelectedTaughtById] = useState('');


    // Effect to set the initial state when the component mounts or courseId changes
    useEffect(() => {
        const courseToEdit = courses.find(course => course.Id === courseId);

        if (courseToEdit) {
            setSelectedPrerequisites(courseToEdit.PreReqs.map(preReq => preReq.Code));
            setSelectedAntirequisites(courseToEdit.AntiReqs.map(antiReq => antiReq.Code));
            const teachingProf = profs.find(prof => prof.Id === courseToEdit.ProfId);
            if (teachingProf) {
                setSelectedTaughtById(teachingProf.Id); // or teachingProf.FName + ' ' + teachingProf.LName
            }
        }
    }, [courseId, courses, profs]);

    const handleCancel = () => {
        if (typeof onCancel === 'function') {
            onCancel();
        } 
    };

    const handleSave = () => {
        onSave(selectedPrerequisites, selectedAntiRequisites, selectedTaughtById);
    };

    const handlePrereqSelection = (courseCode) => {
        setSelectedPrerequisites(prevSelected => {
            if (selectedAntiRequisites.includes(courseCode)){
                return prevSelected;
            }
            if (prevSelected.includes(courseCode)) {
                // Remove the course if it's already selected
                return prevSelected.filter(code => code !== courseCode);
            } else {
                // Add the course if it's not already selected
                return [...prevSelected, courseCode];
            }
        });
    };

    const handleAntieqSelection = (courseCode) => {
        setSelectedAntirequisites(prevSelected => {
            if (selectedPrerequisites.includes(courseCode)){
                return prevSelected;
            }
            if (prevSelected.includes(courseCode)) {
                // Remove the course if it's already selected
                return prevSelected.filter(code => code !== courseCode);
            } else {
                // Add the course if it's not already selected
                return [...prevSelected, courseCode];
            }
        });
    };

    const handleTaughtByChange = (event) => {
        setSelectedTaughtById(event.target.value);
    };
    
    return (
        <div className="popup">
            <div className="popup-title">Edit Course</div>
            <div className="same-line input-form">
                <label htmlFor="course-select"><h1>Prerequisites:</h1></label>
                <div className="course-select-box">
                    {courses.map(course => (
                        <div 
                            key={course.Id} 
                            onClick={() => handlePrereqSelection(course.Code)}
                            className={`course-option ${selectedPrerequisites.includes(course.Code) ? 'selected' : ''}`}
                        >
                            {course.Code}
                        </div>
                    ))}
                </div>
            </div>
            <div className="same-line input-form">
                <label htmlFor="course-select"><h1>Antirequisites:</h1></label>
                <div className="course-select-box">
                    {courses.map(course => (
                        <div 
                            key={course.Id} 
                            onClick={() => handleAntieqSelection(course.Code)}
                            className={`course-option ${selectedAntiRequisites.includes(course.Code) ? 'selected' : ''}`}
                        >
                            {course.Code}
                        </div>
                    ))}
                </div>
            </div>
            <div className="same-line input-form">
                <label htmlFor="prof-select"><h1>Taught by:</h1></label>
                <select 
                    id="prof-select" 
                    className="prof-dropdown"
                    value={selectedTaughtById} 
                    onChange={handleTaughtByChange}
                >
                    {profs.map(prof => (
                        <option key={prof.Id} value={prof.Id}>
                            {prof.FName} {prof.LName}
                        </option>
                    ))}
                </select>
            </div> 
            <div className="same-line" style={{marginLeft: `340px`}}>
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                <button className="update-button" onClick={handleSave}>Update</button>
            </div>          
        </div>
    )
}