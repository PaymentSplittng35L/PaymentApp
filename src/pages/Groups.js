
import React, { useEffect, useState, useCallback } from "react";


import "./Groups.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {MdOutlineDocumentScanner} from 'react-icons/md'
import {ImListNumbered} from 'react-icons/im'
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
      
const Groups = () => {
const [user, loading] = useAuthState(auth);
const [name, setName] = useState("");

const [meals, setMeals] = useState([]);
useEffect(() => {

    const fetchData = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const doc = await getDocs(q);
    const data = doc.docs[0].data();
    setName(data.name);



    const quer = query(collection(db,"Meals"),where("uidUnpaid", "array-contains", data.uid));
    const querySnapshot = await getDocs(quer);


    const mealData = querySnapshot.docs.map((doc) => doc.data());
    setMeals(mealData);
    };

    fetchData();
}, []);


return (
    <>
    <div className="button">
        <p>
        <button> <Link to ="/NewGroup">Add New Group?</Link></button>
        </p>
        
    </div>
<div>
    <h1>Meal Table {name}</h1>
    <table>
    <thead>
        <tr>
        <th>Meal Name</th>
        <th>Prices</th>
        </tr>
    </thead>
    <tbody>
        {meals.map((meal, index) => (
        <tr key={index}>
            <td>{meal.name}</td>
            
            <td>
            <ul>
                {meal.prices.map((uid, uidIndex) => (
                <li key={uidIndex}>{uid}</li>
                ))}
            </ul>
            </td>
        </tr>
        ))}
    </tbody>
    </table>
</div>
</>
);
};

export default Groups;
      
