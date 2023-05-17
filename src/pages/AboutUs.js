import React from 'react';
import { Link } from 'react-router-dom';

import './Home.css'

const AboutUs = () => {
    return (
        <div>
        <h1 className="landingtitle">We are in cs35l</h1>
        <button className="button"> <Link to="/Home">Home</Link></button>
        </div>
    );
};

export default AboutUs;