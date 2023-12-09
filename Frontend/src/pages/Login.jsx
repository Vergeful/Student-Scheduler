import React from "react"
import {useState, useEffect, useContext} from 'react';
import axios from "axios";
// import AuthContext from "../Context/authProvider";
import '../styles/components.scss'
import { useNavigate } from "react-router-dom";

export default function Login() {
    // const {setUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('');
    const [error, setError] = useState(null);
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            if(type === "admin"){
                const res = await axios.post(`http://localhost:3000/api/auth/admin`, {id, email, password})
                navigate("/admin")
                alert("admin");
            }else{
                const res = await axios.post(`http://localhost:3000/api/auth/student`, {id, email, password})
                navigate("/student")
                alert("student");
            }
        }catch(err){
            console.log(err);
            setError(err.response.data.error)
            
        }
    }

    return (
        <div className="login">
            <h1>Welcome to the your favorite Student Scheduler!</h1>
            <h3>We strive to improve student experiences by helping them plan their degrees.</h3>
                     <form onSubmit={handleSubmit}>
                     <input 
                         type="text" 
                         placeholder="ID"
                         onChange={(e) => setId(e.target.value)}
                         value = {id}
                         required 
                     />

                     <input 
                         type="text" 
                         placeholder="Email"
                         onChange={(e) => setEmail(e.target.value)}
                         value = {email}
                         required 
                     />
     
                     <input 
                         type="password" 
                         placeholder="Password"
                         onChange={(e) => setPassword(e.target.value)}
                         value = {password}
                         required 
                     />
     
                     <div className="radio-buttons">
                         <div className="row-1">
                             <input 
                                 type="radio"
                                 id="student"
                                 name="type"
                                 value="student"
                                 checked={type === 'student'}
                                 onChange={(e) => setType(e.target.value)}
                                 required
                             />
                             <label htmlFor="student">Student</label>
                             <br />
                         </div>
                         <div className="row-2">
                             <input 
                                 type="radio"
                                 id="admin"
                                 name="type"
                                 value="admin"
                                 checked={type === 'admin'}
                                 onChange={(e) => setType(e.target.value)}
                                 required
                             />
                             <label htmlFor="admin">Admin</label>
                         </div>
                     </div>
                     <button>Login</button>
                     {error && <p>{error}</p>}
                 </form>
            
        </div>
    )
}