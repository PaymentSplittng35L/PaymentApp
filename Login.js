import React from 'react';
import { Link } from 'react-router-dom';

import './Login.css'

const AboutUs = () => {
    return (
        <div>
        <h1 className="landingtitle">This is the login page!</h1>
        <button className="button"> <Link to="/UserProfile">Click here to log in</Link></button>
        <button className="button"> <Link to="/Home">Home</Link></button>
        </div>
    );
};

export default AboutUs;