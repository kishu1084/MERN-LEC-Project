import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function StudentDashboard() {
    const { user } = useContext(AuthContext);
    return (
        <>
            <h1>Student DashBoard</h1>
            <h2>Welcome, {user ? user.name : "User"}!</h2>
        </>
    )
}