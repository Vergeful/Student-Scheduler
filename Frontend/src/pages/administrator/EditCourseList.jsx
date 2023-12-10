import React, {useState, useEffect} from "react"
import { useParams } from 'react-router-dom'; 
import "../../styles/courseList.scss"
import "../../styles/popup.scss"
import EditCoursePopup from "../../components/EditCoursePopup";
import Toggle from '../../components/Toggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faStar as fasFaStar} from '@fortawesome/free-solid-svg-icons';
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function EditCourseList() {

    const adminId = '1000'; 
    const { depId, degreeId } = useParams(); // Get the parameters from the URL

    const [isActive, setIsActive] = useState(false);

    const [searchValue, setSearchValue] = useState('');
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [courses, setCourses] = useState([]);
    const [reqCourses, setReqCourses] = useState([]); 
    const [profs, setProfs] = useState([]); 

    const [displayedCourses, setDisplayedCourses] = useState(courses);
    const [coursePrerequisites, setCoursePrerequisites] = useState({});
    const [courseAntirequisites, setCourseAntirequisites] = useState({});

    const navigate = useNavigate(); 

    const goBack = () => {
        navigate('/'); 
    };

    useEffect(() => {
        let filteredCourses = isActive ? reqCourses : courses;
    
        if (searchValue) {
          filteredCourses = filteredCourses.filter(course =>
            course.Code.toLowerCase().includes(searchValue.toLowerCase())
          );
        }
    
        setDisplayedCourses(filteredCourses);
      }, [isActive, searchValue, courses, reqCourses]);

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
                const response = await fetch(`http://localhost:3000/api/admin/${adminId}/profs`);
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
                const response = await fetch(`http://localhost:3000/api/admin/${degreeId}/courses`);
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

    useEffect(() => {
        const fetchCoursePrereqs = async (courseId) => {
            try {
                const response = await fetch(`http://localhost:3000/api/admin/${courseId}/prerequisites`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const prereqCodes = data.map(course => course.Code);
                setCoursePrerequisites(prev => ({ ...prev, [courseId]: prereqCodes }));
            } catch (error) {
                console.error(`Fetching prerequisites for course ${courseId} failed`, error);
            }
        };

        const fetchCourseAntireqs = async (courseId) => {
            try {
                const response = await fetch(`http://localhost:3000/api/admin/${courseId}/antirequisites`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const antireqCodes = data.map(course => course.Code);
                setCourseAntirequisites(prev => ({ ...prev, [courseId]: antireqCodes }));
            } catch (error) {
                console.error(`Fetching prerequisites for course ${courseId} failed`, error);
            }
        };

        courses.forEach(course => {
            fetchCoursePrereqs(course.ID);
            fetchCourseAntireqs(course.ID);
        });
    }, [courses]);

    const getProfessorNameById = (profId) => {
        const prof = profs.find(professor => professor.Id == profId);
        if (prof) {
            return `${prof.FName} ${prof.LName}`;
        } else {
            return 'UNDECIDED';
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

    const handleToggleSwitch = () => {
        setIsActive(!isActive);
    };

    const toggleReqCourse = (courseId) => {
        if (reqCourses.find(course => course.ID === courseId)) {
          setReqCourses(reqCourses.filter(course => course.ID !== courseId));
        } else {
          const courseToAdd = courses.find(course => course.ID === courseId);
          setReqCourses([...reqCourses, courseToAdd]);
        }
      };

    const handleSearch = (event) => {
        setSearchValue(event.target.value);
    };

    const handleCancelEdit = () => {
        setEditingCourseId(null); 
    };

    //if user submits popup with no info
    const handleSaveEdit = async (newPrerequisites, newAntirequisites, newProfId) => {
        const courseIndex = courses.findIndex(course => course.ID === editingCourseId);
    
        if (courseIndex > -1) {
            const courseToUpdate = { ...courses[courseIndex] };
            try {
                const response = await fetch(`http://localhost:3000/api/admin/${courses[courseIndex].ID}/update/prerequisites`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prerequisites: newPrerequisites })
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const data = await response.json();
                console.log("Update successful", data);
            } catch (error) {
                console.error("Error updating prerequisites", error);
            }

            try {
                const response = await fetch(`http://localhost:3000/api/admin/${courses[courseIndex].ID}/update/antirequisites`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ antirequisites: newAntirequisites })
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const data = await response.json();
                console.log("Update successful", data);
            } catch (error) {
                console.error("Error updating antirequisites", error);
            }

            try {
                const response = await fetch(`http://localhost:3000/api/admin/${courses[courseIndex].ID}/update/${newProfId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const data = await response.json();
                console.log("Update successful", data);
            } catch (error) {
                console.error("Error updating professor", error);
            }


            setCoursePrerequisites(prev => ({
                ...prev,
                [editingCourseId]: newPrerequisites.map(prereq => ({ Code: prereq })),
            }));

            setCourseAntirequisites(prev => ({
                ...prev,
                [editingCourseId]: newAntirequisites.map(antireq => ({ Code: antireq })),
            }));

            courseToUpdate.Prof_Id = newProfId;
    
            const updatedCourses = courses.map((course) => {
                if (course.ID === editingCourseId) {
                    return { ...course, Prof_Id: newProfId }; // Create a new object with the updated professor ID
                }
                return course;
            });

            setCourses(updatedCourses);

            const reqCourseIndex = reqCourses.findIndex(course => course.ID === editingCourseId);
            if (reqCourseIndex > -1) {
              const updatedReqCourses = reqCourses.map((course) => {
                if (course.ID === editingCourseId) {
                  return { ...course, Prof_Id: newProfId }; // Update the required course as well
                }
                return course;
              });
        
              // Update the reqCourses state
              setReqCourses(updatedReqCourses);
            }
        }
    
        setEditingCourseId(null); // Close the popup after saving
    };


    return (
        <div className={"course-list-bg"} id="courseList">
            <div className="header-container" >
                <strong className="title"> Course List</strong>
                <button className="back" style={{cursor: `pointer`, marginRight:`2.5rem`}} onClick={goBack}>Back</button> 
            </div>
            <div className="same-line" style={{marginLeft: '5px', marginTop:`20px`}}>
                <Toggle onToggleChange={handleToggleSwitch}/>
                <div className="search-line" style={{marginLeft: '920px', marginTop: `35px`}}>
                    <div className="search-box">
                    <FontAwesomeIcon className="search-icon" icon={faSearch}/>
                    <input
                        className="searchbar"
                        id="searchbar"
                        value={searchValue}
                        placeholder="Search"
                        onChange={handleSearch}
                    />
                    </div>
                </div>
            </div>
            <br></br>
            <div className="courseList">
                {sortCoursesByCode(displayedCourses).map( course => (
                    <div key={course.ID}>
                        <div className="course"> 
                            <div className="postRow">
                                <div className="postField"> 
                                    <div className="same-line">
                                        <div className="largeText"> {course.Code}: {course.Name}</div>
                                        <FontAwesomeIcon className="editIcon" icon={faEdit} style={{cursor: `pointer`}} onClick={() => setEditingCourseId(course.ID)}/>
                                        <FontAwesomeIcon icon={reqCourses.find(c => c.ID === course.ID) ? fasFaStar : farFaStar} style={{cursor: `pointer`, marginLeft:`10px`}} 
                                            className="star-icon"
                                            onClick={() => toggleReqCourse(course.ID)}
                                        />
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
                                    {coursePrerequisites[course.ID] ? (
                                        <span>{coursePrerequisites[course.ID].join(', ')}</span>
                                        ) : (
                                        <span>None</span>
                                    )}
                                    </div>
                                    <div>
                                        <strong>Antirequisites: </strong>
                                        {courseAntirequisites[course.ID] ? (
                                        <span>{courseAntirequisites[course.ID].join(', ')}</span>
                                        ) : (
                                        <span>None</span>
                                    )}
                                    </div>
                                    <h1>Taught by: {getProfessorNameById(course.Prof_Id)}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}