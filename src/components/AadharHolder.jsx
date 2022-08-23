import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Select } from "@mantine/core";
import dataVaultAbi from "../contracts/DataVault.json";
const dataVaultAddress = "0x24079D400bE84984ABe17E587B650F247e2df2A4";

function AadharHolder() {
  const [account, setAccount] = useState("");
  const [error, setError] = useState(false);
  const [Name, setName] = useState("");
  const [signature, setSignature] = useState("");
  const [Agencies, setAgencies] = useState([]);
  const [Data, setData] = useState([]);
  const [AgencyID, setAgencyID] = useState(null);
  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    signUpButton.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
    checkWalletConnected();
    getAgency();
  }, []);

  let getAgency = async () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(
      dataVaultAddress,
      dataVaultAbi.abi,
      signer
    );
    try {
      let Agencies = await contract.getAllAgencyData();
      setAgencies(Agencies);
      setData(
        Agencies[1]?.filter((agency, index) => {
          return {
            value: agency.id,
            label: agency.name,
          };
        })
      );
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  const checkWalletConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Install Metamask");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found Account, ", account);
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let network = await provider.getNetwork();
      setAccount(account);
      // setNetwork(network.name);
      if (network.chainId !== 80001) {
        console.log("Wrong network");
      } else {
        console.log("maticmum connected");
      }
    } else {
      console.log("Create a Polygon Matic Account");
    }
  };
  let handleAadharRegister = async () => {
    console.log("Registering");
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(
      dataVaultAddress,
      dataVaultAbi.abi,
      signer
    );
    try {
      let RegisterAgency = await contract.RegisterNewAadhaarHolder(
        Name,
        signature
      );
      await RegisterAgency.wait();

      console.log("RegisterAgency Registered");
    } catch (error) {
      setError(error);
    }
  };
  let handleAadharRegisterInAgency = async () => {
    console.log("Registering");
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(
      dataVaultAddress,
      dataVaultAbi.abi,
      signer
    );
    try {
      let RegisterAgency = await contract.RegisterNewAadhaarHolder(
        Name,
        signature
      );
      await RegisterAgency.wait();

      console.log("RegisterAgency Registered");
    } catch (error) {
      setError(error);
    }
  };
  return (
    <div className="Holder text-2xl">
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <form action="#">
            <h1>Create Aadhar Account</h1>
            <span>or use your Biometric Data for registration</span>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={Name}
            />
            <input
              type="password"
              placeholder="Signature"
              onChange={(e) => setSignature(e.target.value)}
              value={signature}
            />
            <button className="bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 border-none">
              Add Aadhar
            </button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#">
            <h1>Add Aahar to Vault</h1>
            <span>or use your account</span>

            <Select
              className="p-4"
              label="The Agency You Want to be Added"
              placeholder="Pick one"
              data={Data}
              value={AgencyID}
              onChange={(e) => setAgencyID(e.value)}
            />
            <input type="text" placeholder="SSI Address" />
            <button
              className="bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 border-none"
              onClick={handleAadharRegisterInAgency}
            >
              Add Aadhar
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay bg-gradient-to-l from-cyan-900 via-neutral-900 to-purple-800">
            <div className="overlay-panel overlay-left">
              <h1>Want To Add to a Govermental Agency!</h1>
              <p>
                {/* To keep connected with  please login with your personal info */}
              </p>
              <button className="ghost" id="signIn">
                Join With us
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signUp">
                Register New Aadhar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AadharHolder;
