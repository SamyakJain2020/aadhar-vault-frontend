import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Select } from "@mantine/core";
import { Modal } from "@mantine/core";

import dataVaultAbi from "../contracts/DataVault.json";
const dataVaultAddress = "0x37E792b19e968B6E5BdfE70ba3Db76a158304ba0";
// giveAadhaar
function AadharHolder() {
  const [account, setAccount] = useState("");
  const [error, setError] = useState(false);
  const [Name, setName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Add, setAdd] = useState("");
  const [ID, setID] = useState();
  const [signature, setSignature] = useState("");
  const [Agencies, setAgencies] = useState([]);
  const [Data, setData] = useState([]);
  const [AgencyID, setAgencyID] = useState(null);
  const [openedSuccess, setOpenedSuccess] = useState(false);
  const [openedFailure, setOpenedFailure] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [Aadhars, setAadhars] = useState([]);
  const [Loading1, setLoading1] = useState(false);

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
    giveAadhaar();
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
      console.log(Agencies);
      let a = Agencies[1]?.map((agency, index) => {
        return {
          value: index,
          label: agency.name,
        };
      });
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  let giveAadhaar = async () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(
      dataVaultAddress,
      dataVaultAbi.abi,
      signer
    );
    try {
      let A = await contract.giveAadhaar();
      setAadhars(A);
      console.log(A);
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
    setLoading(true);

    //check if signature is present in Aadhars array
    let found =
      Aadhars.find((aadhar) => {
        return aadhar === signature;
      }) !== undefined;
    if (found) {
      console.log("Duplicate Found");
      setLoading(false);
      setOpenedFailure(true);
      return;
    }

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
        signature,
        Phone,
        Add
      );
      await RegisterAgency.wait();
      setOpenedSuccess(true);
      setLoading(false);
      console.log("RegisterAgency Registered", RegisterAgency);
    } catch (error) {
      setOpenedFailure(true);
      setLoading(false);

      console.log(error);
      setError(error);
    }
  };
  let handleAadharRegisterInAgency = async () => {
    console.log("Registering");
    setLoading1(true);
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(
      dataVaultAddress,
      dataVaultAbi.abi,
      signer
    );
    try {
      let RegisterAgency = await contract.RegisterAadhaarInAgency(2, ID);
      await RegisterAgency.wait();
      setOpenedSuccess(true);
      setLoading1(false);
      console.log("RegisterAgency Registered");
    } catch (error) {
      setLoading1(false);
      setOpenedFailure(true);
      console.log(error);
      setError(error);
    }
  };
  return (
    <div className="Holder text-2xl">
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <div className="form" action="#">
            <h1 className="text-2xl ">Create Aadhar Account</h1>
            <span>or use your Biometric Data for registration</span>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={Name}
            />
            <input
              type="text"
              placeholder="Signature"
              onChange={(e) => {
                let x = e.target.value;
                setSignature(x);
              }}
              value={signature}
            />
            <input
              type="text"
              placeholder="Citizen Phone Number"
              onChange={(e) => setPhone(e.target.value)}
              value={Phone}
            />
            <input
              type="text"
              placeholder="Citizen Address"
              onChange={(e) => setAdd(e.target.value)}
              value={Add}
            />
            {/* ethers.utils.hashMessage(x) */}
            <button
              className="bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 border-none"
              onClick={handleAadharRegister}
            >
              {Loading ? "Executing Txn..." : "Add Aadhar"}
            </button>
          </div>
        </div>
        <div className="form-container sign-in-container">
          <div className="form">
            <h1>Add Aahar to Vault</h1>
            <span>or use your account</span>

            <Select
              className="p-4"
              label="The Agency You Want to be Added"
              placeholder="Pick one"
              data={Data}
              value={AgencyID}
              onChange={(e) => {
                setAgencyID(e.value);
                console.log(e.value);
              }}
            />
            <input
              type="text"
              placeholder="SSI Address"
              onChange={(e) => setID(e.target.value)}
              value={ID}
            />
            <button
              className="bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 border-none"
              onClick={handleAadharRegisterInAgency}
            >
              {Loading1 ? "Executing Transaction..." : "Add Aadhar"}
            </button>
          </div>
        </div>

        <Modal opened={openedSuccess} onClose={() => setOpenedSuccess(false)}>
          <div className="w-full  overflow-hidden rounded-lg bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mt-8 h-16 w-16 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <h1 className="mt-2 text-center text-2xl font-bold text-gray-500">
              Success
            </h1>
            <p className="my-4 text-center text-sm text-gray-500">
              Woah, successfully completed 50% Tasks. We will Approve You
              shortly.
            </p>
            <div className="space-x-4  py-4 text-center">
              <button
                className="inline-block rounded-md bg-red-500 px-10 py-2 font-semibold text-red-100 shadow-md duration-75 hover:bg-red-400"
                onClick={() => setOpenedSuccess(false)}
              >
                Close
              </button>
              {/* <button className="inline-block rounded-md bg-green-500 px-6 py-2 font-semibold text-green-100 shadow-md duration-75 hover:bg-green-400">
                        Dashboard
                      </button> */}
            </div>
          </div>
        </Modal>

        <Modal opened={openedFailure} onClose={() => setOpenedFailure(false)}>
          <div className="w-full  overflow-hidden rounded-lg bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mt-8 h-16 w-16 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <h1 className="mt-2 text-center text-2xl font-bold text-gray-500">
              Cancel
            </h1>
            <p className="my-4 text-center text-sm text-gray-500">
              Just a small miss.
            </p>
            <p className="my-4 text-center text-sm text-gray-500">
              {"User already Exist"}
            </p>
            <div className="space-x-4  py-4 text-center">
              <button
                className="inline-block rounded-md bg-red-500 px-10 py-2 font-semibold text-red-100 shadow-md duration-75 hover:bg-red-400"
                onClick={() => setOpenedFailure(false)}
              >
                Cancel
              </button>
              {/* <button className="inline-block rounded-md bg-green-500 px-6 py-2 font-semibold text-green-100 shadow-md duration-75 hover:bg-green-400">
                        Try Again
                      </button> */}
            </div>
          </div>
        </Modal>

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
