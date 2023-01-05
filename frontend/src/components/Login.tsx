import React from 'react'
// Import src/auth/login.ts
import { login } from "../auth";
import { useState } from "react";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (<>
        <form onClick={async e => {
            e.preventDefault();
        }}>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} />
            <button onClick={
                async e => {
                    e.preventDefault();
                    login(email, password);
                }}>Log in</button>
        </form>
    </>
    )
}

export default Login
