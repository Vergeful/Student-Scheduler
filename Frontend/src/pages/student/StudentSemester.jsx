import React, { useState, useEffect, useContext } from "react"
import AuthContext from "../../Context/authProvider"
import axios from "axios";
import '../../styles/studentSemester.scss';
import { Link, useParams } from "react-router-dom";

export default function StudentSemester() {
    const {user} = useContext(AuthContext);
    let { id } = useParams();

    const [enrolled, setEnrolled] = useState([]);
    const [uncompleted, setUncompleted] = useState([]);
    const [all, setAll] = useState([]);

    // Get enrolled courses
    async function getEnrolled(){
        try{
            const response  = await axios.get(`http://localhost:3000/api/student/${user.id}/semester-enrolled/${id}`);
            setEnrolled(response.data);
        }catch(err){
                console.log(err);
        }
    }

    // Get uncompleted courses
    async function getUncompleted(){
        try{
            const response  = await axios.get(`http://localhost:3000/api/student/${user.id}/semester-uncompleted-degree/${id}`);
            setUncompleted(response.data);
        }catch(err){
                console.log(err);
        }
    }

    // Get all courses
    async function getAll(){
        try{
            const response  = await axios.get(`http://localhost:3000/api/student/semester-courses/${id}`);
            setAll(response.data);
        }catch(err){
                console.log(err);
        }
    }

    useEffect(() =>{
        getEnrolled();
        getUncompleted();
        getAll();
      }, [])

    return (
        <div className ="studentSemester">
            <div className = "enrolledCourses">
                <div className="semHeader">ENROLLED COURSES</div>

                <div className="semList">
                {enrolled && enrolled.length > 0
                    ? enrolled.map( course => (
                        <Link to = {"course/" + course.COURSE_ID.toString()}>
                            <div key={course.COURSE_ID} className="semItem">
                                {course.COURSE_CODE}
                            </div>
                        </Link>          
                        ))
                    : <span>N/A</span>
                }
                </div>

            </div>

            <div className = "uncompletedRequiredCourses">
                <div className="semHeader">MAJOR REQUIRED COURSES</div>

                <div className="semList">
                    {uncompleted && uncompleted.length > 0
                            ? uncompleted.map( course => (
                                <Link to = {"course/" + course.COURSE_ID.toString()}>
                                    <div key={course.COURSE_ID} className="semItem">
                                    {course.COURSE_CODE}
                                </div>   
                                </Link>       
                                ))
                            : <span>N/A</span>
                        }  
                </div>
                
            </div>  
           

            <div className= "allSemesterCourses">
                <div className="semHeader">ALL SEMESTER COURSES</div>

                <div className="semList">
                    {all && all.length > 0
                            ? all.map( course => (
                                <Link to= {"course/" + course.COURSE_ID.toString()}>
                                    <div key={course.COURSE_ID} className="semItem">
                                        {course.COURSE_CODE}
                                    </div>
                                </Link>       
                                ))
                            : <span>N/A</span>
                        }  
                </div>

            </div>


        </div>
    )
}

