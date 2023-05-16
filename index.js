import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SecondPage from "./pages/secondpage";
import AboutUs from "./pages/AboutUs"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route index element={<Home />} />
          <Route path="secondpage" element={<SecondPage />} />
          <Route path="AboutUs" element={<AboutUs />} />
          <Route path="Home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


const root = createRoot(document.getElementById("root"));



root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
