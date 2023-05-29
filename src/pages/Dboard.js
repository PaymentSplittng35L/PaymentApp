import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {MdOutlineDocumentScanner} from 'react-icons/md'
import {ImListNumbered} from 'react-icons/im'

function Dboard() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [balance,setBalance] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [paidOffStatus, setPaidOffStatus] = useState(true);
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

  const pastPayments = {
    payments: [
      {
        date: "4/12",
        place: "Mcdonalds",
        amount: "12.94",
        payer: "George",
        groupPeople: "Bob, Martha, George"
      },
  
      {
        date: "3/19",
        place: "Dominos",
        amount: "17.24",
        payer: "Martha",
        groupPeople: "Bob, Martha"
      },
      {
        date: "9/10",
        place: "Rubios",
        amount: "9.93",
        payer: "George",
        groupPeople: "George"
      },
      {
        date: "4/12",
        place: "Mcdonalds",
        amount: "12.94",
        payer: "George",
        groupPeople: "Bob, Martha, George"
      },
  
      {
        date: "3/19",
        place: "Dominos",
        amount: "17.24",
        payer: "Martha",
        groupPeople: "Bob, Martha"
      },
      {
        date: "9/10",
        place: "Rubios",
        amount: "9.93",
        payer: "George",
        groupPeople: "George"
      },
      {
        date: "4/12",
        place: "Mcdonalds",
        amount: "12.94",
        payer: "George",
        groupPeople: "Bob, Martha, George"
      },
  
      {
        date: "3/19",
        place: "Dominos",
        amount: "17.24",
        payer: "Martha",
        groupPeople: "Bob, Martha"
      },
      {
        date: "9/10",
        place: "Rubios",
        amount: "9.93",
        payer: "George",
        groupPeople: "George"
      },
      ],
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

  const getSomeGroup = async () => {
    try{
      const quer = query(collection(db,"Groups"),where("users", "array-contains", name));
      const docs = await getDocs(quer);
      const data = docs.docs[0].data();
      setGroupName(data.name);
      setPaidOffStatus(data.paidOff);
      setBalance(data.Balance);
      //console.log(data.paidOff);

    }
    catch(err){
      console.error(err);
      //alert("You are not affiliated with a group!!");
    }


  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    getSomeGroup();
    console.log("Your username is " + name);
    console.log("Your groupname is ", groupName);
    console.log("Your group balance is " + balance);
    console.log("Status on being paid off: " + paidOffStatus);
  }, [user, loading, navigate, fetchUserName]);



  return (
    <div className = "wholePage">
    <div className="Dboard">
       <div className="Dboard_navbar">
         
          <div className="Dboard_nav_buttons">
            <button className="Dboard__btn">Manage Groups</button>
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
      <div className = "header1" >Welcome back {name}. </div>
    <div className = "groupBalance" style={{ fontSize: '40px' }}>
      <p>{groupName}'s Trip Receipt</p>
      
    
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
