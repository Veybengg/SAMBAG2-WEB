import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import MapDashboard from './Pages/Map/MapDashboard';
import { useAuthStore } from './Frontend-auth/auth.controller';
import { Navigate } from 'react-router-dom';

import MonthlyAnalytics from './Pages/Map/MonthlyAnalytics';
import AnnualAnalytics from './Pages/Map/AnnualAnalytics';
import YearlyAnalytics from './Pages/Map/YearlyAnalytics';
import History from './Pages/Map/History';
import ForgotPass from './Pages/ForgotPass';
import Navbar from '../src/viewing/Header/Navbar';
import ChangePassword from './Pages/ChangePassword';
import Headroom from 'react-headroom';
import Layout from './viewing/Pages/Layout';

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated && !role) {
    return <Navigate to='/login' replace />;
  }
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (isAuthenticated) {
    if (role === 'admin' || role === 'employee') {
      return <Navigate to='/map-dashboard' replace />;
    }
  }
  return children;
};

function App() {
  const { checkingAuth, isAuthenticated, user, role } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkingAuth();
  }, [checkingAuth]);

  console.log('isAuthenticated', isAuthenticated);
  console.log('user', user);
  console.log('role', role);

  // Define condition to only show Navbar on root path '/'
  const showNavbar = location.pathname === '/';

  return (
    <>
      <div>
        {/* Conditionally render Navbar only on the root path '/' */}
        {showNavbar && (
          <Headroom>
            <Navbar />
          </Headroom>
        )}
        <Routes>
          <Route path='/' element={<Layout />} />
          <Route
            path='/login'
            element={
              <RedirectAuthenticatedUser>
                <Login />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path='/map-dashboard'
            element={
              <ProtectedRoutes>
                <MapDashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path='/monthly-analytics'
            element={
              <ProtectedRoutes>
                <MonthlyAnalytics />
              </ProtectedRoutes>
            }
          />
          <Route
            path='/annual-analytics'
            element={
              <ProtectedRoutes>
                <AnnualAnalytics />
              </ProtectedRoutes>
            }
          />
          <Route
            path='/yearly-analytics'
            element={
              <ProtectedRoutes>
                <YearlyAnalytics />
              </ProtectedRoutes>
            }
          />
          <Route
            path='/history'
            element={
              <ProtectedRoutes>
                <History />
              </ProtectedRoutes>
            }
          />
          <Route
            path='/signup'
            element={
              <ProtectedRoutes>
                <Signup />
              </ProtectedRoutes>
            }
          />
          <Route
            path='/change-password'
            element={
             
                <ChangePassword />
              
            }
          />
          <Route path='/reset-password' element={<ForgotPass />} />
        </Routes>
      </div>
    </>
  );
}

export default App;