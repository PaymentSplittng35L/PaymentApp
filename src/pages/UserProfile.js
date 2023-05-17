import React from 'react';
import { Link } from 'react-router-dom';

import './UserProfile.css'

const SecondPage = () => {
    return (
        <div>
            
        <h1 className="landingtitle">This is the user profile page</h1>
        <button className="button"> <Link to="/Home">Home</Link></button>
        </div>
    );
};

export default SecondPage;