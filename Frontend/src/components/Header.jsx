import React from "react"
import {useState, useEffect, useContext} from 'react';
import AuthContext from "../Context/authProvider";
import '../styles/components.scss'
import { useNavigate } from "react-router-dom";

export default function Header() {
    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    return (
        <div className="header">
            <h1>Student Scheduler</h1>
            {user ? 
            <div className="loggedIn">
                 <div>{user.name} : {user.type}</div> 
                 <button onClick={handleLogout}>Logout</button>
            </div>
            : <> </>}
            </div>
    )
}