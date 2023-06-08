import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import homescreen from "./backgroundyachy.png";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "./firebase";
import "./Register.css";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };
  useEffect(() => {
    if (loading) return; 
    if (user) navigate("/NewGroup");
  }, [user, loading]);
  // return (
  //   <div className="register flex justify-center items-center h-screen">
  //     <div className="register__container w-64 p-4 border border-gray-300 rounded bg-white">
        // <input
        //   type="text"
        //   className="register__input w-full py-2 px-4 mb-4 border border-gray-300 rounded"
        //   value={name}
        //   onChange={(e) => setName(e.target.value)}
        //   placeholder="Full Name"
        // />
  //       <input
          // type="text"
          // className="register__input w-full py-2 px-4 mb-4 border border-gray-300 rounded"
          // value={email}
          // onChange={(e) => setEmail(e.target.value)}
          // placeholder="E-mail Address"
  //       />
        // <input
        //   type="password"
        //   className="register__input w-full py-2 px-4 mb-4 border border-gray-300 rounded"
        //   value={password}
        //   onChange={(e) => setPassword(e.target.value)}
        //   placeholder="Password"
        // />
        // <button className="register__btn w-full py-2 px-4 mb-4 rounded bg-blue-500 text-white font-semibold" onClick={register}>
        //   Register
        // </button>
        // <button className="register__btn w-full py-2 px-4 mb-4 rounded bg-red-500 text-white font-semibold" onClick={signInWithGoogle}>
        //   Register with Google
        // </button>
  //       <div className="register__login-link text-center text-sm">
  //         Already have an account? <Link to="/" className="text-blue-500">Login</Link> now.
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="flex w-3/4 h-4/5 justify-center items-center bg-white rounded-lg shadow">
      <div className="w-1/2 items-center ml-16">
      <img src={homescreen} alt="image-description"></img>
      </div>
      <div className="w-1/2">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow ml-8">
          <h2 className="text-2xl mb-4">Welcome Register</h2> {/* Header added here */}
          <input
          type="text"
          className="register__input w-full py-2 px-4 mb-4 border border-gray-300 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
          <input
          type="text"
          className="register__input w-full py-2 px-4 mb-4 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
          />
          <input
        type="password"
        className="register__input w-full py-2 px-4 mb-4 border border-gray-300 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
        <button className="register__btn w-full py-2 px-4 mb-4 rounded bg-blue-500 text-white font-semibold" onClick={register}>
          Register
        </button>
        <button className="register__btn w-full py-2 px-4 mb-4 rounded bg-red-500 text-white font-semibold" onClick={signInWithGoogle}>
          Register with Google
        </button>
        </div>
      </div>
      </div>
    </div>
  );

  
}
export default Register;