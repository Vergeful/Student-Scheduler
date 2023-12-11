import React, { useState, useEffect, useContext } from "react"
import AuthContext from "../../Context/authProvider"
import axios from "axios";
import '../../styles/studentCourse.scss';
import {useParams } from "react-router-dom";

export default function StudentCourse() {
    const {user} = useContext(AuthContext);
    let { courseId } = useParams();

    const [course, setCourse] = useState();
    const [rating, setRating] = useState();
    const [pre, setPre] = useState([]);
    const [anti, setAnti] = useState([]);


    // Get course
    async function getCourse(){
        try{
            const response  = await axios.get(`http://localhost:3000/api/student/${user.id}/detailed-course/${courseId}`);
        }catch(err){
            console.log(err);
        }
    }

    // Get rating
    async function getRating(){
        try{

        }catch(err){
            console.log(err);
        }
    }

    // Get prereqs
    async function getPrereqs(){
        try{
            const response  = await axios.get(`http://localhost:3000/api/student/course-pre/${courseId}`);
            setPre(response.data);
        }catch(err){
            console.log(err);
        }
    }

    // Get antireqs
    async function getAntireqs(){
        try{
            const response  = await axios.get(`http://localhost:3000/api/student/course-anti/${courseId}`);
            setAnti(response.data);
        }catch(err){
            console.log(err);
        }
    }

    // Enroll
    async function enroll(){
        try{

        }catch(err){
            console.log(err);
        }
    }

    // Unenroll
    async function unenroll(){
        try{

        }catch(err){
            console.log(err);
        }
    }

    useEffect(() =>{
        // getCourse();
        // getRating();
        getPrereqs();
        getAntireqs();
      }, [])



    return (
        <div className="studentCourse">
            <div className="details">
                <div className="studentCourseHeader">COURSE DETAILS</div>

            </div>
            <div className="prereqs">
                <div className="studentCourseHeader">COURSE PREREQUISITES</div>
                <div className="antiPreList">
                    {pre && pre.length > 0
                            ? pre.map( course => (
                                <div key={course.COURSE_CODE} className="antiPreItem">
                                    <div>{course.COURSE_CODE}</div>
                                    <div>{course.COURSE_NAME}</div>
                                </div>   
                                ))
                            : <span>N/A</span>
                        }  
                </div>
            </div>

            <div className="antireqs">
                <div className="studentCourseHeader">COURSE ANTIREQUISITES</div>
                <div className="antiPreList">
                    {anti && anti.length > 0
                            ? anti.map( course => (
                                <div key={course.COURSE_CODE} className="antiPreItem">
                                    <div>{course.COURSE_CODE}</div>
                                    <div>{course.COURSE_NAME}</div>
                                </div>   
                                ))
                            : <span>N/A</span>
                        }  
                </div>
            </div>
        </div>
    )
}