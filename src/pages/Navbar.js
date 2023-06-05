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
    { path: '/contact', label: 'Your Boy Toy' },
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

  return (
    <nav className="bg-gray-900 text-white p-4 text-3xl font-thin">
      <div className="flex justify-between items-center">
        <ul className="flex space-x-4">
          {navbarItems.map((item) => (
            item.path !== location.pathname && (
              <li key={item.path}>
                <Link to={item.path} className="hover:text-gray-300">{item.label}</Link>
              </li>
            )
          ))}
        </ul>
        <div className="relative">
          <span
            className="text-gray-300 mr-2 cursor-pointer"
            onClick={handleEmailClick}
          >
            {userEmail}
          </span>
          {isDropdownVisible && (
            <div
              className="absolute right-0 mt-2 bg-white text-gray-800 py-2 px-4 rounded shadow"
              ref={dropdownRef}
            >
          <button type="button" onClick={() => logout}
            className="message-button bg-red-800 hover:bg-red-700"
          > logout
          </button>
              
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;