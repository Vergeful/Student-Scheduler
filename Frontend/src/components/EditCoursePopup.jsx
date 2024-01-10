import React, {useState, useEffect} from "react"
import "../styles/popup.scss"

export default function EditCoursePopup({courses, profs, onSave, onCancel, courseId}) {

    const [selectedPrerequisites, setSelectedPrerequisites] = useState([]);
    const [selectedAntiRequisites, setSelectedAntirequisites] = useState([]);
    const [selectedTaughtById, setSelectedTaughtById] = useState('');

    // Effect to set the initial state when the component mounts or courseId changes
    useEffect(() => {
        const courseToEdit = courses.find(course => course.ID === courseId);

        const fetchPrereqs = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/admin/${courseId}/prerequisites`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const prereqCodes = data.map(course => course.Code);
                setSelectedPrerequisites(prereqCodes);
            } catch (error) {
                console.error("Fetching prereqs failed", error);
            }
        };

        const fetchAntireqs = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/admin/${courseId}/antirequisites`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const antireqCodes = data.map(course => course.Code);
                setSelectedAntirequisites(antireqCodes);
            } catch (error) {
                console.error("Fetching antireqs failed", error);
            }
        };

        if (courseToEdit) {
            fetchPrereqs();
            fetchAntireqs();
            
            const teachingProf = profs.find(prof => prof.Id == courseToEdit.Prof_Id);
            if (teachingProf) {
                setSelectedTaughtById(teachingProf.Id); 
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
                return prevSelected.filter(code => code !== courseCode);
            } else {
                return [...prevSelected, courseCode];
            }
        });
    };

    const handleAntireqSelection = (courseCode) => {
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
                    {courses.map((course, index) => (
                        <div 
                            key={`course-pre-${course.ID}-${index}`} 
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
                    {courses.map((course, index) => (
                        <div 
                            key={`course-antis-${course.ID}-${index}`} 
                            onClick={() => handleAntireqSelection(course.Code)}
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
                    {profs.map((prof, index) => (
                    <option key={`prof-${prof.Id}-${index}`} value={prof.Id}>
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