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

        }catch(err){
            console.log(err);
        }
    }

    // Get antireqs
    async function getAntireqs(){
        try{

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
        getCourse();
        getRating();
        getPrereqs();
        getAntireqs();
      }, [])



    return (
        <div className="studentCourse">
            <div className="details">

            </div>
            <div className="enrollment">

            </div>
            <div className="prereqs">

            </div>
            <div className="antireqs">

            </div>
        </div>
    )
}