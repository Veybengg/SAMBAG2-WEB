import React, { useState, useRef, useEffect } from "react";
import brgysambag from "../assets/backgroundImage.png";
import alertGif from "../assets/alarm.gif";
import backgroundLogin from '../assets/backgroundLogin.png';
import forgotPassImage from '../assets/forgotPass.png';
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faUser,
  faLock,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthStore } from "../Frontend-auth/auth.controller";
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const recaptchaRef = useRef();
  const { forLogin, isLoading, error, forForgotPass } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }
  
    // Execute ReCAPTCHA and get the token
    let recaptchaToken;
    try {
      recaptchaToken = await recaptchaRef.current.executeAsync();
    } catch (error) {
      console.error("ReCAPTCHA error:", error);
      alert("ReCAPTCHA verification failed. Please try again.");
      return;
    }
  
    const result = await forLogin(username, password, recaptchaToken);
    
    // Ensure recaptchaRef is defined before calling reset
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  
    if (result?.success) {
      alert('Login Successfully');
    } else {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !showForgotPass) {
        handleLogin(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [username, password, showForgotPass]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    const result = await forForgotPass(email);
    if (result?.success) {
      alert('Sent email for reset password successfully');
      setEmail('');
      setShowForgotPass(false);
    } else {
      alert('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div className="overflow-hidden h-screen">
      <div className="relative flex justify-center items-center h-screen">
        <img className="bg-cover w-full h-full absolute brightness-75" src={brgysambag} alt="" />
        <div className="h-[90%] w-[60%] rounded-lg bg-[#FFF6F0] relative">
          {showForgotPass ? (
            <div className="flex">
              <div className="w-2/3">
                <div className="flex flex-col justify-center items-center gap-2">
                  <img className="h-[25vh] mt-2" src={forgotPassImage} alt="" />
                  <div className="flex flex-col justify-center items-center font-bold text-[4vh] text-[#163458]">
                    <h1>Forgot Pass</h1>
                    <h1 className="text-[10px] font-medium mt-3">Please enter your email. We will send you a link to reset your password.</h1>
                  </div>
                  <form name="forgotPassword">
                    <div className="mt-[10%] flex flex-col h-[2vh] gap-1">
                      <label className="font-bold" htmlFor="email">Email:</label>
                      <div className="relative">
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20">
                          <FontAwesomeIcon icon={faEnvelope} />
                        </div>
                        <input
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                          type="email"
                          placeholder="Enter Email"
                          className="ps-8 rounded-lg w-[25vw] py-2 border"
                        />
                      </div>
                      <div className="text-[12px] flex justify-end">
                        <button className="text-[#2203AC] underline" onClick={() => { setShowForgotPass(false); }}>Log in</button>
                      </div>
                      <div className="flex justify-center items-center mt-[6%] text-white">
                        <button
                          onClick={resetPasswordHandler}
                          className="bg-[#8A252C] py-1 px-1 w-[35%] rounded-md"
                        >
                          {isLoading ? <FontAwesomeIcon className="animate-spin" icon={faSpinner} /> : <>Submit</>}
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
          ) : (
            <div className="flex">
              <div className="w-2/3">
                <div className="flex flex-col justify-center items-center gap-2">
                  <img className="h-[25vh] mt-2" src={alertGif} alt="" />
                  <div className="flex flex-col justify-center items-center font-bold text-[4vh] text-[#163458]">
                    <h1>Welcome to Sambag 2</h1>
                    <h1>Emergency Alert</h1>
                  </div>
                  <form name="login">
                    <div className="mt-[10%] flex flex-col h-[2vh] gap-1">
                      <label className="font-bold" htmlFor="username">Username:</label>
                      <div className="relative">
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20">
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                        <input
                          onChange={(e) => setUsername(e.target.value)}
                          value={username}
                          type="text"
                          name="username"
                          id="username"
                          placeholder="Enter Username"
                          className="ps-8 rounded-lg w-[25vw] py-2 border"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="font-bold" htmlFor="password">Password:</label>
                        <div className="relative">
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20">
                            <FontAwesomeIcon icon={faLock} />
                          </div>
                          <div className="absolute end-2 right-5 top-1/2 transform -translate-y-1/2 z-20">
                            <FontAwesomeIcon
                              onClick={togglePasswordVisibility}
                              icon={showPassword ? faEyeSlash : faEye}
                            />
                          </div>
                          <input
                            id="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type={showPassword ? "text" : "password"}
                            className="ps-8 rounded-lg w-[25vw] py-2 border"
                            placeholder="Enter Password"
                          />
                        </div>
                      </div>
                      <div className="text-[12px] flex justify-end">
                        <button 
                          onClick={(e) => { e.preventDefault(); setShowForgotPass(true); }} 
                          className="text-[#2203AC] underline"
                        >
                          Forgot Password
                        </button>
                      </div>
                      <div className="flex justify-center items-center mt-[6%] text-white">
                        <button
                          disabled={isLoading}
                          onClick={handleLogin}
                          className={`bg-[#8A252C] py-1 px-1 w-[40%] h-[40px] rounded-md ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {isLoading ? (
                            <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
                          ) : (
                            <>Login</>
                          )}
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
          )}
          {/* ReCAPTCHA Component */}
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LdR91cqAAAAAJ1uKrSb62NuVKQcIQoIv0Yjt5dy"
            size="invisible" // Make it invisible
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
