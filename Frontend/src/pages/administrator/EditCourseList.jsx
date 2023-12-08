import React, {useState, useEffect} from "react"
import { useParams } from 'react-router-dom'; 
import "../../styles/courseList.scss"
import "../../styles/popup.scss"
import EditCoursePopup from "../../components/EditCoursePopup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit } from '@fortawesome/free-solid-svg-icons';


export default function EditCourseList() {

    const { depId, degreeId } = useParams(); // Get the parameters from the URL

    const [searchValue, setSearchValue] = useState('');
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [courses, setCourses] = useState([]);
    const [reqCourses, setReqCourses] = useState([]); 
    const [profs, setProfs] = useState([]); 


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/admin/departments/${depId}/courses`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error("Fetching courses failed", error);
            }
        };

        // Fetch professors
        const fetchProfs = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/admin/departments/${depId}/profs`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProfs(data);
            } catch (error) {
                console.error("Fetching professors failed", error);
            }
        };

        const fetchDegreeRequiredCourses = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/admin/departments/${degreeId}/courses`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Assuming you have a state setter for required courses
                setReqCourses(data);
            } catch (error) {
                console.error("Fetching degree required courses failed", error);
            }
        };

        fetchCourses();
        fetchProfs();
        fetchDegreeRequiredCourses();
    }, [degreeId, depId]);

    const getProfessorNameById = (profId) => {
        const prof = profs.find(professor => professor.Id === profId);
        if (prof) {
            return `${prof.FName} ${prof.LName}`;
        } else {
            return 'Professor not found';
        }
    };

    //sort couses by code number
    const sortCoursesByCode = (courses) => {
        return courses.sort((a, b) => {
          // Extract the numeric parts of the course codes
          const numA = parseInt(a.Code.match(/\d+/), 10);
          const numB = parseInt(b.Code.match(/\d+/), 10);
          return numA - numB;
        });
      };
      

    //for search functionality
    const filteredCourses = courses.filter(course => 
        course.Code.toLowerCase().includes(searchValue.toLowerCase())
    );

    const search = (event) => {
        setSearchValue(event.target.value); // Update the searchValue state
    };

    //if popup is cancelled
    const handleCancelEdit = () => {
        setEditingCourseId(null); 
    };

    //if user submits popup with no info
    const handleSaveEdit = (newPrerequisites, newAntirequisites, newProfId) => {
        const courseIndex = courses.findIndex(course => course.Id === editingCourseId);
    
        if (courseIndex > -1) {
            const courseToUpdate = { ...courses[courseIndex] };
    
            // Update the course's prerequisites, antirequisites, and professor ID
            courseToUpdate.PreReqs = newPrerequisites.map(prereqCode => {
                const prereqCourse = courses.find(course => course.Code === prereqCode);
                return prereqCourse || null; 
            });
    
            courseToUpdate.AntiReqs = newAntirequisites.map(antireqCode => {
                const antireqCourse = courses.find(course => course.Code === antireqCode);
                return antireqCourse || null;
            });
    
            courseToUpdate.ProfId = newProfId; 
    
            const updatedCourses = [
                ...courses.slice(0, courseIndex),
                courseToUpdate,
                ...courses.slice(courseIndex + 1)
            ];
    
            setCourses(updatedCourses);
            //TODO: call back to save new course info to API/db
        }
    
        setEditingCourseId(null); // Close the popup after saving
    };


    return (
        <div className={"course-list-bg"} id="courseList">
            <strong className="title"> Course List</strong>
            <div className="search-line" style={{marginLeft: '70rem'}}>
                <div className="search-box">
                <FontAwesomeIcon className="search-icon" icon={faSearch}/>
                <input
                    className="searchbar"
                    id="searchbar"
                    value={searchValue}
                    placeholder="Search"
                    onChange={search}
                />
                </div>
            </div>
            <br></br>
            <br></br>
            <div className="courseList">
                {sortCoursesByCode(filteredCourses).map( course => (
                    <div key={course.Id}>
                        <div className="course"> 
                            <div className="postRow">
                                <div className="postField"> 
                                    <div className="same-line">
                                        <div className="largeText"> {course.Code}: {course.Name}</div>
                                        <FontAwesomeIcon className="editIcon" icon={faEdit} style={{cursor: `pointer`}} onClick={() => setEditingCourseId(course.Id)}/>
                                    </div>
                                    <br></br>
                                    {editingCourseId !== null && <EditCoursePopup
                                        courses={courses}
                                        profs={profs}
                                        onCancel={handleCancelEdit}
                                        onSave={handleSaveEdit}
                                        courseId={editingCourseId}
                                    />}
                                    <h1>{course.Description}</h1>
                                    <div>
                                    <strong>Prerequisites: </strong>
                                        {course.PreReqs && course.PreReqs.length > 0
                                            ? course.PreReqs.map((preReq, index) => (
                                                <span key={preReq.Id}>
                                                {preReq.Code}{index < course.PreReqs.length - 1 ? ', ' : ''}
                                                </span>
                                            ))
                                            : <span>None</span>
                                        }
                                    </div>
                                    <div>
                                        <strong>Antirequisites: </strong>
                                        {course.AntiReqs && course.AntiReqs.length > 0
                                            ? course.AntiReqs.map((antiReq, index) => (
                                                <span key={antiReq.Id}>
                                                {antiReq.Code}{index < course.AntiReqs.length - 1 ? ', ' : ''}
                                                </span>
                                            ))
                                            : <span>None</span>
                                        }
                                    </div>
                                    <h1>Taught by: {getProfessorNameById(course.ProfId)}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}