import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from "../assets/sambaglogo.png";
import { faGear, faRightFromBracket, faUser, faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthStore } from '../Frontend-auth/auth.controller';
import navImg from '../assets/navImg.png';

const Navbar = () => {
  const { forLogout, role } = useAuthStore();
  const [showSetting, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleActionWithDelay = async (action, path) => {
    setLoading(true); // Show the loader
    if (action) {
      await action(); // Perform the action (like logout)
    }
    setTimeout(() => {
      setLoading(false); // Hide loader after 3 seconds
      navigate(path); // Navigate to the desired page
    }, 2000); // 3000ms = 3 seconds delay
  };

  return (
    <>
      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-white text-6xl" />
        </div>
      )}

      <header 
        className="flex justify-between items-center px-6 py-4 bg-contain bg-center" 
        style={{ backgroundImage: `url(${navImg})` }}  
      >
        <div className="flex items-center gap-6">
          <img className="h-[60px] w-18" src={logo} alt="Logo" />
          <h1 className="text-2xl text-white">ALERT SYSTEM</h1>
        </div>
        <div className='relative mr-10'>
          <button>
            <FontAwesomeIcon className="h-8 w-8 text-white" icon={faGear} onClick={() => setShowSettings(!showSetting)} />
          </button>
          {showSetting && (
            <div className='absolute bg-white flex flex-col justify-center py-1 px-1 left-1/2 transform -translate-x-1/2 rounded-md text-sm z-50'>
              <button 
                onClick={() => handleActionWithDelay(forLogout, '/login')} 
                className='flex items-center px-1 py-0.5 gap-2 hover:bg-[#801B22] hover:text-white'
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </button>
              {role === 'admin' && (
                <button 
                  onClick={() => handleActionWithDelay(null, '/signup')} 
                  className='flex items-center px-1 py-0.5 gap-2 hover:bg-[#801B22] hover:text-white whitespace-nowrap'
                >
                  <FontAwesomeIcon icon={faUser} />
                  Create Account
                </button>
              )}
              <button 
                onClick={() => handleActionWithDelay(null, '/change-password')} 
                className='flex items-center px-1 py-0.5 gap-2 hover:bg-[#801B22] hover:text-white whitespace-nowrap'
              >
                <FontAwesomeIcon icon={faLock} />
                Change Password
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
