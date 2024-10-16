import React, { useState } from 'react';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faChartSimple, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

// Loader component (spinner)
const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-white" />
  </div>
);

const AnalyticsComponent = () => {
  const [analytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate(); // To navigate programmatically

  const handleNavigation = (path) => {
    setLoading(true); // Start loading spinner

    // Simulate loading time with a 2-second delay before navigating
    setTimeout(() => {
      setLoading(false); // Stop loading spinner
      navigate(path); // Navigate to the specified path after delay
    }, 2000); // 2-second delay
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Loader (only show while loading) */}
      {loading && <Loader />}

      {/* Main Content */}
      <div className='grid grid-cols-3'>
        <a className='bg-[#8A252C] flex justify-center items-center text-white py-3' href="/map-dashboard">
          <h1>Todays Reports</h1>
        </a>
        <div className='bg-[#801B22] text-white flex justify-center items-center gap-3 relative'>
          <button className='flex gap-2' onClick={() => setShowAnalytics(!analytics)}>
            <h1><FontAwesomeIcon icon={faChartSimple} /> Analytics</h1>
            <h1><FontAwesomeIcon icon={faCaretUp} className='h-3' /></h1>
          </button>
        </div>
        <button onClick={() => handleNavigation('/history')} className='bg-[#801B22] text-white border-r w-full py-3 border-white border-opacity-50'>
          History
        </button>
      </div>

      {/* Analytics Dropdown */}
      {analytics && (
        <div className='grid grid-cols-3'>
          <div></div>
          <div className='grid grid-rows-2 bg-white shadow-md'>
            <button onClick={() => handleNavigation('/monthly-analytics')} className='shadow rounded-sm hover:bg-[#A53400] w-full hover:text-white'>
              Monthly Reports
            </button>
            <button onClick={() => handleNavigation('/yearly-analytics')} className='shadow rounded-sm hover:bg-[#A53400] w-full hover:text-white'>
              Yearly Reports
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsComponent;
