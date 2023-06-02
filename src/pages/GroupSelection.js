import './GroupSelection.css'
import './Dboard.css'
import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useHistory } from 'react-router-dom';
import {AiOutlinePlusCircle} from 'react-icons/ai';
import {CgEnter} from 'react-icons/cg';
import {FiSettings} from 'react-icons/fi';
import currentGroupVar from './currentGroupVar';

export default function GroupSelection(){

    const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [balance,setBalance] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [paidOffStatus, setPaidOffStatus] = useState(true);
  const [gotGroups, setgotGroups] = useState(false);

  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      //console.log(name);
      //console.log(name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const getGroupsForUser = async (name) => {
    try{
        console.log("Called function");
      const quer = query(collection(db,"Groups"),where("users", "array-contains", name));
      const querySnapshot = await getDocs(quer);
      if(querySnapshot.empty == false){
        setgotGroups(true);
      }
      else{
        setgotGroups(false);
      }
      const groupList = querySnapshot.docs.map((doc) => {
        const groupData = doc.data();
        console.log(groupData.name);
        return {
            id: doc.id,
            name: groupData.name,
            userList: groupData.userList,

        };
      });
      return groupList;

    }
    catch(err){
      console.error(err);
      //alert("You are not affiliated with a group!!");
      return [];
    }


  };

  useEffect(() => {
    const getData = async() => {
        if (loading) return;
        if (!user) return navigate("/");
        console.log("Hello");
        fetchUserName();
        if(!gotGroups){
            const finalGroupList = await getGroupsForUser(name);
            const groupNames = finalGroupList.map((group) => group.name);
            setGroupNames(groupNames);
            console.log("Group names is" + groupNames);
            console.log("Set of groups " + finalGroupList);
            console.log("Your username is " + name);
        }

    };

    getData();
    
   // console.log("Your groupname is ", groupName);
   // console.log("Your group balance is " + balance);
    //console.log("Status on being paid off: " + paidOffStatus);
  }, [user, loading, navigate, fetchUserName]);

  const [groupNames, setGroupNames] = useState([]);

  const groupNameArr = ["testGrouerh", "anotherTest", "aThirdTest", "anotherTest", "anotherTest", "aThirdTest" ];
  const colorChoices = ["#b5ecf7", "#f0dda1", "#bddebd", "#d9ccf0",  "#f7b0ad", "#b2f2a2"]
  return (
    <div className="Dboard">
       <div className="Dboard_navbar">
         
          <div className="Dboard_nav_buttons">
            <button className="Dboard__btn"><Link to="/GroupSelection">Manage Groups</Link></button>
            <button className="Dboard__btn">My Payments</button>
            <div class="dropdown">
              <div className = "centered-text">
                <button class="Dboard__btn">{user?.email}</button>
              </div>
              
              <div class="dropdown-child" onClick = {logout}>
                Logout
              </div>
            </div>
            {/*<button className="Dboard__btn">{user?.email}</button>*/}
             
          </div>
       </div>
    <div className="grid-container">
        <div class="grid">
            <div className="square" style={{backgroundColor: "#e3e1e1"}}>
                <p>Add / Join Group</p>
                <Link to="/NewGroup" className="plusSymbol">
                    <AiOutlinePlusCircle size={69}/>
                </Link>
                
            
            </div>

            {groupNames.map((groupName, index) => (
                <div key = {index} className="square" style={{backgroundColor: colorChoices[index % colorChoices.length]}}>
                    <div className="square-text">
                        {groupName}
                    </div>
                    <div className="square-contain">
                    <Link 
                        to={'/dashboard'}
                        state={{currGroupName: groupName}}
                        >
                            <div className="subSquare">
                            <CgEnter size={65}/>
                            </div>       
                     </Link>
                     
                     <Link 
                        to={'/dashboard'}
                        state={{currGroupName: groupName}}
                        >
                            <div className="subSquare2">
                            <FiSettings size={62}/>
                            </div>
      
                     </Link>
                        </div>
                </div>
            )
            )}
            
        </div>
      <p></p>
    </div>
    </div>
  );
}
