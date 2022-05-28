/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import IPFS from "./components/IPFS";
import Create from "./components/Create";
import Documents from "./components/Documents";
import "./App.css";
function App() {
  const [verfied, setVerified] = useState();

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign" element={<IPFS verified={verfied} setVerified={setVerified}/>} />
          <Route
            path="/home"
            element={<Home verified={verfied} setVerified={setVerified} />}
          />
          <Route
            path="/auth"
            element={<Auth verified={verfied} setVerified={setVerified} />}
          />
          <Route
            path="/create"
            element={
              <Create setVerified={setVerified} verified={verfied}></Create>
            }
          />
          
          <Route
            path="/my-docs"
            element={
              <Documents setVerified={setVerified} verified={verfied}></Documents>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
