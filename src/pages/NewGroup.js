
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
  const [user, loading] = useAuthState(auth);

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };


 

  const handleSubmit = async (event) => {
    event.preventDefault();


    await addDoc(collection(db, "Groups"), {
        name: groupName,
        users: [user.uid]
      });

  
    setGroupName('');
  };

  const joinGroupSubmit= async (event) => {
    event.preventDefault();
    //take the groupName and query a group to see if it exists. If it does take the array, push the new id, then upload that to firebase
    const q = query(collection(db, "Groups"), where("name", "==", groupName));
    const doc = await getDocs(q);
    
    const data = doc.docs[3].data(); //double check that this gets the array of names
    let arr = data.push(user.uid);
    //let arr = [];
    await setDoc(collection(db, "Groups"), {
        users: arr
      },{ merge: true });

    setGroupName('');
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
            value={groupName}
            onChange={handleGroupNameChange}
          />
        </div>
        <button type="submit">Join Group</button>
      </form>
    
    </div>
    </>
  );
};






export default NewGroup;
