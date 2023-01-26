import React, { useContext } from 'react'
// Import src/auth/login.ts
import { useState } from "react";
import { AuthContext } from "../Auth";


const Login = () => {
    const auth = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginForm = (<form onClick={async e => {
        e.preventDefault();
    }}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} value={email} />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} value={password} />
        <button onClick={
            async e => {
                e.preventDefault();
                auth.login(email, password);
                setEmail("");
                setPassword("");
            }}>Log in</button>
    </form>);

    const content = auth.authState.isLoggedIn ? <div><p>Logged in as {auth.authState.email}</p>
        <button onClick={
            async e => {
                e.preventDefault();
                auth.refresh(auth.authState.refreshToken!);
            }
        }>Refresh</button>
        <button onClick={
            async e => {
                e.preventDefault();
                auth.logout();
            }
        }>
            Logout
        </button>
    </div> : loginForm;


    return content;
}

export default Login
