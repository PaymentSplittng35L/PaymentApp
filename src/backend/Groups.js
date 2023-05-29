import { doc, setDoc } from "firebase/firestore"; 
import {
  db
} from "../pages/firebase";
import { collection, addDoc } from "firebase/firestore"; 

function addNewGroup(groupName, displayName)
{
  addDoc(collection(db, "Groups"), {
      Balance: 99.99,
      name: groupName,
      paidOff: false,
      receipt: 'Groups/q3uyesDVohZ1SHv6mdro',
      users: displayName
       //the test receipt
    }
    
    );
 
  
}



export default addNewGroup