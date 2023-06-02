import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Dboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {MdOutlineDocumentScanner} from 'react-icons/md'
import {ImListNumbered} from 'react-icons/im'
import { useLocation} from 'react-router-dom';
import {Node,Graph} from './Graph.js'


function Dboard() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [balance,setBalance] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const currGroupName = location.state && location.state.currGroupName;
  console.log("The current group name is " + currGroupName);

  const [eventArray, setEventArray] = useState([]);
  const [eventInfo, setEventInfo] = useState([])
  const [eventFound, setEventFound] = useState(false);

  const addDocument = async (Date,Place,amountPaid,groupName,mealName,namePaid) => {
    const dataToBeFed = {Date,Place,amountPaid,groupName,mealName,namePaid};

    try {
      const docRef = await addDoc(collection(db, "Event"), dataToBeFed);
      setEventFound(false);
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };

  const addToEventInfo = (place,payer,amountPaid,date) => {
    const newEventInformation = {place,payer,amountPaid,date};
    setEventInfo([...eventInfo,newEventInformation]);
  };

  //TRYING IT OUT
  //HERE DUDE
  //const test = new Node('MyFirstNode');
  //test.addEdge("Joe", 10);
  //test.addEdge("Joe", 15);
  //test.addEdge("Joe", 3);
  //test.printEdges();
  //test.printEdges();
  //console.log("\n");
  //test.removeParallelEdges();
  //test.printEdges();




  const addToEventArray = (element) => {
    setEventArray([...eventArray,element]);
  };

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

  const getSomeGroup = async (paramGroup) => {
    try {
      const quer = query(collection(db, "Groups"), where("name", "==", paramGroup));
      const docs = await getDocs(quer);
      const data = docs.docs[0].data();
      setGroupName(data.name);
      setEventArray(data.Events);
      setGroupUsers(data.users);
      const eq = query(collection(db, "Event"), where("groupName", "==", groupName));
      const eventDoc = await getDocs(eq);
      
      if(!eventDoc.empty){
        setEventFound(true);
      }
      const eventDatabase = [];
      eventDoc.forEach((document) => {
        const place = document.data().Place;
        const payer = document.data().namePaid[0];
        const amountPaid = document.data().amountPaid;
        const date = document.data().Date;
        const newEventInformation = {place, payer, amountPaid,date};

        eventDatabase.push(newEventInformation);
      });
      setEventInfo(eventDatabase);
      // console.log(eventInfo[0].date); // Access the updated state
      // console.log(eventInfo[1].date); // Access the updated state

    } catch (err) {
      console.error(err);
      alert("You are not affiliated with a group!!");
    }
  };

  //This is where we are working
  const names = groupUsers;
  const dummy = new Graph(groupName,names);
  function getDebtors(allNames,payerName){
    return allNames.filter(item => item !== payerName);
  }
  eventInfo.forEach(ev =>{
    const debts = getDebtors(names,ev.payer);
    dummy.groupPurchase(ev.payer, debts, ev.amountPaid);
  });
  dummy.Opium();
  dummy.printNodesAndEdges();

  const pastPayments = {
    payments: eventInfo.map((event) => ({
      date: event.date,
      place: event.place,
      amount: event.amountPaid,
      payer: event.payer,
      groupPeople: event.groupPeople,
    })),
      userPayments: [
        {
          date: "4/5",
          otherUser: "George",
          amount: "6.79",
        },
        {
          date: "9/12",
          otherUser: "Martha",
          amount: "16.79",
        },
        {
          date: "10/12",
          otherUser: "George",
          amount: "2.59",
        },
        {
          date: "9/1",
          otherUser: "Yoland",
          amount: "19.50",
        },
        {
          date: "2/5",
          otherUser: "Bertha",
          amount: "79.40",
        },
    
        
        ],
      
  }


  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    if(!eventFound){
      getSomeGroup(currGroupName);
    }
      console.log("Your username is " + name);
    console.log("Your groupname is ", groupName);

  }, [user, loading, navigate, fetchUserName]);



  return (
    <div className = "wholePage">
    <div className="Dboard">
       <div className="Dboard_navbar">
         
          <div className="Dboard_nav_buttons">
            <button className="Dboard__btn"><Link to="/GroupSelection">Manage Groups</Link></button>
            <button className="Dboard__btn" onClick={() => addDocument("6/2","BJs",81,"testgroup","breakfast",["sanjay"])}>My Payments</button>
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
      <div className = "header1" >Welcome back {name}. </div>
    <div className = "groupBalance" style={{ fontSize: '40px' }}>
      <p>{currGroupName}'s Trip Receipt</p>
      
    
  <div className = "DataTitle">Recent Group Payments</div>

<div className = "dataTable">
      <table className = "tableFormat">
      <tbody>
        {/*
          <tr>
            <td>Place</td>
            {pastPayments.payments.map((item, i) => (
              <td key={i}>{item.place}</td>
            ))}
            </tr>  */}

        <tr>
          <td>Date</td>
          {pastPayments.payments.map((item, i) => (
            <td key={i}>{item.date}</td>
          ))}
        </tr>
       
        <tr>
          <td>Payer</td>
          {pastPayments.payments.map((item, i) => (
            <td key={i}>{item.payer}</td>
          ))}
        </tr>
        <tr>
          <td>Place</td>
          {pastPayments.payments.map((item, i) => (
            <td key={i}>{item.place}</td>
          ))}
        </tr>
        <tr>
          <td>Amount</td>
          {pastPayments.payments.map((item, i) => (
            <td key={i}>${item.amount}</td>
          ))}
        </tr>
    </tbody>
    </table>

    


</div>

<p>Remaining balance: ${balance} </p>


      
      </div>
      
  <div className="label1">
    <p>Enter a new Payment</p>
  </div>
  <div className="pictureButton">

    <div className="scanReceipt">
        <p>Scan a receipt</p>
        <MdOutlineDocumentScanner size={48}/>
      </div>

    <div className="inputManual">
      <p>Manual Input</p>
      <ImListNumbered size={40}/>

    </div>

    <div className="yourPayments">
      <div className="paylabel">
        <p>Manage your payments</p>
      </div>
      <div className = "dataTable2">
      <table className = "tableFormat2">
      <tbody>
        {/*
          <tr>
            <td>Place</td>
            {pastPayments.payments.map((item, i) => (
              <td key={i}>{item.place}</td>
            ))}
            </tr>  */}

        <tr>
          <td>Date</td>
          {pastPayments.userPayments.map((item, i) => (
            <td key={i}>{item.date}</td>
          ))}
        </tr>
       
        <tr>
          <td>Pay to</td>
          {pastPayments.userPayments.map((item, i) => (
            <td key={i}>{item.otherUser}</td>
          ))}
        </tr>
       
        <tr>
          <td>Amount</td>
          {pastPayments.userPayments.map((item, i) => (
            <td key={i}>${item.amount}</td>
          ))}
        </tr>
    </tbody>
    </table>

    

</div>
    </div>
  </div>
     </div>
     </div>
  );
}
export default Dboard;
