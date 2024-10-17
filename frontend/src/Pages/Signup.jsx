import React, { useState } from "react";
import AnalyticsComponent from "../Components/AnalyticsComponent";
import backgroundImg from "../assets/backgroundImage.png";
import { useAuthStore } from "../Frontend-auth/auth.controller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const { signup, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !confirmPassword || !role) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await signup(username, email, password, role);
      alert("Sign up successfully");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="overflow-hidden min-h-screen flex flex-col">
      <AnalyticsComponent />
      <div className="relative flex flex-col justify-center items-center flex-grow">
        <img
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          src={backgroundImg}
          alt="Background"
        />
        <div className="max-w-md w-[90%] p-6 rounded-lg bg-gradient-to-b from-[#773734] to-[#FFF6F0] relative mt-10 sm:mt-16 md:mt-24 lg:mt-10">
          <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-4">
              {/* Username and Email */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Username */}
                <div className="flex flex-col w-full">
                  <label className="font-bold" htmlFor="username">Username:</label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20"
                    />
                    <input
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Enter Username"
                      className="ps-8 rounded-lg py-2 border w-full"
                      required
                    />
                  </div>
                </div>
                {/* Email */}
                <div className="flex flex-col w-full">
                  <label className="font-bold" htmlFor="email">Email:</label>
                  <div className="relative">
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter Email"
                      className="rounded-lg py-2 border ps-4 w-full"
                      required
                    />
                  </div>
                </div>
              </div>
              {/* Password and Confirm Password */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="font-bold" htmlFor="password">Password:</label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20"
                    />
                    <FontAwesomeIcon
                      onClick={() => setShowPassword(!showPassword)}
                      icon={showPassword ? faEyeSlash : faEye}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer"
                    />
                    <input
                      id="password"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      type={showPassword ? "text" : "password"}
                      className="ps-8 rounded-lg py-2 border w-full"
                      placeholder="Enter Password"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="font-bold" htmlFor="confirmPassword">Confirm Password:</label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20"
                    />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                      type={showPassword ? "text" : "password"}
                      className="ps-8 rounded-lg py-2 border w-full"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>
                </div>
              </div>
              {/* Role Dropdown */}
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="role">Role:</label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="rounded-lg py-2 border w-full"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
              {/* Submit Button */}
              <div className="flex justify-center items-center mt-6">
                <button
                  type="submit"
                  className="bg-[#8A252C] py-2 px-4 w-full rounded-md flex justify-center items-center text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
                  ) : (
                    <>Sign Up</>
                  )}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-center mt-2">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
