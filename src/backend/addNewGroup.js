import { doc, setDoc } from "firebase/firestore"; 
import {
  db
} from "../pages/firebase";
import { collection, addDoc } from "firebase/firestore"; 
import "../webpack.config"
function addNewGroup(groupName, displayName)
{
  addDoc(collection(db, "Groups"), {
      name: groupName,
      paidOff: false,
      users: [displayName],
      receipt: 'q3uyesDVohZ1SHv6mdro' //the test receipt
    });
 
  
}




await setDoc(doc(db, "cities", "LA"), {
    name: "Los Angeles",
    state: "CA",
    country: "USA"
  });



// Add a new document with a generated id.
const docRef = await addDoc(collection(db, "Groups"), {
  name: "testGroup2",
  paidOff: "false",
  users: ["thatDude", "thisDude"]
});
console.log("Document written with ID: ", docRef.id);