import React, { useState, useEffect, useContext } from "react"
import AuthContext from "../../Context/authProvider"
import axios from "axios";
import '../../styles/studentHome.scss';
import { Link } from "react-router-dom";
import RatingPopup from "../../components/RatingPopup";


export default function StudentHome() {
    // Contains user degree info
    const [degree, setDegree] = useState({});

    // Contains array of semesters
    const [semesters, setSemesters] = useState([]);

    // Should contain an array of all the courses
    const [courses, setCourses] = useState([]);

    // Store the array of majors, minors and concentrations from api
    const [updateMajor, setUpdateMajor] = useState([]);
    const [updateMinor, setUpdateMinor] = useState([]);
    const [updateConc, setUpdateConc] = useState([]);

    // These hold the updated degree ids used to update major/minor/conc
    const [majForm, setMajForm] = useState();
    const [minForm, setMinForm] = useState();
    const [concForm, setConcForm] = useState();

    const {user} = useContext(AuthContext);

    const [showRatingPopup, setShowRatingPopup] = useState(false);

    const toggleRatingPopup = () => {
        setShowRatingPopup(!showRatingPopup);
    };


    // Get user degree info
    async function getDegree(){
        try{
            const response  = await axios.get(`http://localhost:3000/api/student/${user.id}/degrees`);
            setDegree(response.data);
        }catch(err){
            console.log(err);
        }
    }

    // Get degrees so that we may update major/minor/concentration
    async function getAllDegrees(){
        try{
            const response  = await axios.get(`http://localhost:3000/api/student/getAllDegrees`);
            const info = response.data;

            setUpdateMajor(info.filter(maj => maj.DEGREE_NAME.includes('Major')));
            setUpdateMinor(info.filter(min => min.DEGREE_NAME.includes('Minor')));
            setUpdateConc(info.filter(c => (!c.DEGREE_NAME.includes('Major') && !c.DEGREE_NAME.includes('Minor'))));

        }catch(err){
            console.log(err);
        }
    }

    // Get all semesters
    async function getSemesters(){
        try{
            const response  = await axios.get(`http://localhost:3000/api/student/semesters`);
            setSemesters(response.data);
        }catch(err){
            console.log(err);
        }
    }

    // Get all courses
    async function getCourses(){
        try{
            const response  = await axios.get(`http://localhost:3000/api/student/courses`);
            setCourses(response.data);
        }catch(err){
            console.log(err);
        }
    }

    // Update degree after major change
    const handleSubmitMajor = async(e) => {
        e.preventDefault();
        try{
            const response  = await axios.post(`http://localhost:3000/api/student/${user.id}/major/${majForm}`);
            getDegree();
        }catch(err){
            console.log(err);
        }
    }

    // Update degree after minor change
    const handleSubmitMinor = async(e) => {
        e.preventDefault();
        try{
            const response  = await axios.post(`http://localhost:3000/api/student/${user.id}/minor/${minForm}`);
            getDegree();
        }catch(err){
            console.log(err);
        }
    }


    // Update degree after conc change
    const handleSubmitConc = async(e) => {
        e.preventDefault();
        try{
            const response  = await axios.post(`http://localhost:3000/api/student/${user.id}/conc/${concForm}`);
            getDegree();
        }catch(err){
            console.log(err);
        }
    }

      useEffect(() =>{
        getDegree();
        getSemesters();
        getAllDegrees();
      }, [degree])

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

                <form onSubmit={handleSubmitMajor}>
                    <div className="updateRow">
                        <label htmlFor="updateMajor">Update Major</label>
                        <select
                            id = "updateMajor"
                            value = {majForm}
                            onChange={(e) => setMajForm(e.target.value)}
                            name = "updateMajor"
                        >
                            {updateMajor.map(val => <option value={val.DEGREE_ID}>{val.DEGREE_NAME}</option>)}
                        </select>
                        
                        <button>Change Major</button>
                    </div>
                </form>

                <form onSubmit={handleSubmitMinor}>
                    <div className="updateRow">
                        <label htmlFor="updateMinor">Update Minor</label>
                        <select
                            id = "updateMinor"
                            value = {minForm}
                            onChange={(e) => setMinForm(e.target.value)}
                            name = "updateMinor"
                        >
                        {updateMinor.map(val => <option value={val.DEGREE_ID}>{val.DEGREE_NAME}</option>)}
                        </select>
                        <button>Change Minor</button>
                    </div>
                </form>

                <form onSubmit={handleSubmitConc}>
                    <div className="updateRow">
                        <label htmlFor="updateConc">Update Conc.</label>
                        <select
                            id = "updateConc"
                            value = {concForm}
                            onChange={(e) => setConcForm(e.target.value)}
                            name = "updateConc"
                        >
                         {updateConc.map(val => <option value={val.DEGREE_ID}>{val.DEGREE_NAME}</option>)}
                        </select>
                        <button>Change Conc.</button>
                    </div>
                </form>
                
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

           <button className="rating" onClick={toggleRatingPopup}>LEAVE A RATING FOR A COURSE!</button>
           {showRatingPopup && <RatingPopup studentId={user.id} onCancel={toggleRatingPopup} />}
        </div>
    )
}

