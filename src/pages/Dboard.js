import React, { useEffect, useState, useCallback, useRef } from "react";
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
import { OptimizeCosts } from './GreedyAlgorithm.js'
import {AiOutlineCloseCircle} from 'react-icons/ai';
import Modal from 'react-modal';
import Select from 'react-select';
import { docs, updateDoc, doc, setDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import Chart from 'chart.js/auto';

function Dboard() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [balance,setBalance] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);
  const [finalGraphEdges, setFinalGraphEdges] = useState([]);
  const [readyToUpload,setReadyToUpload] = useState(false);
  const navigate = useNavigate();
  const [closing, setClosing] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [buttonFix,setButtonFix] = useState(false);
  const [buttonCounter,setButtonCounter] = useState(0);
  const location = useLocation();
  const currGroupName = location.state && location.state.currGroupName;
  console.log("The current group name is " + currGroupName);

  const [eventInfo, setEventInfo] = useState([])
  const [eventFound, setEventFound] = useState(false);
  const [emptyList, setEmptyList] = useState(false);
  const [graphObjectMake, setGraphObjectMake] = useState(true);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const chartRef = useRef(null);
  const [gotGraph, setGotGraph] = useState(false);
  const [startGraph, setStartGraph] = useState(false);

  const allUsers = groupUsers.map(name => {
    return {
      value: name.toLowerCase(),
      label: name
    };
  });
  

  const current = new Date();
  const month = (current.getMonth()+1).toString();
  const day = (current.getDate()).toString();
  const currDate = month + '/' + day;
  const [paymentValues, setPaymentValues] = useState({
    totalPrice: '',
    personPaid: '',
    place: '',
    date: currDate,
    description: '',
    // Add more fields as needed
  });

  const validateForm = () => {
    const { totalPrice, personPaid, place, date, description} = paymentValues;
  
    // Check if any required field is empty
    if (!totalPrice || !selectedUsers || !date || !place || !personPaid || !description) {
      if(!totalPrice){
        alert("totalprice not there!");
      }
      if(!selectedUsers){
        alert("selected users not there!")
      }
     
      if(!date){
        alert("No description");
      }
      if(!place){
        alert("No place");
      }
      if(!personPaid){
        alert("No personPaid");
      }
      if(!description){
        alert("No description");
      }
      return false;
    }
    if(personPaid === "select"){
      return false;
    }
  
    return true;
  };


  const addDocument = async (Date,Place,amountPaid,groupName,mealName,namePaid,peopleAttending) => {
    peopleAttending = peopleAttending.filter(person => person !== namePaid[0]);
    const dataToBeFed = {Date,Place,amountPaid,groupName,mealName,namePaid,peopleAttending};

    try {
      setEmptyList(false);
      const q = await query(collection(db, "Groups"), where("name", "==", groupName));
      const doc = await getDocs(q);
      const hasEvent = true;
      const docReftwo = doc.docs[0].ref;
      await updateDoc(docReftwo, { hasEvent });

      const docRef = await addDoc(collection(db, "Event"), dataToBeFed);
      setEventFound(false);
      setGotGraph(false);

      
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };

  const generateChart = (inin) => {
    console.log("The percentages rn is ", inin);
    console.log("Label set is", inin.map((item) => item.payer));
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      chartRef.current.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: inin.map((item) => item.payer),
          datasets: [
            {
              label: 'Percentage of Total Payments',
              data: inin.map((item) => item.percent),
              backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              max: 100,
              beginAtZero: true,
              ticks: {
                stepSize: 20,
              },
            },
          }
        },
      });
    }
  };

  const getPercentages = (input) => {

    const nameCounts = {};
    let totalAmount = 0;
    if(input.length > 0){

    
    
    totalAmount = input.reduce(
      (total, event) => total + parseInt(event.amountPaid, 10), 0
    );
    console.log("Total amount is", totalAmount);
    input.forEach((event) => {
      const {payer, amountPaid } = event;
      const intPaid = parseInt(amountPaid, 10);
      if(!nameCounts[payer]){
        nameCounts[payer] = intPaid;
      }
      else{
        nameCounts[payer] += intPaid;
      }
    });
  }
    const calculated = groupUsers.map((user) => ({
        payer: user,
        percent: (nameCounts[user] || 0) / totalAmount * 100,
    }));
  

    console.log("About to set calculated to", calculated);

    return calculated;
  };


  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSelect = (selectedItems) => {
    setSelectedUsers(selectedItems);
  }

  const clearForm = () => {
    if(!modalIsOpen){
      setPaymentValues({
        totalPrice: '',
        place: '',
        date: ' ',
        description: '',
      });
      handleDeselectAll();
    }
  }

  const handleOpening = () => {
    setClosing(false);
    clearForm();
    openModal();
  }



  const handleSubmit = (e) => {
    e.preventDefault();
    if(modalIsOpen && !closing){
      if (!validateForm()) {
        alert('Please fill in all required fields.');
        return;
      }

    // Call your function here with paymentValues
    console.log("About to process these values");
    console.log("Selected users are", selectedUsers); //can access group of everyone who paid
    const selectedUsersName = selectedUsers.map((user) => user.label); //can do user.value to get unique UID for each person, etc.
    addDocument(paymentValues.date,paymentValues.place,paymentValues.totalPrice,currGroupName,paymentValues.description,[paymentValues.personPaid], selectedUsersName);
    console.log("f TO DOC SOMEHOW");
    closeModal();
    }
    else{
      closeModal();
      setClosing(false);
    }
  };

  const handleSelectAll = () => {
    setSelectedUsers(allUsers);
  }

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  }

  const handleClose = (e) => {
    setClosing(true);
    closeModal();
    console.log("Tried to close");
    
  }


  const getGraphFromFirebase = async() =>{
    try{
      
    const q = query(collection(db, "Splitpay"), where("groupName", "==", groupName));
    const doc = await getDocs(q);
    if(doc.empty){
      return false;
    }
    else{
      return true;
    }
    const data = doc.docs[0].data();
    const retGraph = new Graph(groupName,groupUsers);
    const srcList = data.sources;
    const destList = data.destinations;
    const weightList = data.weights;
    if(srcList.length != destList.length != weightList){
      return false;
    }
    for(var i =0;i<srcList.length;i++){
      retGraph.addAnEdge(srcList[i],destList[i],weightList[i]);
    }
    //return true;
    //return retGraph;

    } catch (err) {
      return false;
    }
  };

  const uploadEdgesToFirebase = async() =>{
    if(groupUsers.length < 2){
      alert("Need at least 2 members in a group");
      return;
    }
    let inputGraph;
    try{
      inputGraph = await graphStuff();
    }
    catch( err ){
      alert("Error: Trip already finalized, or no valid (non-self) payments yet.");
      return;
    }
    console.log("Input graph has ", inputGraph);
    if(getGraphFromFirebase() === true)
    {
      return;
    }
    const edges = inputGraph;
    const sources = [];
    const destinations = [];
    const weights = [];
    const payStatus = [];
    edges.forEach(edge =>{
      sources.push(edge[0]);
      destinations.push(edge[1]);
      weights.push(edge[2]);
      payStatus.push("Not confirmed");
    });
    const dataToBeFed = {groupName,sources,destinations,weights,payStatus};

    try {
      
      const docRef = doc(db, "Splitpay", groupName);
      await setDoc(docRef,dataToBeFed);

    } catch (err) {
      alert("Error adding document: ", err);
    }
    alert("Trip has been finalized. Please check inbox for any payments.");

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



  const fetchUserName = async () => {
    try {
      console.log("TRYnNA FETCH");
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      //console.log(name);
      //console.log(name);
    } catch (err) {
      console.error(err);
      //alert("An error occured while fetching user data");
    }
  };

  const getSomeGroup = async (paramGroup) => {
    try {
      console.log("TRYNNA GET A GR")
      const quer = await query(collection(db, "Groups"), where("name", "==", paramGroup));
      const docs = await getDocs(quer);
      const data = docs.docs[0].data();
      setGroupName(data.name);
      setGroupUsers(data.users);
      const eq = await query(collection(db, "Event"), where("groupName", "==", groupName));
      const eventDoc = await getDocs(eq);

      var num = refreshCounter;
      if(!eventDoc.metadata.hasPendingWrites){
        num += 1;
        setRefreshCounter(num);
      }
      
      if(!eventDoc.empty){
        setEventFound(true);
        setEmptyList(false);
      }
      else{
        const ss = eventDoc.size;
        console.log("In dboard, size is", ss);
        if(typeof(ss) === "undefined"){
          console.log("UNDEFNIED");
            return;
        }
        else{
          console.log("SUCCESS");
          if(ss === 0){
            setEmptyList(true);
            console.log("set empty list to true");
          }
          else{
            console.log("Set emptyList to false");
            setEmptyList(false);
            setGotGraph(true);
          }
          setEventFound(true);
        }
        if(num > 30){
          console.log("JUST STOPPED");
          setEmptyList(true);
          setEventFound(true);
        }

      }

        const eventDatabase = [];
        eventDoc.forEach((document) => {
          const place = document.data().Place;
          const payer = document.data().namePaid[0];
          const amountPaid = document.data().amountPaid;
          const date = document.data().Date;
          const atendees = document.data().peopleAttending;
          const newEventInformation = {place, payer, amountPaid,date,atendees};

          eventDatabase.push(newEventInformation);
        });
        setEventInfo(eventDatabase);
        setStartGraph(true);
    
      // console.log(eventInfo[0].date); // Access the updated state
      // console.log(eventInfo[1].date); // Access the sd state

    } catch (err) {
      console.error(err);
      alert("You are not affiliated with a group!!");
    }
  };

  //This is where we are working
  const graphStuff = async () => {
    const names = groupUsers;
    const dummy = new Graph(groupName,names);

    // function getDebtors(allNames,payerName){
    //   return allNames.filter(item => item !== payerName);
    // }

    eventInfo.forEach(ev =>{
      console.log("ATENDEES ARE ",ev.atendees);
      const debts = ev.atendees;
      if(debts.length !== 0){
        dummy.groupPurchase(ev.payer, debts, ev.amountPaid);
      }
    });
    //dummy.Optimize();
    dummy.printNodesAndEdges();
    const optum = new OptimizeCosts(dummy);
    optum.calculate();
    const finalGraph = optum.getGraph();
    //finalGraph.caseA();
    finalGraph.printNodesAndEdges();
    const retGraph = optum.getGraph();
    //retGraph.printNodesAndEdges();
    //return retGraph;
    setFinalGraphEdges(retGraph.getAllEdges());
    return retGraph.getAllEdges();
}
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
      console.log("INFINITE LOOP");
    }
    const temp = eventInfo;
    console.log("Right now temp has ", temp);
    if(startGraph && temp.length > 0 && !gotGraph){
      
      console.log("SHOULD BE WORKING!!!");
      const vals = getPercentages(temp);
      generateChart(vals);
      setGotGraph(true);
    }
    else if(eventFound && !gotGraph && emptyList){

    }
    var balTotal = 0;
    pastPayments.payments.forEach(pay =>{
      balTotal = balTotal + parseFloat(pay.amount);  
    });
    setBalance(balTotal);
    if(readyToUpload){
      console.log("final graph edges are",finalGraphEdges);
      //uploadEdgesToFirebase(finalGraphEdges);
      setReadyToUpload(false);
    }
    if(eventFound && graphObjectMake && !emptyList){
      //graphStuff();
      //uploadEdgesToFirebase(finalGraphEdges);
      setGraphObjectMake(false);
      setReadyToUpload(true);

    }
    else{
      if(emptyList){
        console.log("Empty list ERROR");
      }
      if(!eventFound){
        console.log("Event found error");
      }
      if(!graphObjectMake){
        console.log("NOT MAKING GRAPH OBJECT");
      }
    }
      console.log("Your username is " + name);
    console.log("Your groupname is ", groupName);

  }, [user, loading, navigate, fetchUserName,emptyList, gotGraph]);


  
const [selectedFile, setSelectedFile] = useState(null);
const handleFileSelect = (event) => {
  setSelectedFile(event.target.files[0]);
};
  

const handleButtonPress = async () => {
  // try {
  //   setTotalPriceAI('5');
  // } catch (error) {
  //   alert("big fuck");
  // }
  
  
  try {
    const formData = new FormData();
    formData.append('image', selectedFile);

    const response = await fetch('https://receipt-scanner-dctp3pim2q-uc.a.run.app/', {
      method: 'POST',
      body: formData,
    });
    const totalPriceFromResponse = await response.json();

    // Update the state or variable with the retrieved value
    //setTotalPriceAI(totalPriceFromResponse);
    setPaymentValues((prevPaymentValues) => ({
      ...prevPaymentValues,
      totalPrice: totalPriceFromResponse,
    }));
    alert("BRO WE FUCKING DID IT");
  } catch (error) {
    alert("oops, total price:", error)
  }
};



return (
  <div id="inbox" className="bg-gray-900 text-white">
  <Navbar userEmail={user?.email}/>
  <div className="bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div className="w-full mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
        <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg mr-4" type="button" onClick={() => uploadEdgesToFirebase()}>
            Finalize Trip
          </button>
        </div>
        <div className="ml-auto">
    <button
      className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
      type="button"
      onClick={handleOpening}    >
      Scan Receipt
    </button>
  </div>
      </div>
      <div className="text-white text-4xl font-semibold mt-6 mb-6">
        Welcome back {name}.
      </div>
      <div className="text-white text-4xl font-semibold mb-6">
        {currGroupName}'s Trip Receipt
      </div>
      <div className="text-white text-2xl mb-6">Recent Group Payments</div>
<div className="flex">
      <div className="flex items-center justify-between bg-gray-300 rounded-lg p-6 w-2/5 shadow-md ">

      <table className="table-fixed w-full text-black mb-6 mt-6 ml-9">
  <tbody>
    <tr>
      <td className="w-5/4 p-6 whitespace-nowrap overflow-hidden overflow-ellipsis border border-black border-solid border-2 font-semibold">Date</td>
      {pastPayments.payments.map((item, i) => (
        <td key={i} className="w-5/4 p-6 whitespace-nowrap overflow-hidden overflow-ellipsis border border-black border-solid border-2">
          {new Date(item.date).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
          })}
        </td>
      ))}
    </tr>
    <tr>
      <td className="w-5/4 p-6 whitespace-nowrap overflow-hidden overflow-ellipsis border border-black border-solid border-2 font-semibold">Payer</td>
      {pastPayments.payments.map((item, i) => (
        <td key={i} className="w-5/4 p-6 whitespace-nowrap overflow-hidden overflow-ellipsis border border-black border-solid border-2">
          {item.payer}
        </td>
      ))}
    </tr>
    <tr>
      <td className="w-5/4 p-6 whitespace-nowrap overflow-hidden overflow-ellipsis border border-black border-solid border-2 font-semibold">Place</td>
      {pastPayments.payments.map((item, i) => (
        <td key={i} className="w-5/4 p-6 whitespace-nowrap overflow-hidden overflow-ellipsis border border-black border-solid border-2">
          {item.place}
        </td>
      ))}
    </tr>
    <tr>
      <td className="w-5/4 p-6 whitespace-nowrap overflow-hidden overflow-ellipsis border border-black border-solid border-2 font-semibold">Amount</td>
      {pastPayments.payments.map((item, i) => (
        <td key={i} className="w-5/4 p-6 whitespace-nowrap overflow-hidden overflow-ellipsis border border-black border-solid border-2">
          ${item.amount}
        </td>
      ))}
    </tr>
    {/* Add more table rows as needed */}
  </tbody>
</table>
</div>
<div className="chart-container h-auto">
  <canvas ref={chartRef}></canvas>  
</div>
</div>

      <p className="text-white text-xl mb-6 mt-6">
        Total Expenditure of the Trip: ${balance}
      </p>
      <div className="text-white text-2xl mb-6">Enter a new Payment</div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-white">
          <p>Scan a receipt</p>
          <MdOutlineDocumentScanner size={48} />
        </div>
        <div className="text-white" onClick={handleOpening}>
          <p>Manual Input</p>
          <ImListNumbered size={40} />
        </div>
      </div>
    </div>
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="text-4xl font-semibold mb-6">Payment Form</h2>
      <form className="formStyle" onSubmit={handleSubmit}>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg absolute right-4 top-4"
          onClick={handleClose}
        >
          <AiOutlineCloseCircle size={48} />
        </button>
        <p className="text-xl mb-2">Price*</p>
        <div>
      <input
        className="w-full py-2 px-4 mb-4 rounded-lg"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
      <div>      
      <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4"
            onClick={handleButtonPress}
          >
Upload and Set Value          </button>    </div>
    


    </div>


        <p >Total price may be loading... feel free to move on</p>

        <input
          className="w-full py-2 px-4 mb-4 rounded-lg"
          type="number"
          name="totalPrice"
          value={paymentValues.totalPrice}
          onChange={handleChange}
        />
        <p className="text-xl mb-2">Members of Group*</p>
        <Select
          isMulti={true}
          value={selectedUsers}
          options={allUsers}
          onChange={handleSelect}
        />
        <br />
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4"
            onClick={handleSelectAll}
          >
            Select All
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4"
            onClick={handleDeselectAll}
          >
            Deselect All
          </button>
        </div>
        <p className="text-xl mb-2">Payer*</p>
        <select
          name="personPaid"
          value={paymentValues.personPaid}
          className="w-full py-2 px-4 mb-4 rounded-lg"
          onChange={handleChange}
        >
          <option value="select">Select</option>
          {selectedUsers.map((user) => (
            <option key={user.label} value={user.label}>
              {user.label}
            </option>
          ))}
        </select>
        <p className="text-xl mb-2">Additional Info</p>
        <div className="extraInfo">
          <input
            type="date"
            name="date"
            value={paymentValues.date}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 rounded-lg"
            pattern="^[0-9]*/[0-9]*$"
          />
          <br />
          <input
            type="text"
            name="place"
            value={paymentValues.place}
            onChange={handleChange}
            placeholder="Location:"
            className="placeholder-opacity-50 placeholder-gray-400 w-full py-2 px-4 mb-4 rounded-lg"
          />
          <br />
          <input
            type="text"
            name="description"
            value={paymentValues.description}
            onChange={handleChange}
            placeholder="Additional Notes:"
            className="placeholder-opacity-50 placeholder-gray-400 w-full py-2 px-4 mb-4 rounded-lg"
          />
        </div>
        <br />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Submit
        </button>
        <br />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          onClick={handleClose}
        >
          Close
        </button>
      </form>
    </Modal>
  </div>
  </div>
);

/*
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="text-4xl font-semibold mb-6">Payment Form</h2>
      <form className="formStyle" onSubmit={handleSubmit}>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg absolute right-4 top-4"
          onClick={handleClose}
        >
          <AiOutlineCloseCircle size={48} />
        </button>
        <p className="text-xl mb-2">Price*</p>
        <input
          className="w-full py-2 px-4 mb-4 rounded-lg"
          type="number"
          name="totalPrice"
          value={paymentValues.totalPrice}
          onChange={handleChange}
        />
        <p className="text-xl mb-2">Members of Group*</p>
        <Select
          isMulti={true}
          value={selectedUsers}
          options={allUsers}
          onChange={handleSelect}
        />
        <br />
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4"
            onClick={handleSelectAll}
          >
            Select All
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4"
            onClick={handleDeselectAll}
          >
            Deselect All
          </button>
        </div>
        <p className="text-xl mb-2">Payer*</p>
        <select
          name="personPaid"
          value={paymentValues.personPaid}
          className="w-full py-2 px-4 mb-4 rounded-lg"
          onChange={handleChange}
        >
          <option value="select">Select</option>
          {selectedUsers.map((user) => (
            <option key={user.label} value={user.label}>
              {user.label}
            </option>
          ))}
        </select>
        <p className="text-xl mb-2">Additional Info</p>
        <div className="extraInfo">
          <input
            type="date"
            name="date"
            value={paymentValues.date}
            onChange={handleChange}
            className="w-full py-2 px-4 mb-4 rounded-lg"
            pattern="^[0-9]*//*[0-9]*$"
            />
            <br />
            <input
              type="text"
              name="place"
              value={paymentValues.place}
              onChange={handleChange}
              placeholder="Activity name:"
              className="placeholder-opacity-50 placeholder-gray-400 w-full py-2 px-4 mb-4 rounded-lg"
            />
            <br />
            <input
              type="text"
              name="description"
              value={paymentValues.description}
              onChange={handleChange}
              placeholder="Additional Notes:"
              className="placeholder-opacity-50 placeholder-gray-400 w-full py-2 px-4 mb-4 rounded-lg"
            />
          </div>
          <br />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Submit
          </button>
          <br />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            onClick={handleClose}
          >
            Close
          </button>
        </form>
      </Modal>

*/






//This is the OG imeplementation, dont delete
//   return (
//     <div className="bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <div className="w-full mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//           <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg mr-4" type="button" onClick={() => uploadEdgesToFirebase(finalGraphEdges)}>
//               Upload Payments
//             </button>
//             <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg mr-4">
//               <Link to="/GroupSelection">Manage Groups</Link>
//             </button>
//             <Link
//               to="/Inbox"
//               className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-xl"
//             >
//               Inbox
//             </Link>
//             <div className="relative inline-block ml-4">
//               <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
//                 {user?.email}
//               </button>
//               <div className="absolute hidden mt-2 w-32 bg-gray-800 rounded-md shadow-lg">
//                 <div className="py-1">
//                   <div
//                     className="block px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer"
//                     onClick={logout}
//                   >
//                     Logout
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="text-white text-4xl font-semibold mb-6">
//           Welcome back {name}.
//         </div>
//         <div className="text-white text-4xl font-semibold mb-6">
//           {currGroupName}'s Trip Receipt
//         </div>
//         <div className="text-white text-2xl mb-6">Recent Group Payments</div>
//         <div className="table-wrapper">
//   <table className="table-auto w-full text-white mb-6">
//     <tbody>
//       <tr>
//         <th className="w-5/4 px-4 py-2">Date</th>
//         {pastPayments.payments.map((item, i) => (
//           <td key={i} className="w-5/4 px-4 py-2">
//             {item.date}
//           </td>
//         ))}
//       </tr>
//       <tr>
//         <td className="w-5/4 p-6">Payer</td>
//         {pastPayments.payments.map((item, i) => (
//           <td key={i} className="w-5/4 p-6">
//             {item.payer}
//           </td>
//         ))}
//       </tr>
//       <tr>
//         <td className="w-5/4 p-6">Place</td>
//         {pastPayments.payments.map((item, i) => (
//           <td key={i} className="w-5/4 p-6">
//             {item.place}
//           </td>
//         ))}
//       </tr>
//       <tr>
//         <td className="w-5/4 p-6">Amount</td>
//         {pastPayments.payments.map((item, i) => (
//           <td key={i} className="w-5/4 p-6">
//             ${item.amount}
//           </td>
//         ))}
//       </tr>
//     </tbody>
//   </table>
// </div>

//         <p className="text-white text-xl mb-6">
//           Remaining balance: ${balance}
//         </p>
//         <div className="text-white text-2xl mb-6">Enter a new Payment</div>
//         <div className="flex items-center justify-between mb-6">
//           <div className="text-white">
//             <p>Scan a receipt</p>
//             <MdOutlineDocumentScanner size={48} />
//           </div>
//           <div className="text-white" onClick={handleOpening}>
//             <p>Manual Input</p>
//             <ImListNumbered size={40} />
//           </div>
//         </div>
//       </div>
//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         className="modal"
//         overlayClassName="overlay"
//       >
//         <h2 className="text-4xl font-semibold mb-6">Payment Form</h2>
//         <form className="formStyle" onSubmit={handleSubmit}>
//           <button
//             className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg absolute right-4 top-4"
//             onClick={handleClose}
//           >
//             <AiOutlineCloseCircle size={48} />
//           </button>
//           <p className="text-xl mb-2">Price*</p>
//           <input
//             className="w-full py-2 px-4 mb-4 rounded-lg"
//             type="number"
//             name="totalPrice"
//             value={paymentValues.totalPrice}
//             onChange={handleChange}
//           />
//           <p className="text-xl mb-2">Members of Group*</p>
//           <Select
//             isMulti={true}
//             value={selectedUsers}
//             options={allUsers}
//             onChange={handleSelect}
//           />
//           <br />
//           <div className="flex justify-between">
//             <button
//               type="button"
//               className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4"
//               onClick={handleSelectAll}
//             >
//               Select All
//             </button>
//             <button
//               type="button"
//               className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4"
//               onClick={handleDeselectAll}
//             >
//               Deselect All
//             </button>
//           </div>
//           <p className="text-xl mb-2">Payer*</p>
//           <select
//             name="personPaid"
//             value={paymentValues.personPaid}
//             className="w-full py-2 px-4 mb-4 rounded-lg"
//             onChange={handleChange}
//           >
//             <option value="select">Select</option>
//             {selectedUsers.map((user) => (
//               <option key={user.label} value={user.label}>
//                 {user.label}
//               </option>
//             ))}
//           </select>
//           <p className="text-xl mb-2">Additional Info</p>
//           <div className="extraInfo">
//             <input
//               type="date"
//               name="date"
//               value={paymentValues.date}
//               onChange={handleChange}
//               className="w-full py-2 px-4 mb-4 rounded-lg"
//               pattern="^[0-9]*/[0-9]*$"
//             />
//             <br />
//             <input
//               type="text"
//               name="place"
//               value={paymentValues.place}
//               onChange={handleChange}
//               placeholder=""
//               className="w-full py-2 px-4 mb-4 rounded-lg"
//             />
//             <br />
//             <input
//               type="text"
//               name="description"
//               value={paymentValues.description}
//               onChange={handleChange}
//               placeholder=""
//               className="w-full py-2 px-4 mb-4 rounded-lg"
//             />
//           </div>
//           <br />
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
//           >
//             Submit
//           </button>
//           <br />
//           <button
//             className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
//             onClick={handleClose}
//           >
//             Close
//           </button>
//         </form>
//       </Modal>
//     </div>
//   );
  
};






//What Rahul M needs to test
//<div id="inbox" className="bg-gray-900 text-white">
//<Navbar userEmail={user?.email}/>


//   return (
//     <div className = "wholePage">
//     <div className="Dboard">
//        <div className="Dboard_navbar">
         
//           <div className="Dboard_nav_buttons">
//             <button className="Dboard__btn"><Link to="/GroupSelection">Manage Groups</Link></button>
//             {/*<button className="Dboard__btn" onClick={() => uploadEdgesToFirebase(finalGraphEdges)}>My Payments</button>*/}
//             <Link to="/Inbox" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-xl">
//           Inbox
//         </Link>
//             <div class="dropdown">
//               <div className = "centered-text">
//                 <button class="Dboard__btn">{user?.email}</button>
//               </div>
              
//               <div class="dropdown-child" onClick = {logout}>
//                 Logout
//               </div>
//             </div>
//             {/*<button className="Dboard__btn">{user?.email}</button>*/}
             
//           </div>
//        </div>
//       <div className = "header1" >Welcome back {name}. </div>
//     <div className = "groupBalance" style={{ fontSize: '40px' }}>
//       <p>{currGroupName}'s Trip Receipt</p>
      
    
//   <div className = "DataTitle">Recent Group Payments</div>

// <div className = "dataTable">
//       <table className = "tableFormat">
//       <tbody>
//         {/*
//           <tr>
//             <td>Place</td>
//             {pastPayments.payments.map((item, i) => (
//               <td key={i}>{item.place}</td>
//             ))}
//             </tr>  */}

//         <tr>
//           <td>Date</td>
//           {pastPayments.payments.map((item, i) => (
//             <td key={i}>{item.date}</td>
//           ))}
//         </tr>
       
//         <tr>
//           <td>Payer</td>
//           {pastPayments.payments.map((item, i) => (
//             <td key={i}>{item.payer}</td>
//           ))}
//         </tr>
//         <tr>
//           <td>Place</td>
//           {pastPayments.payments.map((item, i) => (
//             <td key={i}>{item.place}</td>
//           ))}
//         </tr>
//         <tr>
//           <td>Amount</td>
//           {pastPayments.payments.map((item, i) => (
//             <td key={i}>${item.amount}</td>
//           ))}
//         </tr>
//     </tbody>
//     </table>

    


// </div>

// <p>Remaining balance: ${balance} </p>


      
//       </div>
      
//   <div className="label1">
//     <p>Enter a new Payment</p>
//   </div>
//   <div className="pictureButton">

//     <div className="scanReceipt">
//         <p>Scan a receipt</p>
//         <MdOutlineDocumentScanner size={48}/>
//       </div>

//       <div className="inputManual" onClick={handleOpening}>
//     <Modal 
//     isOpen={modalIsOpen} 
//     onRequestClose={closeModal}
//     className="modal"
//     overlayClassName="overlay"
    
//     >
      
      
//         <h2 className="modalTitle">Payment Form</h2>
//         <form className="formStyle" onSubmit={handleSubmit}>
//         <button className="closeButton" onClick={handleClose}>
//       <AiOutlineCloseCircle size={48}/>
//       </button>
//           <p className="subtitle">Price*</p>
//           <input
//             className="priceStyle"
//             type="number"
//             name="totalPrice"
//             value={paymentValues.totalPrice}
//             onChange={handleChange}
//             placeholder=""
//             //required
//           />
   
      
         

// {/*
//           <select 
//             multiple={true}
//             value={selectedUsers} 
//             onChange={(e) => handleSelect(e.target.selectedOptions)}>
//             {users.map((option) => (
//               <option key={option} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//             */}
//           <p className="subtitle2">Members of Group*</p>
//           <Select
//             isMulti={true}
//             value={selectedUsers}
//             options={allUsers}
//             onChange={handleSelect}
//             //required
          
          
//           />

//           <br />
//           <div className="selectButton">
//           <button type="button" className="sButton" onClick={handleSelectAll}>Select All</button>
//           <button type="button" className="sButton" onClick={handleDeselectAll}>Deselect All</button>
//           </div>
          



//           <p className="subtitle2">Payer*</p>
//           <select 
//             name="personPaid"
//             value={paymentValues.personPaid} 
//             className="payerStyle"
//             onChange={handleChange}
//             placeholder="Select..."
//             //required
//             >
//             <option key="select" value="select">Select</option>,
//             {selectedUsers.map((user) => (
              
//               <option key={user.label} value={user.label}>{user.label}</option>
//             ))}

//             {/*
//             {options.map((option) => (
//               <option key={option} value={option}>
//                 {option}
//               </option>
//             ))}*/}
//           </select>

//           <p className="subtitle2">Additional Info</p>
          
//           <div className="extraInfo">

          
//           <input
//             type="date"
//             name="date"
//             value={paymentValues.date}
//             onChange={handleChange}
//             className="smallButton"
//             pattern="^[0-9]*/[0-9]*$"
//             //required
//           /><label htmlFor="date">
//           Enter Date<span className="required-field">*</span>
//         </label>
//           <br />

//           <input
            
//             type="text"
//             name="place"
//             value={paymentValues.place}
//             onChange={handleChange}
//             placeholder=""
//             className="smallButton"
//             //required
//           /><label htmlFor="date">
//           Enter Place<span className="required-field">*</span>
//         </label>
//           <br />

//           <input
//             type="text"
//             name="description"
//             value={paymentValues.description}
//             onChange={handleChange}
//             placeholder=""
//             className="smallButton"
//           /><label htmlFor="date">
//           Short Description<span className="required-field">*</span>
//         </label>
//           </div>
//           <br />
//           {/* Add more input fields for other payment values */}
          
        



//           <button type="submit" className="submitButton">Submit</button>
//           <br />
//           <button className="closingButton" onClick={handleClose}>Close</button>
//         </form>
//       </Modal>
//       <p>Manual Input</p>
//       <ImListNumbered size={40}/>

//     </div>

//     <div className="yourPayments">
//       <div className="paylabel">
//         <p>Manage your payments</p>
//       </div>
//       <div className = "dataTable2">
//       <table className = "tableFormat2">
//       <tbody>
//         {/*
//           <tr>
//             <td>Place</td>
//             {pastPayments.payments.map((item, i) => (
//               <td key={i}>{item.place}</td>
//             ))}
//             </tr>  */}

//         <tr>
//           <td>Date</td>
//           {pastPayments.userPayments.map((item, i) => (
//             <td key={i}>{item.date}</td>
//           ))}
//         </tr>
       
//         <tr>
//           <td>Pay to</td>
//           {pastPayments.userPayments.map((item, i) => (
//             <td key={i}>{item.otherUser}</td>
//           ))}
//         </tr>
       
//         <tr>
//           <td>Amount</td>
//           {pastPayments.userPayments.map((item, i) => (
//             <td key={i}>${item.amount}</td>
//           ))}
//         </tr>
//     </tbody>
//     </table>

    

// </div>
//     </div>
//   </div>
//      </div>
//      </div>
//   );
// }
export default Dboard;
