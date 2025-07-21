import React, { useState, useContext } from "react";
// import { AuthContext } from "../../../context/AuthContext";
// import { register, login } from "../../../API/api";
// import { notify } from "../../../utills";

import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utills";
import { register, login } from "../../API/api";
import "./AuthModal.css"; // Import modal styles
import { ToastContainer } from "react-toastify";
import { Card } from "react-bootstrap";
import logInIMG from './logIn.jpg';
import SignUpIMG from './SignUp.webp';

export default function AuthModal({ isOpen, setIsOpen }) {
    // ✅ Move hooks to the top level to avoid conditional execution
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSignIn, setIsSignIn] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "",
        phone: ""
    });

    if (!isOpen) {
        return <></>; // ✅ Instead of returning null, return an empty fragment
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAuth = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            notify("Email and password are required!", "error");
            return;
        }

        try {
            if (isSignIn) {
                const res = await login(formData);
                const user = res.data.user;
                setUser(res.data.user);
                localStorage.setItem("token", res.data.token);
                notify("Login successful!", "success");
                setIsOpen(false);
                if (user.role === "admin") {
                    navigate("/admin-dashboard");
                }
            } else {
                const res = await register(formData);
                notify(res.data.message || "Registration successful!", "success");
                alert("Sign Up Successful! Now Sign In.");
                setIsSignIn(true);
            }
        } catch (err) {
            console.error(err);
            notify("Something went wrong! Please try again.", "error");
        }

        setFormData({ email: "", name: "", password: "",phone: "" });
    };

    return (
        <div className="modal-overlay-login">
            <ToastContainer
            position='top-right'
            autoClose={3000}
            hideProgressBar={false}
      />
            <div className="modal-content-login">
                <button className="close-button-of-form" onClick={() => setIsOpen(false)}>✕</button>

                <div className="container-login justify-content-around">
                {isSignIn &&(<Card.Img variant="top" src={logInIMG} className="mx-auto" style={{ width: "80%" }} />)}
                {!isSignIn &&(<Card.Img variant="top" src={SignUpIMG} className="mx-auto mb" style={{ width: "80%" }} />)}
                    <h2 className="fs-3" style={{ color: "#1c204c" }}>
                        <strong>{isSignIn ? "Sign In" : "Create Account"}</strong>
                    </h2>

                    <br />
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="inputFiled"
                    />
                    <br />
                    {!isSignIn && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="inputFiled"
                            />
                            <br />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Enter Contact Number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="inputFiled"
                            />
                            <br />
                        </>
                    )}
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="inputFiled"
                    />
                    <br />
                    <button onClick={handleAuth} className="logIn-submit-btn">
                        <strong>{isSignIn ? "Sign In" : "Create Account"}</strong>
                    </button>
                    <p>
                        {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
                        <span className="link" onClick={() => setIsSignIn(!isSignIn)}>
                            {isSignIn ? "Create Account" : "Sign In"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
