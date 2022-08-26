/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import Home from "./components/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
} from "react-router-dom";
import Auth from "./components/Auth";
import IPFS from "./components/IPFS";
import Agency from "./components/Agency";
import Create from "./components/Create";
import Documents from "./components/Documents";
import Verify from "./components/Verify";
import AllAgencies from "./components/AllAgencies";
import AadharHolder from "./components/AadharHolder";
import MyAadhar from "./components/MyAadhar";
import MyAgency from "./components/MyAgency";
import "./App.css";
function App() {
  const [verfied, setVerified] = useState();

  return (
    <div>
      <div></div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/addAgency" element={<Agency />} />

          <Route
            path="/sign"
            element={<IPFS verified={verfied} setVerified={setVerified} />}
          />
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
              <Documents
                setVerified={setVerified}
                verified={verfied}
              ></Documents>
            }
          />
          <Route path="/verify" element={<Verify />} />
          <Route path="/allAgencies" element={<AllAgencies />} />
          <Route path="/addAadharUser" element={<AadharHolder />} />
          <Route path="/myAadhar" element={<MyAadhar />} />
          {/* <Route path="/myAgency/:id" element={<MyAgency />} /> */}
          <Route path="/myAgency" element={<MyAgency />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
