
import React, { useEffect, useState, useCallback } from "react";
import "./NewGroup.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where, doc, setDoc,addDoc } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {MdOutlineDocumentScanner} from 'react-icons/md'
import {ImListNumbered} from 'react-icons/im'
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { updateDoc } from 'firebase/firestore';
import Navbar from './Navbar';

const NewGroup = () => {
  const [showPopup, setShowPopup] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [joinGroupName, setGroupName2] = useState('')
  const [user, loading] = useAuthState(auth);
  const [arr, setArr] = useState('');
  const [gotUser,setGotUser] = useState(false);
  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };
  const handleGroupNameChange2 = (event) => {
    setGroupName2(event.target.value);
  };

  const [name, setName] = useState("");
  
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setGotUser(true);
      //console.log(name);
      //console.log(name);
    } catch (err) {
      console.error(err);
      //alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    const getData = async() => {
      console.log("username is ",name);
      if (loading) return;
      if (!user) return navigate("/");

      if(!gotUser){
        fetchUserName();
      }


  };

  getData();
}, [user,loading,navigate,gotUser]);

  

 
  //this is for creating groups
  const handleSubmit = async (event) => {
    event.preventDefault();

    const q = await query(collection(db, "Groups"), where("name", "==", groupName));
    const doc = await getDocs(q);
    
    if(!doc.empty){
      alert("The groupname you tried to create already exists!");
      return;
    }

    await addDoc(collection(db, "Groups"), {
        name: groupName,
        users: [name],
        hasEvent: false
      });

    // await addDoc(collection(db,"Event"), {
    //     Date: "sample data",
    //     Place: "sample data",
    //     amountPaid : "0",
    //     groupName:groupName,
    //     mealName:"sample event",
    //     namePaid: [name],
    //     peopleAttending: ["sample atendee"]
    // });
    setGroupName('');
  };
  //this is for joining groups
  const joinGroupSubmit = async (event) => {
    event.preventDefault();
    
    const q = await query(collection(db, "Groups"), where("name", "==", joinGroupName));
    const doc = await getDocs(q);
    if (!doc.empty) {
      console.log("Not empty!");
      const data = doc.docs[0].data();
      const usersArray = data.users || [];
      if (usersArray.includes(name)) {
        console.log("Name already exists in usersArray");
        alert("You are already a part of this group!");
        return;
      } else {
        console.log("Name does not exist in usersArray");
        const users = [...usersArray, name];
        const docRef = doc.docs[0].ref;
        await updateDoc(docRef, { users });
    
          setArr(users);
        // Continue with your logic...
      }
    
      {/*}
      const docReftwo = doc(db, "Groups", doc.docs[0].id);
    await updateDoc(docReftwo, { users }); */}

    }
    else{
      console.log("Error; group doesnt exists");
      alert("Group does not exist");
    }
  
    setGroupName2('');
  };
  

  return (
    <div id="inbox" className="bg-gray-900 text-white">
    <Navbar userEmail={user?.email}/>
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
    </div>
  );
};






export default NewGroup;