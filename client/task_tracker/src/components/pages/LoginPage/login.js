import './login.css';
import email_icon from './email.png';
import password_icon from './password.png';
import React, { useState } from "react"; 
import Axios from 'axios';
import Popup from './PwdReset';
import { useNavigate } from 'react-router-dom';


export default function Login() {
      
   const [emailLogin, setEmailLogin] = useState("");
   const [passwordLogin, setPasswordLogin] = useState("");
   const [loginStatus, setLoginStatus] = useState("");
   const [showPopup, setShowPopup] = useState(false);
   const navigate = useNavigate();



   const login = () => {

    Axios.post("http://localhost:3001/login", {
        email: emailLogin,
        password: passwordLogin,
   }).then((response) => {
        if(response.data.message){
            setLoginStatus(response.data.message);
            console.log(response.data);
        } else{
            //setLoginStatus(response.data[0].username);
            //setLoginStatus(response.data[0].username + " login was successful");

            //handles login state
            window.localStorage.setItem("isLogedIn", true);
            window.localStorage.setItem("user", response.data[0].idUsers);
            window.localStorage.setItem("username", response.data[0].username);
            if(response.data[0].isAdmin === 1){
                window.localStorage.setItem("isAdmin", true); 
            }
            navigate('/Calendar'); 
            window.location.reload(true);
        }
   });
 };

    const handleForgotPasswordClick = () => {
        setShowPopup(true); // Show the popup
    };

    const handleClosePopup = () => {
        setShowPopup(false); // Close the popup
    };

   
    return (
        <div className='backgroundLogin'>
            <div className='containerLogin'>
                <div className="headerLogin">
                    <div className="text">Login</div>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <img src={email_icon} alt="" />
                        <input type="email" placeholder="Email" 
                            onChange={(e) =>{
                                setEmailLogin(e.target.value);
                        }}/>
                    </div>
                    <div className="input">
                    <img src={password_icon} alt="" />
                        <input type="password" placeholder="Password" 
                            onChange={(e) =>{
                                setPasswordLogin(e.target.value);
                        }}/>
                    </div>
                </div>
                <div className="forgot-password" onClick={handleForgotPasswordClick}>Forgot Password? <span>Click Here!</span></div>
                <div className="new-here">New Here? <span>Click Here!</span></div>
                <div className="submit-container">
                    <button className="submit" onClick={login}>Login</button>
                </div>
                <h2 align="center" >{loginStatus}</h2>
            </div>
            <Popup show={showPopup} onClose={handleClosePopup} />
        </div>
    )
}
