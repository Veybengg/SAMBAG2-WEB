import React from "react";
import image from '../assets/Sambag3.png'
import {Link} from 'react-router-dom'

const Sidebar = ({children}) => {
  return (
    <div className="flex">
        {children}
      <div className="h-screen w-24 sm:w-32 md:w-36 lg:w-44" style={{ boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",  background: `linear-gradient(to top, rgba(109, 124, 168, 0.75), rgba(37, 59, 121, 0.75))` }}>
            <div className="flex justify-center pt-6">
            <img className="h-20 w-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full shadow-md bg-cover" src={image} alt="" />
            </div>
            <div className="border-b border-white mt-6"></div>
            <div className="flex flex-col items-center">
            <h1 className="font-medium mt-10">OFFICIALS</h1>
            <h1 className="font-medium mt-10">SK COUNCIL</h1>
            
            </div>
        </div>
        
    </div>
  );
};


export default Sidebar;
