
import React from 'react';
import Home from './Home';
import Events from './ReportsMap';
import Footer from '../Header/Footer';

const Layout = () => {
  return (
    <div className="flex flex-col w-full">
      <Home />
      <Events />
      <Footer />
    </div>
  );
}

export default Layout;
