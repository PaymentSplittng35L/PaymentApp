import React, { useState, useEffect,  useCallback  } from "react";
import './Inbox.css'
import './Dboard.css'
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout} from "./firebase";
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import { doc, updateDoc } from 'firebase/firestore';
import { useLocation} from 'react-router-dom';
import {Message, Messages} from './messages.js'
import { scroller } from "react-scroll";
import Navbar from './Navbar'





export default function Inbox() {
    //This is where the messages are stored
  const [messages, setMessages] = useState([]);
  const [receipts, setReceipts] = useState([]);
  // const [bills, setBills] = useState([]);
  const dummy = [["joe", 20, true, false], ["bob", 50, true, false]]

  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [balance,setBalance] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);
  const navigate = useNavigate();
  const [fetchOnce, setFetchOnce] = useState(false);
  const [gotUser,setGotUser] = useState(false);
  const location = useLocation();
  const currGroupName = location.state && location.state.currGroupName;
  //console.log("The current group name is " + currGroupName);

  const [eventArray, setEventArray] = useState([]);
  const [eventInfo, setEventInfo] = useState([])
  const [eventFound, setEventFound] = useState(false);
  const [graphObjectMake, setGraphObjectMake] = useState(true);
  const [retList, setRetList] = useState([]);
  const [retListB, setRetListB] = useState([]);

  const firebaseClickHandle = async(username,dest,weight,groupN) =>{
    const quer = query(collection(db, "Splitpay"), where("groupName", "==", groupN));
    const docs = await getDocs(quer);

    const database = docs.docs[0].data();
    const src = database.sources;
    const dst = database.destinations;
    const wghts = database.weights;
    const payStatus = database.payStatus;
    for(var i = 0;i<src.length;i++){
      if (src[i] === username && dst[i] === dest && wghts[i] === weight) {
        payStatus[i] = "Pending"; // Update the value as per your requirement
  
        // Update the document in Firestore
        const docRef = doc(db, "Splitpay", docs.docs[0].id);
        const updateData = { payStatus };
  
        await updateDoc(docRef, updateData);
        break; // Exit the loop after updating
      }
    }

    window.location.reload();
  
  }

  const getInboxFromFirebase = async(username) =>{
    console.log("GetInbox Function called");
    const quer = query(collection(db, "Splitpay"), where("sources", "array-contains", username));
    const docs = await getDocs(quer);
    const retList = [];
    console.log("Docs length is ", docs.size);
    
  await Promise.all(
    docs.docs.map(async (doc) => {
      const data = doc.data();
      console.log("our current pusher is dest: ", data.sources[0]);

      const singleEdge = data.sources;
      await Promise.all(
        singleEdge.map(async (source, j) => {
          console.log("Attempting ", source);
          if (source === username) {
            const dest = data.destinations[j];
            const pushweight = data.weights[j];
            const gName = data.groupName;
            console.log("Reached a dest at ", dest);

            if (data.payStatus[j] === "Not confirmed") {
              console.log("Just pushed here");
              retList.push([dest, pushweight, gName, true]);
            }
            else if (data.payStatus[j] === "Pending"){
              retList.push([dest, pushweight, gName, false]);
            }
          }
        }
        )
      );
    })
  );
    console.log("our functions retlist is : ",retList);
    return retList;
  }

  const getSecondInboxFromFirebase = async(username) =>{
    const quer = query(collection(db, "Splitpay"), where("destinations", "array-contains", username));
    const docs = await getDocs(quer);
    const retList = [];

    await Promise.all(
      docs.docs.map(async (doc) => {
        const data = doc.data();
        console.log("our current pusher is dest: ", data.sources[0]);
  
        const singleEdge = data.destinations;
        await Promise.all(
          singleEdge.map(async (destination, j) => {
            console.log("Attempting ", destination);
            if (destination === username) {
              const src = data.sources[j];
              const pushweight = data.weights[j];
              const gName = data.groupName;
              console.log("Reached a srouce at ", src);
  
              if (data.payStatus[j] === "Pending") {
                console.log("REACHED PENDING");
                console.log("Source being pushed is", src);
                retList.push([src, pushweight, gName, true]);
              }
              else if(data.payStatus[j]==="Not confirmed"){
                console.log("Actually did", data.payStatus[j]);
                console.log("DID NOT REACH PENDING; Source being pushed is", src);
                retList.push([src, pushweight, gName, false]);
              }
            }
          }
          )
        );
      })
    );
    return retList;

  }

  const confirmGraphicalEdge = async(username,dest,weight,groupN) =>{
    const quer = await query(collection(db, "Splitpay"), where("groupName", "==", groupN));
    const docs = await getDocs(quer); 
    

    console.log("Function called");
    const database = docs.docs[0].data();
    const src = database.sources;
    const dst = database.destinations;
    const wghts = database.weights;
    const payStatus = database.payStatus;
    for(var i = 0;i<src.length;i++){
      if(src[i] === username){
        console.log("Reached user");
      }
      if(dst[i] === dest){
        console.log("Reached destination");
      }
      if(wghts[i] === weight){
        console.log("Reached weight");
      }
      if (src[i] === username && dst[i] === dest && wghts[i] === weight) {
        console.log("Reached a match in payments");
        payStatus[i] = "Confirmed"; // Update the value as per your requirement
        // Update the document in Firestore
        const docRef = doc(db, "Splitpay", docs.docs[0].id);
        const updateData = { payStatus };
  
        await updateDoc(docRef, updateData);
        break; // Exit the loop after updating
      }
    }
    console.log("Reached the ending");

    window.location.reload();
  
  }
  
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
  
  const addToEventArray = (element) => {
    setEventArray([...eventArray,element]);
  };

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setGotUser(true);
      console.log(name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

    //This is where the firebase accessing has to happen:
    //This is where I will be getting the user information to make the messages for me
    useEffect(() => {
        const getData = async() => {
          console.log("username is ",name);
          if (loading) return;
          if (!user) return navigate("/");
          if(!fetchOnce && gotUser){
            console.log("POTENTIAL LOOP EXISTS");
            const retlist2 = await getInboxFromFirebase(name);
            setRetList(retlist2)
            const retlistb2 = await getSecondInboxFromFirebase(name);
            console.log("RETLIST2 CONTAINS", retlistb2);
            setRetListB(retlistb2);
            setFetchOnce(true);
            console.log("RETLIST IS : ",retList[0]);
          }
          if(!gotUser){
            fetchUserName();
          }

          
          processMessages(retList);
          processMessages2(retListB);



      };

      getData();
    }, [user,loading,navigate,gotUser,fetchOnce]);


    //the first list1 = ["joe", 100, groupname] this is all of the moeny the user owes to people
    //The second list2 = ["joe", 50, groupname] this is all of the money that other people have 
    //paid to the user
    //Note: I don't know if we need the groupname, but it should work without it.
    const processMessages = (list1) => {
      console.log("Calling; the size is", list1.length);
         const newMessages = list1.map((item) => ({
          name: item[0],
          amount: item[1],
          group: item[2],
          buttonText: item[3] === true ? "Paid?" : "Pending Confirmation",
          
        }));
        setMessages([...messages, ...newMessages]);

        }

      const processMessages2 = (list1) => {
          //console.log("Calling; the size is", list1.length);
             const newReceipts = list1.map((item) => ({
              name: item[0],
              amount: item[1],
              group: item[2],
              buttonText: item[3] === true ? "Recieved?" : "Waiting for Payment",
              
            }));
            setReceipts([...receipts, ...newReceipts]);


            }

  

      //const [messages, setMessages] = useState([]);
      // const [bills, setBills] = useState([]);
    

    function handleClick(message) {
      // Increment the click count for the button
      console.log("Clicked on ", message.name);
      if(message.buttonText === "Pending Confirmation"){
        console.log("Returned");
        return;
      }
      firebaseClickHandle(name, message.name, message.amount, message.group);
      // Update the state
      //setMessages(messages);
      
      
    }
    function handleClick2(receipt) {
      console.log(receipt);
      console.log("Function being called");
      console.log("The value is", receipt[3]);
      if(receipt.buttonText === "Waiting for Payment"){
        console.log("Returned");
        return;
      }
      // Increment the click count for the button
      console.log("RECIEVED THING: Clicked on ", receipt.name);
      confirmGraphicalEdge(receipt.name, name, receipt.amount, receipt.group);
     //Pass into Vishnu's function here:      
    }
    



// return(
// <div id="inbox" className="bg-gray-900 text-white">
//   <Navbar userEmail={user?.email} />
//   <p className="text-center text-5xl">Inbox Page</p>
//   <div className="flex justify-center">
//     <div className="w-1/2">
//       <h1 className="text-2xl font-bold mb-4">Who you owe</h1>
//       {messages.map((message, index) => (
//         <div key={index} className="message-box">
//           <span className="message-text">
//             Pay ${message.amount} to <b>{message.name}</b>?
//           </span>
//           <button
//             type="button"
//             onClick={() => handleClick(message)}
//             className="message-button bg-red-800 hover:bg-red-700"
//           >
//             {message.buttonText}
//           </button>
//         </div>
//       ))}
//     </div>
//     <div className="w-1/2">
//       <h1 className="text-2xl font-bold mb-4">Who owes you</h1>
//       {receipts.map((receipt, index2) => (
//         <div key={index2} className="message-box">
//           <span className="message-text">
//             {receipt.name} paid you ${receipt.amount}?
//           </span>
//           <button
//             type="button"
//             onClick={() => handleClick2(receipt)}
//             className="message-button bg-green-800 hover:bg-green-700"
//           >
//             {receipt.buttonText}
//           </button>
//         </div>
//       ))}
//     </div>
//   </div>
// </div>
// );


return (
  <div id="inbox" className="bg-gray-900 text-white h-screen">
    <Navbar userEmail={user?.email} />
    <p className="text-center text-5xl">Inbox:</p>
    <div className="flex justify-center">
      <div className="w-1/2">
        <h1 className="text-2xl font-bold mb-4">Pay Your Friends:</h1>
        {messages.map((message, index) => (
          <div key={index} className="message-box">
            <div className="message-content">
              <span className="message-text">
                Send ${message.amount.toFixed(2)} to <b>{message.name}</b>
              </span>
              <button
                type="button"
                onClick={() => handleClick(message)}
                className="message-button bg-red-800 hover:bg-red-700"
              >
                {message.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="w-1/2">
        <h1 className="text-2xl font-bold mb-4">Your Friends Paid You:</h1>
        {receipts.map((receipt, index2) => (
          <div key={index2} className="message-box">
            <div className="message-content">
              <span className="message-text">
                {receipt.name} has sent you ${receipt.amount.toFixed(2)}
              </span>
              <button
                type="button"
                onClick={() => handleClick2(receipt)}
                className="message-button bg-green-800 hover:bg-green-700"
              >
                {receipt.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <style jsx>{`
      .message-box {
        background-color: #333;
        padding: 10px;
        margin-bottom: 10px;
      }
      .message-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .message-text {
        color: #fff;
      }
      .message-button {
        color: #fff;
        padding: 5px 10px;
        border-radius: 4px;
      }
    `}</style>
  </div>
);



                
  }
  


