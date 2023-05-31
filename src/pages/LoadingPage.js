import './LoadingPage.css'
import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useHistory } from 'react-router-dom';

export default function LoadingPage(){
   const navigate = useNavigate();
   const inGroup = false; //need to somehow implemenet this, not sure how to do check for in-group or not
   useEffect(() => {
    if (inGroup) {
      navigate('/dashboard');
    } else {
      navigate('/GroupSelection');
    }
  }, [inGroup, navigate]);
  return (
    <div className="loadingScreen">
      <p>Loading...</p>
    </div>
  );
}
