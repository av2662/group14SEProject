import React, { useState } from 'react';
import './PwdReset.css';
import Axios from 'axios';

const Popup = ({ show, onClose }) => {
    const [email, setEmail] = useState('');
    const [passcode, setPasscode] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');

    const handleSendPasscode = async () => {
        
        console.log(email);

        try {
            const response = await Axios.post('http://localhost:3001/sendpasscode', { email });
            if (response.data.success) {
                setStep(2);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error sending passcode:', error);
            setError('An error occurred while sending the passcode. Please try again later.');
        }
    };

    const handleVerifyPasscode = async () => {
        try {
            const response = await Axios.post('http://localhost:3001/verifypasscode', { email, passcode });
            if (response.data.success) {
                setStep(3);
            } else {
                setError('Invalid passcode. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying passcode:', error);
            setError('An error occurred while verifying the passcode. Please try again later.');
        }
    };

    const handleResetPassword = async () => {
        try {
            const response = await Axios.post('http://localhost:3001/resetpassword', { email, newPassword: password });
            if (response.data.success) {
                setError('');
                onClose();
            } else {
                setError('Password reset failed. Please try again.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('An error occurred while resetting the password. Please try again later.');
        }
    };

    if (!show) return null;

    return (
        <div className="popup">
            <div className="popup-content">
                {step === 1 && (
                    <>
                        <h2>Forgot Password?</h2>
                        <p>Please enter your email to reset your password.</p>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button onClick={handleSendPasscode}>Send Passcode</button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <h2>Enter Passcode</h2>
                        <p>Please enter the passcode sent to your email.</p>
                        <input
                            type="text"
                            placeholder="Enter passcode"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                        />
                        <button onClick={handleVerifyPasscode}>Verify Passcode</button>
                    </>
                )}
                {step === 3 && (
                    <>
                        <h2>Reset Password</h2>
                        <p>Please enter your new password.</p>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={handleResetPassword}>Reset Password</button>
                    </>
                )}
                {error && <p className="error">{error}</p>}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Popup;
