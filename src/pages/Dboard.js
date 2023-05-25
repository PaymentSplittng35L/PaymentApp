import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
function Dboard() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [paidOffStatus, setPaidOffStatus] = useState(true);
  const [balance,setBalance] = useState(0);
  const navigate = useNavigate();


  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      //console.log(name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

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
      alert("You are not affiliated with a group!!");
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
    <div className="Dboard">
       <div className="Dboard__container">
        Logged in as
         <div>{name}</div>
         <div>{user?.email}</div>
         <button className="Dboard__btn" onClick={logout}>
          Logout
         </button>
       </div>
     </div>
  );
}
export default Dboard;
