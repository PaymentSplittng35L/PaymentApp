
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
   
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleMemberChange = (event, index) => {
    const updatedMembers = [...members];
    updatedMembers[index] = event.target.value;
    setMembers(updatedMembers);
  };

  const handleAddMember = () => {
    setMembers([...members, '']);
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();


    await addDoc(collection(db, "Groups"), {
        name: groupName,
        users: members
      });

    // Perform the necessary action with the group data
    // console.log('Group Name:', groupName);
    // console.log('Members:', members);
    // Reset the form
    setGroupName('');
    setMembers([]);
  };

  return (
    <>

    <div>
      <h1>Create Group</h1>
      <div>
        <p>Note: Do we want to do leader adds everyone manually or join code?</p>
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
        <div>
          <label>Members:</label>
          {members.map((member, index) => (
            <div key={index}>
              <input
                type="text"
                value={member}
                onChange={(event) => handleMemberChange(event, index)}
              />
              <button type="button" onClick={() => handleRemoveMember(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddMember}>
            Add Member
          </button>
        </div>
        <button type="submit">Create Group</button>
      </form>
    </div>
    </>
  );
};

export default NewGroup;
