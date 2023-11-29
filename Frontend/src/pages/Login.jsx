import React from "react"
import {useState, useEffect, useContext} from 'react';

import AuthContext from "../Context/authProvider";
import axios from "../api/axios";
const LOGIN_URL = '/login'

import '../styles/components.scss'

export default function Login() {
    const {setUser} = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [type, setType] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            const res = await axios.post(LOGIN_URL, JSON.stringify({email, pwd, type}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );

            const accessToken = res?.data?.accessToken;
            setUser({email, pwd, type, accessToken});
        }catch(err){
            if(!err?.response){
               setErrMsg('Server did not respond');
            }else if(err.response?.status === 401){
                setErrMsg('Invalid credentials');
            }else{
                setErrMsg('Login failed');
            }
        }

        setEmail('');
        setPwd('');
        setSuccess(true);
    }

    return (
        <div className="login">
            <h1>Welcome to the your favorite Student Scheduler!</h1>
            <h3>We strive to improve student experiences by helping them plan their degrees.</h3>

            {
                success ?
                    <div>
                        Your are logged in!
                    </div> :
                     <form onSubmit={handleSubmit}>
                     <input 
                         type="text" 
                         placeholder="email"
                         onChange={(e) => setEmail(e.target.value)}
                         value = {email}
                         required 
                     />
     
                     <input 
                         type="password" 
                         placeholder="password"
                         onChange={(e) => setPwd(e.target.value)}
                         value = {pwd}
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
                 </form>
            }
        </div>
    )
}