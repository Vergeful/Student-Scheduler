import React, { useState, useEffect, useContext } from "react"
import AuthContext from "../../Context/authProvider"
import axios from "axios";
import '../../styles/studentHome.scss';
import { Link } from "react-router-dom";


export default function StudentHome() {
    const [degree, setDegree] = useState({});
    const [semesters, setSemesters] = useState([]);

    const {user} = useContext(AuthContext);

    async function getDegree(){
        try{
            const response  = await axios.get(`http://localhost:3000/api/student/${user.id}/degrees`);
            setDegree(response.data);
        }catch(err){
            console.log(err);
        }
    }

    async function getSemesters(){
        try{
            const response  = await axios.get(`http://localhost:3000/api/student/semesters`);
            setSemesters(response.data);
        }catch(err){
            console.log(err);
        }
    }
    
      useEffect(() =>{
        getDegree();
        getSemesters();
        console.log(semesters[0]);
      }, [])

    return (
        <div className="studentHome">

           <div className="degreeInfo">
            {degree ? 
            <div className="degreeInfoCard">
                <div className="degreeHeader">DEGREE INFORMATION</div>
                <div className="degRow">Your Major: {degree.MAJOR?.replace("Major", " ").trim()}</div>
                <div className="degRow">Your Minor: {degree.MINOR?.replace("Minor", " ").trim()}</div>
                <div className="degRow">Concentration: {degree.CONCENTRATION?.split(" ").splice(-1)[0]}</div>
            </div> 
            :<div>Degree Information could not be found.</div> }

            <div className = "degreeUpdate">
                <div className="degreeUpdateHeader">Do you want to change your major, minor, or concentration?</div>
            </div>
           </div>


           <div className="semesterInfo">
            <div className="semesterHeader">SEMESTERS</div>
            <div className="semesters">
                { semesters?.map((sem) => {
                    return(
                        <div className="semester" key = {sem.ID}>
                            <div>{sem.SEMESTER_NAME}</div>
                            <div>{sem.SEMESTER_YEAR}</div>
                            <Link className="semesterLink" to = {`/student/semester/${sem.SEMESTER_ID}`}>
                                <div>Enter</div>
                            </Link>
                        </div>
                    )
                })}
            </div>
           </div>

           <div className="rating">
                <div className="ratingHeader">Leave a rating for a course!</div>
           </div>
        </div>
    )
}

