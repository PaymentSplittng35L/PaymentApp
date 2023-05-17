import React from 'react';
import { Link } from 'react-router-dom';

import './LoginPage.css'

const LoginPage = () => {
    return (
        <div>
            
        <h1 className="landingtitle">This is the login page</h1>
        <button className="button"> <Link to="/Home">Home</Link></button>
        </div>
    );
};

export default LoginPage;