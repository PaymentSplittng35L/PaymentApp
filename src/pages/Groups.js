
import React, { useEffect, useState, useCallback } from "react";

import "./Groups.css";
// import { auth, db, logout } from "./firebase";
// import { query, collection, getDocs, where } from "firebase/firestore";
// import { Line } from "react-chartjs-2";
// import {MdOutlineDocumentScanner} from 'react-icons/md'
// import {ImListNumbered} from 'react-icons/im'
// import { useAuthState } from "react-firebase-hooks/auth";
// import { useNavigate } from "react-router-dom";


const Groups = () => {
  const [name, setName] = useState('');

  const handleChange = (event) => {
    setName(event.target.value);
  }

  return (
    <div>
      <h1>Welcome to the Greeting Page!</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={handleChange}
      />
      {name && <p>Hello, {name}!</p>}
    </div>
  );

}

export default Groups;

