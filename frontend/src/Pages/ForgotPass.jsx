import React, { useState } from "react";
import brgysambag from "../assets/backgroundImage.png";
import alert from "../assets/alarm.png";
import backgroundLogin from '../assets/backgroundLogin.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import forgotPassImage from '../assets/forgotPass.png';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";

const ForgotPass = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);    
    const code = new URLSearchParams(window.location.search).get('oobCode'); 

    const handleReset = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const auth = getAuth();
        try {
            const email = await verifyPasswordResetCode(auth, code);
            await confirmPasswordReset(auth, code, newPassword);
            console.log("Password reset successfully.");
            setSuccessMessage("Your password has been reset successfully! Please log in.");
        } catch (error) {
            console.error("Error resetting password:", error);
            setError("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="overflow-hidden h-screen">
            <div className="relative flex justify-center items-center h-screen">
                <img
                    className="bg-cover w-full h-full absolute brightness-75"
                    src={brgysambag}
                    alt=""
                />
                <div className="h-[90%] w-[60%] rounded-lg bg-[#FFF6F0] relative">
                    <div className="flex justify-center"></div>
                    <div className="flex">
                        <div className="w-2/3">
                            <div className="flex flex-col justify-center items-center gap-2">
                                <img className="h-[25vh] mt-6" src={forgotPassImage} alt="" />
                                <form name="login" onSubmit={handleReset}>
                                    <div className="mt-[10%] flex flex-col h-[2vh] gap-1">
                                        <label className="font-bold" htmlFor="password">
                                            New Password:
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20">
                                                <FontAwesomeIcon icon={faLock} />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter New Password"
                                                className="ps-8 rounded-lg w-[25vw] py-2 border"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <label className="font-bold" htmlFor="confirmPassword">
                                                Confirm Password:
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20">
                                                    <FontAwesomeIcon icon={faLock} />
                                                </div>
                                                <div className="absolute end-2 right-5 top-1/2 transform -translate-y-1/2 z-20" onClick={() => setShowPassword(!showPassword)}>
                                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                </div>
                                                <input
                                                    id="confirmPassword"
                                                    type={showPassword ? "text" : "password"}
                                                    className="ps-8 rounded-lg w-[25vw] py-2 border"
                                                    placeholder="Confirm Password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {error && <p style={{ color: 'red' }}>{error}</p>}
                                        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

                                        <div className="flex justify-center items-center mt-[6%] text-white">
                                            <button
                                                type="submit"
                                                className="bg-[#8A252C] py-1 px-1 w-[30%] rounded-md"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div>
                            <img className="h-[90vh] w-[100%] rounded-lg" src={backgroundLogin} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPass;
