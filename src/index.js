import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import AboutUs from "./pages/AboutUs"
import Login from "./pages/Login"
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import Dashboard from "./pages/Dboard";
import Groups from "./pages/Groups";
import NewGroup from "./pages/NewGroup";
import Receipt from "./pages/Receipt";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route exact path="/LoginPage" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/groups" element={<Groups />} />
          <Route exact path="/NewGroup" element={<NewGroup />} />
          <Route exact path="/receipt" element={<Receipt />} />
          <Route exact path="AboutUs" element={<AboutUs />} />
          <Route exact path="Home" element={<Home />} />
        </Routes>
      </Router>
    </div>


    /*
    <Router>
      <Routes>
          <Route index element={<Home />} />
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route exact path="AboutUs" element={<AboutUs />} />
          <Route exact path="Home" element={<Home />} />
      </Routes>
    </Router>
    */

  );
}



const root = createRoot(document.getElementById("root"));



root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
export default App;
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
