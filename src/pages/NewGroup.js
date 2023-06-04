
import React, { useEffect, useState, useCallback } from "react";
import "./NewGroup.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where, doc, setDoc,addDoc } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {MdOutlineDocumentScanner} from 'react-icons/md'
import {ImListNumbered} from 'react-icons/im'
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";


const NewGroup = () => {
  const [showPopup, setShowPopup] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [joinGroupName, setGroupName2] = useState('')
  const [user, loading] = useAuthState(auth);
  const [arr, setArr] = useState('');

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };
  const handleGroupNameChange2 = (event) => {
    setGroupName2(event.target.value);
  };

 

  const handleSubmit = async (event) => {
    event.preventDefault();


    await addDoc(collection(db, "Groups"), {
        name: groupName,
        users: [user.uid]
      });

  
    setGroupName('');
  };

  const joinGroupSubmit = async (event) => {
    event.preventDefault();
  
    const q = collection(db, "Groups");
    const querySnapshot = await getDocs(query(q, where("name", "==", joinGroupName)));
  
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      const usersArray = data.users || []; // If users array doesn't exist, initialize it as an empty array
      const newUsers = [...usersArray, user.uid];
  
      await setDoc(doc.ref, { users: newUsers }, { merge: true });
      setArr(newUsers);
    }
  
    setGroupName2('');
  };
  

  return (
    <>

    <div>
      <h1>Create Group</h1>
      <div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="group-name">Group Name:</label>
          <input
            type="text"
            id="group-name"
            value={groupName}
            onChange={handleGroupNameChange}
          />
        </div>
        <button type="submit">Create Group</button>
      </form>
    </div>


    <div>
      <h1>Join Group</h1>
      <div>
        <p>Enter Join Code:</p>
      </div>
      <form onSubmit={joinGroupSubmit}>
        <div>
          <label htmlFor="group-name">Group Name:</label>
          <input
            type="text"
            id="group-name"
            value={joinGroupName}
            onChange={handleGroupNameChange2}
          />
        </div>
        <button type="submit">Join Group</button>
      </form>
    
    </div>
    </>
  );
};






export default NewGroup;
