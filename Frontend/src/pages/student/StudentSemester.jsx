import React, { useState, useEffect, useContext } from "react"
import AuthContext from "../../Context/authProvider"
import axios from "axios";
import '../../styles/studentSemester.scss';
import { Link, useParams } from "react-router-dom";

export default function StudentSemester() {
    const {user} = useContext(AuthContext);
    let { courseId } = useParams();

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
            <div className = "top">


                <div className = "enrolledCourses">


                </div>
                <div className = "uncompletedRequiredCourses">

                </div>  
            </div>

            <div className= "bottom allSemesterCourses">

            </div>
        </div>
    )
}

