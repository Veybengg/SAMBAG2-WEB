import React, { useState } from 'react';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import img from '../../assets/viewing/Sambag3.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [xmark, setXmark] = useState(false);
  const [officialsMenu, setOfficialsMenu] = useState(false); // Add officialsMenu state variable
  const [headroomVisible, setHeadroomVisible] = useState(true); // State to manage visibility of Headroom

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      // Hide Headroom after scrolling to section
      setHeadroomVisible(false);
    }
  };

  return (
    <div>
      <div>
        <div className="flex justify-between items-center px-10" style={{ background: '#FFF6F0' }}>
          <div>
            <img className="h-20 w-18 sm:w-23 sm:h-20 md:w-32 md:h-23 lg:w-20 lg:h-23" src={img} alt="Logo" />
          </div>
          <div>
            <ul className="flex items-center h-20">
              <li className="md:hidden">
                {xmark ? (
                  <button>
                    <FontAwesomeIcon onClick={() => { setMenu(false); setXmark(false); }} icon={faTimes} />
                  </button>
                ) : (
                  <button onClick={() => { setMenu(true); setXmark(true); }}>
                    <FontAwesomeIcon icon={faBars} className="text-md relative" />
                  </button>
                )}
              </li>
              {menu ? (
                <div>
                  <div className="h-auto w-40 absolute top-20 text-white right-4 flex flex-col items-center">
                    <li>
                      <button onClick={() => { scrollToSection('home'); setMenu(false); setXmark(false); }} className="bg-transparent text-black hover:bg-[#8A252C] hover:text-white py-2 px-5 rounded-md">HOME</button>
                    </li>
                    
                    <li
                      className="relative"
                      onMouseEnter={() => setOfficialsMenu(true)}
                      onMouseLeave={() => setOfficialsMenu(false)}
                    >
                      <button className="bg-transparent text-black hover:bg-[#8A252C] hover:text-white py-2 px-5 rounded-md">OFFICIALS</button>
                      {officialsMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-md">
                          <ul>
                            <li>
                              <button onClick={() => { scrollToSection('barangay-officials'); setMenu(false); setXmark(false); }} className="text-black hover:bg-[#8A252C] hover:text-white py-2 px-5 rounded-md block">Barangay Officials</button>
                            </li>
                            <li>
                              <button onClick={() => { scrollToSection('sk-officials'); setMenu(false); setXmark(false); }} className="text-black hover:bg-[#8A252C] hover:text-white py-2 px-5 rounded-md block">SK Officials</button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </li>
                    <li>
                      <button onClick={() => { scrollToSection('events'); setMenu(false); setXmark(false); }} className="bg-transparent text-black hover:bg-[#8A252C] hover:text-white py-2 px-5 rounded-md">ALERT</button>
                    </li>
                    <li>
                      <button onClick={() => scrollToSection('contact')} className="text-black bg-transparent hover:bg-[#8A252C] hover:text-white transform hover:scale-110 transition duration-300 ease-in-out py-2 px-5 rounded-md">CONTACT US</button>
                    </li>
                  </div>
                </div>
              ) : (
                <>
                  <div className="md:text-sm font-medium md:gap-6 hidden md:flex justify-center items-center gap-10">
                    <li className="md:flex">
                      <button onClick={() => scrollToSection('home')} className="text-black bg-transparent hover:bg-[#8A252C] hover:text-white transform hover:scale-110 transition duration-300 ease-in-out py-2 px-5 rounded-md">HOME</button>
                    </li>
                   
                    <li
                      className="relative"
                      onMouseEnter={() => setOfficialsMenu(true)}
                      onMouseLeave={() => setOfficialsMenu(false)}
                    >
                      <button className="text-black bg-transparent hover:bg-[#8A252C] hover:text-white transform hover:scale-110 transition duration-300 ease-in-out py-2 px-5 rounded-md">OFFICIALS</button>
                      {officialsMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-[5px] shadow-md pb-1">
                          <ul>
                            <li>
                              <button onClick={() => scrollToSection('barangay-officials')} className="text-black hover:bg-[#8A252C] hover:text-white transform hover:scale-110 transition duration-300 ease-in-out py-2 px-5 rounded-[5px] block">Barangay Officials</button>
                            </li>
                            <li>
                              <button onClick={() => scrollToSection('sk-officials')} className="text-black hover:bg-[#8A252C] hover:text-white transform hover:scale-110 transition duration-300 ease-in-out py-2 px-5 rounded-[5px] block">SK Officials</button>
                            </li>
                            
                          </ul>
                        </div>
                      )}
                    </li>
                    <li>
                      <button onClick={() => scrollToSection('events')} className="text-black bg-transparent hover:bg-[#8A252C] hover:text-white transform hover:scale-110 transition duration-300 ease-in-out py-2 px-5 rounded-md">ALERT</button>
                    </li>
                    <li>
                      <button onClick={() => scrollToSection('contact')} className="text-black bg-transparent hover:bg-[#8A252C] hover:text-white transform hover:scale-110 transition duration-300 ease-in-out py-2 px-5 rounded-md">CONTACT US</button>
                    </li>
                    <li>
                      <Link to='/login'><button className="text-black bg-transparent hover:bg-[#8A252C] hover:text-white transform hover:scale-110 transition duration-300 ease-in-out py-2 px-5 rounded-md">LOGIN</button></Link>
                    </li>
                  </div>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
