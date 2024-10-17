import React, { useState } from "react";
import AnalyticsComponent from "../Components/AnalyticsComponent";
import backgroundImg from "../assets/backgroundImage.png";
import { useAuthStore } from "../Frontend-auth/auth.controller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { changePassword, isLoading } = useAuthStore();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const result = await changePassword(newPassword);
      if (result.success) {
        alert("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="overflow-hidden h-screen">
      <AnalyticsComponent />
      <div className="relative flex justify-center items-center h-screen">
        <img
          className="bg-cover w-full h-full absolute brightness-75"
          src={backgroundImg}
          alt="Background"
        />
        <div className="max-w-md w-[90%] p-6 rounded-lg bg-gradient-to-b from-[#773734] to-[#FFF6F0] relative mt-[-10%]">
          <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>
          <form onSubmit={handleChangePassword}>
            <div className="flex flex-col gap-4">
              {/* Old Password */}
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="oldPassword">
                  Old Password:
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20"
                  />
                  <FontAwesomeIcon
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    icon={showOldPassword ? faEyeSlash : faEye}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer"
                  />
                  <input
                    id="oldPassword"
                    name="oldPassword"
                    onChange={(e) => setOldPassword(e.target.value)}
                    value={oldPassword}
                    type={showOldPassword ? "text" : "password"}
                    className="ps-8 rounded-lg py-2 border w-full"
                    placeholder="Enter Old Password"
                    required
                  />
                </div>
              </div>
              {/* New Password */}
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="newPassword">
                  New Password:
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20"
                  />
                  <FontAwesomeIcon
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    icon={showNewPassword ? faEyeSlash : faEye}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer"
                  />
                  <input
                    id="newPassword"
                    name="newPassword"
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                    type={showNewPassword ? "text" : "password"}
                    className="ps-8 rounded-lg py-2 border w-full"
                    placeholder="Enter New Password"
                    required
                  />
                </div>
              </div>
              {/* Confirm New Password */}
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="confirmNewPassword">
                  Confirm New Password:
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20"
                  />
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    value={confirmNewPassword}
                    type={showNewPassword ? "text" : "password"}
                    className="ps-8 rounded-lg py-2 border w-full"
                    placeholder="Confirm New Password"
                    required
                  />
                </div>
              </div>
              {/* Submit Button */}
              <div className="flex justify-center items-center mt-6 text-white">
                <button
                  type="submit"
                  className="bg-[#8A252C] py-2 px-4 w-full rounded-md flex justify-center items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
                  ) : (
                    <>Change Password</>
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

export default ChangePassword;
