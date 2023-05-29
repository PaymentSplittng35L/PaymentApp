
import React, { useEffect, useState, useCallback } from "react";

import "./Groups.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {MdOutlineDocumentScanner} from 'react-icons/md'
import {ImListNumbered} from 'react-icons/im'
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";


// const Groups = () => {
//   const [name, setName] = useState('');

//   const handleChange = (event) => {
//     setName(event.target.value);
//   }

//   return (
//     <div>
//       <h1>Welcome to the Greeting Page!</h1>
//       <input
//         type="text"
//         placeholder="Enter your name"
//         value={name}
//         onChange={handleChange}
//       />
//       {name && <p>Hello, {name}!</p>}
//     </div>
//   );

// }

//export default Groups;

//import React, { useEffect, useState } from 'react';
// import firebase from 'firebase/app';
// import 'firebase/firestore';
// const quer = query(collection(db,"Meals"),where("uidUnpaid", "array-contains", "HojTcceiyoO9tjx9zS4a0F7HPRB2"));
//       const docs = await getDocs(quer);
//       const data = docs.docs[0].data();
//       setGroupName(data.name);
//       setPaidOffStatus(data.paidOff);
//       setBalance(data.Balance);
      //console.log(data.paidOff);

    //   import React, { useEffect, useState } from 'react';
    //   import firebase from 'firebase/app';
    //   import 'firebase/firestore';
      
      const Groups = () => {
        const [meals, setMeals] = useState([]);
      
        useEffect(() => {
          const fetchData = async () => {
            
            const quer = query(collection(db,"Meals"),where("uidUnpaid", "array-contains", "HojTcceiyoO9tjx9zS4a0F7HPRB2"));
            const querySnapshot = await getDocs(quer);

      
            const mealData = querySnapshot.docs.map((doc) => doc.data());
            setMeals(mealData);
          };
      
          fetchData();
        }, []);
      
        return (
          <div>
            <h1>Meal Table</h1>
            <table>
              <thead>
                <tr>
                  <th>Meal Name</th>
                  <th>Price</th>
                  <th>UID Paid</th>
                  <th>UID Unpaid</th>
                  {/* Add more table headers if needed */}
                </tr>
              </thead>
              <tbody>
                {meals.map((meal, index) => (
                  <tr key={index}>
                    <td>{meal.name}</td>
                    <td>{meal.prices}</td>
                    <td>{meal.uidPaid}</td>
                    <td>{meal.uidUnpaid}</td>
                    {/* Add more table cells based on the meal attributes */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      };
      
      export default Groups;
      
