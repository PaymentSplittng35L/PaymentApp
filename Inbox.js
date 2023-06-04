import React, { useState, useEffect,  useCallback  } from "react";
import './Inbox.css'
import './Dboard.css'
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import { useLocation} from 'react-router-dom';


function Inbox() {
    //This is where the messages are stored
    const [messages, setMessages] = useState([]);
    const dummy = [["joe", 20, true, false], ["bob", 50, true, false]]

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
  const [graphObjectMake, setGraphObjectMake] = useState(true);


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
    //This is where the firebase accessing has to happen:
    useEffect(() => {
      var butt = "";
      for(var i = 0; i < dummy.length; i++){
        if(dummy[i][2]){
          //Make the message to show that they owe
          
          if(dummy[i][3]){
            //if they said yes
            
          }else{
            //if they havent clicked
            
          }
        }else{
//message shows that they have to recieve
        if(dummy[i][3]){
           //if they said yes
            
        }else{
          //if they havent clicked
  
        }

        }

}
      
      setMessages([
        {name: "Rahul",
          amount: "100",
          "buttonText": "Yes?",
          "clickCount": 0  }]);
    }, []);
  
    function handleClick(message) {
      // Increment the click count for the button
    
  
      // Update the state
      setMessages(messages);
    }
  
    return (
      <div id="inbox">
        
        {messages.map((message, index) => (
          <div key={index} className="message" onClick={() => handleClick(message)}>
            Pay ${message.amount} to {message.name}?        
            <button type="button" class="btn btn-primary">{message.buttonText}</button>
          </div>
        ))}
      </div>
    );
  }
    
  
  export default Inbox;
