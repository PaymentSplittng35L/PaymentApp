import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth, db, logout } from "./firebase";


function Navbar({ userEmail }) {
  const location = useLocation();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const navbarItems = [
    { path: '/Inbox', label: 'Inbox' },
    { path: '/GroupSelection', label: 'My Groups' },
  ];

  const handleEmailClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleDocumentClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  const logstuff = () =>{
    logout();
  };


  return (
    <nav className="bg-gray-800 text-white p-4 text-3xl font-thin">
      {/* Navigation bar container */}
      <div className="flex justify-between items-center">
        {/* Navigation items */}
        <ul className="flex space-x-4 text-lg md:text-2xl lg:text-3xl">
          {/* Mapping over navbarItems */}
          {navbarItems.map((item) => (
            // Render the item only if its path is not equal to the current location pathname
            item.path !== location.pathname && (
              <li key={item.path}>
                {/* Render a link for each item */}
                <Link to={item.path} className="hover:text-gray-300">{item.label}</Link>
              </li>
            )
          ))}
        </ul>
        {/* User dropdown */}
        <div className="relative">
          {/* Display user email */}
          <span className="text-gray-300 mr-2 cursor-pointer" onClick={handleEmailClick}>
            {userEmail}
          </span>
          {/* Display dropdown if isDropdownVisible is true */}
          {isDropdownVisible && (
            <div
              className="absolute right-0 mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow"
              ref={dropdownRef}
            >
              {/* Logout button */}
              <button className="bg-white text-gray font-bold py-1 px-1 rounded" onClick={logstuff}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;