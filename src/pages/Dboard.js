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
import {AiOutlineCloseCircle} from 'react-icons/ai';
import Modal from 'react-modal';
import Select from 'react-select';

function Dboard() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [balance,setBalance] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [paidOffStatus, setPaidOffStatus] = useState(true);
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();
  const [formValid, setFormValid] = useState(false);
  const [groupUsers, setGroupUsers] = useState([]);

  const location = useLocation();
  const currGroupName = location.state && location.state.currGroupName;
  console.log("The current group name is " + currGroupName);

  const [eventArray, setEventArray] = useState([]);
  const [eventInfo, setEventInfo] = useState([])
  const [eventFound, setEventFound] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formatUsers, setFormatUsers] = useState([]);

  const options=["Bob", "Martha", "George", "David"];

  
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
    if (!totalPrice || !selectedUsers || !date || !place || !personPaid) {
      return false;

    }
  
    return true;
  };

  const addDocument = async (Date,Place,amountPaid,groupName,mealName,namePaid) => {
    const dataToBeFed = {Date,Place,amountPaid,groupName,mealName,namePaid};

    try {
      const docRef = await addDoc(collection(db, "Event"), dataToBeFed);
      setEventFound(false);
    } catch (err) {
      console.error("Error adding document: ", err);
    }
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
    addDocument(paymentValues.date,paymentValues.place,paymentValues.totalPrice,currGroupName,paymentValues.description,[paymentValues.personPaid]);
    console.log("JUST ADDED TO DOC SOMEHOW");
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




  const addToEventInfo = (place,payer,amountPaid,date) => {
    const newEventInformation = {place,payer,amountPaid,date};
    setEventInfo([...eventInfo,newEventInformation]);
  };

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
  
      const eq = query(collection(db, "Event"), where("groupName", "==", groupName));
      const eventDoc = await getDocs(eq);
      
      if(!eventDoc.empty){
        setEventFound(true);
      }

      setGroupUsers(data.users);
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

    <div className="inputManual" onClick={openModal}>
    <Modal 
    isOpen={modalIsOpen} 
    onRequestClose={closeModal}
    className="modal"
    overlayClassName="overlay"
    
    >
      
      
        <h2 className="modalTitle">Payment Form</h2>
        <form className="formStyle" onSubmit={handleSubmit}>
        <button className="closeButton" onClick={handleClose}>
      <AiOutlineCloseCircle size={48}/>
      </button>
          <p className="subtitle">Price*</p>
          <input
            className="priceStyle"
            type="number"
            name="totalPrice"
            value={paymentValues.totalPrice}
            onChange={handleChange}
            placeholder=""
            //required
          />
   
      
         

{/*
          <select 
            multiple={true}
            value={selectedUsers} 
            onChange={(e) => handleSelect(e.target.selectedOptions)}>
            {users.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
            */}
          <p className="subtitle2">Members of Group*</p>
          <Select
            isMulti={true}
            value={selectedUsers}
            options={allUsers}
            onChange={handleSelect}
            //required
          
          
          />

          <br />
          <div className="selectButton">
          <button type="button" className="sButton" onClick={handleSelectAll}>Select All</button>
          <button type="button" className="sButton" onClick={handleDeselectAll}>Deselect All</button>
          </div>
          



          <p className="subtitle2">Payer*</p>
          <select 
            name="personPaid"
            value={paymentValues.personPaid} 
            className="payerStyle"
            onChange={handleChange}
            placeholder="Select..."
            //required
            >
            {selectedUsers.map((user) => (
              <option key={user.label} value={user.label}>{user.label}</option>
            ))}

            {/*
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}*/}
          </select>

          <p className="subtitle2">Additional Info</p>
          
          <div className="extraInfo">

          
          <input
            type="date"
            name="date"
            value={paymentValues.date}
            onChange={handleChange}
            className="smallButton"
            pattern="^[0-9]*/[0-9]*$"
            //required
          /><label htmlFor="date">
          Enter Date<span className="required-field">*</span>
        </label>
          <br />

          <input
            
            type="text"
            name="place"
            value={paymentValues.place}
            onChange={handleChange}
            placeholder=""
            className="smallButton"
            //required
          /><label htmlFor="date">
          Enter Place<span className="required-field">*</span>
        </label>
          <br />

          <input
            type="text"
            name="description"
            value={paymentValues.description}
            onChange={handleChange}
            placeholder=""
            className="smallButton"
          /><label htmlFor="date">
          Short Description<span className="required-field"></span>
        </label>
          </div>
          <br />
          {/* Add more input fields for other payment values */}
          
        



          <button type="submit" className="submitButton">Submit</button>
          <br />
          <button className="closingButton" onClick={handleClose}>Close</button>
        </form>
      </Modal>
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
