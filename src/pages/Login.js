import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword, signInWithGoogle } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import homescreen from "./backgroundyachy.png";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/loading");
  }, [user, loading]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="flex w-3/4 h-4/5 justify-center items-center bg-white rounded-lg shadow">
      <div className="w-1/2 items-center ml-16">
      <img src={homescreen} alt="image-description"></img>
      </div>
      <div className="w-1/2">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow ml-8">
          <h2 className="text-2xl mb-4">Welcome Login</h2> {/* Header added here */}
          <input
            type="text"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
          />
          <input
            type="password"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => signInWithEmailAndPassword(email, password)}
          >
            Login
          </button>
          <button
            className="w-full mb-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={signInWithGoogle}
          >
            Login with Google
          </button>
          <div>
            <Link to="/Reset" className="text-blue-500 hover:underline">
              Forgot Password
            </Link>
          </div>
          <div>
            Don't have an account?{' '}
            <Link to="/Register" className="text-blue-500 hover:underline">
              Register
            </Link>{' '}
            now.
          </div>
        </div>
      </div>
      </div>
    </div>
  );

  
  
  
  
}
export default Login;