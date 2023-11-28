import React from "react"
import '../styles/components.scss'

export default function Login() {
    return (
        <div className="login">
            <h1>Welcome to the best Student Scheduler!</h1>
            <h3>We strive to improve the student experience by helping them plan their degrees.</h3>
            <form>
                <input type="text" placeholder="email"/>
                <input type="password" placeholder="password"/>
                <button>Login</button>
            </form>
        </div>
    )
}