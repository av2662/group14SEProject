/*-------------------
This file contains the logic for the 
user to change their password. It must pass the 
regex test.
--------------------*/
import React, { useState } from 'react';
import './AccountView.css';
import Axios from 'axios'; // Import Axios for making HTTP requests

const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

function AccountView() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetError, setResetError] = useState(null);
    const idUsers = window.localStorage.getItem("user");
    const username = window.localStorage.getItem("username"); //stored to show the username in the greeting

    const handleResetPassword = async () => {

        if (!PWD_REGEX.test(newPassword)) {
            setResetError('Password must be at 8-24 characters. Must include letters, a number, and a special character.');
            return;
        }
        // Check if the new password matches the confirmation
        if (newPassword !== confirmPassword) {
            setResetError('Passwords do not match. Please try again.');
            return;
        }

        try {
            // Send a request to your backend server to initiate the password reset process
            await Axios.post('http://localhost:3001/resetAccountPassword', {
                newPassword: newPassword,
                idUsers: idUsers
            });

            // Reset the password fields after successful password reset
            setNewPassword('');
            setConfirmPassword('');
            setResetError("Reset was successful."); 
        } catch (error) {
            // If there's an error, set resetError to display an error message to the user
            setResetError('Password reset request failed. Please try again later.');
            console.error('Error resetting password:', error);
        }
    };

    return (
        <div className="backgroundAccount">
            <div className="containerAccount">
                <div className='greeting'>Hi, {username}!</div>
                <div>
                    <div className='resetQuestion'>Would you like to reset your password?</div>
                    <div className="password-input">
                        <label>New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button className="accountPassword" onClick={handleResetPassword}>Reset Password</button>
                    {resetError && <p className="error-message">{resetError}</p>}
                </div>
            </div>
        </div>
    );
}

export default AccountView;
