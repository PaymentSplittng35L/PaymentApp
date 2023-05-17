import React from 'react';
import { Link } from 'react-router-dom';

import './Home.css'

const SecondPage = () => {
    return (
        <div>
        <h1 className="landingtitle">This is the second page</h1>
        <button className="button"> <Link to="/Home">Home</Link></button>
        </div>
    );
};

export default SecondPage;