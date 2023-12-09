import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    const adminLogin = async(inputs) => {
       const res =  await axios.post(`http://localhost:3000/api/auth/admin`, inputs);
       setUser(res.data);
    }

    const studentLogin = async(inputs) => {
        const res = await axios.post(`http://localhost:3000/api/auth/student`, inputs);
        setUser(res.data);
    }

    const logout = async() => {
        await axios.post(`http://localhost:3000/api/auth/logout`);
        setUser(null);
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user])

    return (
        <AuthContext.Provider value={{user, adminLogin, studentLogin, logout, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;