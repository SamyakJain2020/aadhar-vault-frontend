import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Checkbox } from "@mantine/core";

import dataVaultAbi from "../contracts/DataVault.json";
const dataVaultAddress = "0x24079D400bE84984ABe17E587B650F247e2df2A4";

function Agency() {
  const [account, setAccount] = useState("");
  const [error, setError] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [permi1, setPermi1] = useState(false);
  const [permi2, setPermi2] = useState(false);
  const [permi3, setPermi3] = useState(false);
  useEffect(() => {
    checkWalletConnected();
  }, []);

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
  let handleRegister = async () => {
    console.log("Registering");
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(
      dataVaultAddress,
      dataVaultAbi.abi,
      signer
    );
    try {
      let RegisterAgency = await contract.RegisterAgency(orgName, [
        permi1 ? 1 : 0,
        permi2 ? 1 : 0,
        permi3 ? 1 : 0,
      ]);
      await RegisterAgency.wait();

      console.log("RegisterAgency Registered");
    } catch (error) {
      setError(error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <img
              src="https://myaadhaar.uidai.gov.in/static/media/uidai_english_logo.dd2d2a1c.svg"
              className="h-16 mx-auto"
            />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Sign up to be an Agency
            </h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <div className="relative mb-4">
                  <label
                    htmlFor="name"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Name of Organisation
                  </label>
                  <input
                    type="string"
                    id="name"
                    name="name"
                    placeholder="Name"
                    onChange={(e) => setOrgName(e.target.value)}
                    value={orgName}
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                  <Checkbox
                    label="Permission for ssi Address Access"
                    checked={permi1}
                    onChange={(event) => setPermi1(event.currentTarget.checked)}
                  />
                  <Checkbox
                    label="Permission for Name Access"
                    checked={permi2}
                    onChange={(event) => setPermi2(event.currentTarget.checked)}
                  />
                  <Checkbox
                    label="Permission for Aadhar Signature Access"
                    checked={permi3}
                    onChange={(event) => setPermi3(event.currentTarget.checked)}
                  />
                </div>

                <button
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  onClick={handleRegister}
                >
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">Sign Up</span>
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  I agree to abide by templatana's
                  <a href="/" >Terms of Service</a>
                  and its
                  <a href="/">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Agency;
