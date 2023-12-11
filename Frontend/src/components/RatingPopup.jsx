import React, {useState, useEffect} from "react"
import "../styles/popup.scss"

export default function EditCoursePopup({studentId, onCancel}) {

    const [selectedCourse, setSelectedCourse] = useState('');
    const [comment, setComment] = useState('');
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [difficultyRating, setDifficultyRating] = useState(1);

    // Effect to set the initial state when the component mounts or courseId changes
    useEffect(() => {
        
        const fetchEnrolledCourses = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/student/${studentId}/enrolledCourses`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setEnrolledCourses(data);
            } catch (error) {
                console.error("Fetching enrolled courses failed", error);
            }
        };

        fetchEnrolledCourses();
    }, [enrolledCourses]);

    const handleCancel = () => {
        onCancel();
    };

    const handleSave = async () => {

        try {
            const response = await fetch(`http://localhost:3000/api/student/${studentId}/course/${selectedCourse}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    difficulty: difficultyRating,
                    comment: comment
                })
            });
           
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Update successful", data);
        } catch (error) {
            console.error("Creating rating failed", error);
        }
        onCancel();
    };

    
    const handleTaughtByChange = (event) => {
        setSelectedCourse(event.target.value);
    };
    
    return (
        <div className="popup">
            <div className="popup-title">Leave a Rating</div>
            
            <div className="same-line input-form">
                <label htmlFor="course-select"><h1>Course:</h1></label>
                <select 
                    id="course-select" 
                    className="course-dropdown"
                    value={selectedCourse} 
                    onChange={handleTaughtByChange}
                >
                    {enrolledCourses.map((course, index) => (
                    <option key={`course-${course.ID}-${index}`} value={course.ID}>
                        {course.Code} 
                        </option>
                    ))}
                </select>
            </div> 
            <div className="same-line input-form">
                <label htmlFor="difficulty-rating"><h1>Difficulty:</h1></label>
                <select 
                    id="difficulty-rating" 
                    className="difficulty-dropdown"
                    value={difficultyRating} 
                    onChange={(e) => setDifficultyRating(e.target.value)}
                >
                    {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={`difficulty-${rating}`} value={rating}>
                        {rating} 
                    </option>
                    ))}
                </select>
            </div>
            <div className="same-line input-form">
                <label htmlFor="comment"><h1>Comment:</h1></label>
                <textarea 
                    id="comment" 
                    className="comment-textarea"
                    style={{marginLeft:`23px`}}
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Type your comment here..."
                />
            </div>
            <div className="same-line" style={{marginLeft: `340px`}}>
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                <button className="update-button" onClick={handleSave}>Submit</button>
            </div>          
        </div>
    )
}