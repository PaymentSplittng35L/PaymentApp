import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "./firebase";
import "./NewGroup.css";
import addNewGroup from "../backend/addNewGroup"

function NewGroup() {
  const [groupName, setGroupName] = useState("");
  
  const [user, loading, error] = useAuthState(auth);


  const navigate = useNavigate();
  const register = () => {
    if (!groupName) alert("Please enter name");
    addNewGroup(groupName, user.displayName); //make this an add through newGroup
  };
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);
  return (
    <div className="register">
      <div className="register__container">
        <input
          type="text"
          className="register__textBox"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
        />
        
        <button className="register__btn" onClick={register}>
          Register
        </button>
        
        
      </div>
    </div>
  );
}
export default NewGroup;