/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import logo from "./assets/logo.png";
import aLogo from "./assets/uidai_english_logo.dd2d2a1c.svg";
// import { NavLink } from "@mantine/core";
import { ethers } from "ethers";
import dataVaultAbi from "../contracts/DataVault.json";
const dataVaultAddress = "0x9AC6537422aB056B0A45A0EE1743e9d0659DfC50";

export default function Example() {
  const [account, setAccount] = useState("");
  const [isUidai, setIsUidai] = useState(false);
  useEffect(() => {
    checkWalletConnected();
    handleUIDAI();
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
  let handleUIDAI = async () => {
    console.log("Finding UIDAI");
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(
      dataVaultAddress,
      dataVaultAbi.abi,
      signer
    );
    try {
      let addDocument = await contract._UIDAI();
      console.log("UIDAI=" + addDocument);
      await addDocument.wait();
      setIsUidai(true);
    } catch (error) {
      // setError(error);
    }
  };
  return (
    <header>
      <div className="relative bg-black">
        <div className="flex justify-between items-center max-w-full mx-auto px-4 py-6 sm:px-6 md:justify-start md:space-x-10 lg:px-8">
          <div className="flex justify-start ">
            <a href="#">
              <span className="sr-only">Workflow</span>
              <img className="h-auto w-8 md:w-10 " src="https://myaadhaar.uidai.gov.in/static/media/aadhaar_english_logo.9a2d6379.svg" alt="" />
            </a>
          </div>
          {/* <div className="-mr-12 -my-2 md:hidden">
            <Popover.Button className="bg-black rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div> */}
          <div as="nav" className=" md:flex space-x-10 sm:flex-wrap">
            <a
              href="/"
              className="text-base font-medium text-white hover:underline underline-offset-4 transition duration-1000 "
            >
              HOME
            </a>
            <a
              href="/addAgency"
              className="text-base font-medium text-white hover:underline underline-offset-4 transition duration-1000 "
            >
               Aadhar Agency
            </a>
            <a
              href="/addAadharUser"
              className="text-base font-medium text-white hover:underline underline-offset-4 transition duration-1000 "
            >
               Aadhar Holder
            </a>

            <a
              href="/myAadhar"
              className="text-base font-medium text-white hover:underline underline-offset-4 transition duration-1000 "
            >
              My Aadhar Information
            </a>
            <a
              href="/allAgencies"
              className="text-base font-medium text-white hover:underline underline-offset-4 transition duration-1000 "
            >
              All Agencies
            </a>
            
            {/* <NavLink className="text-base font-medium text-white hover:underline underline-offset-4 transition duration-1000 ">
              <a href="/allAgencies">All Agencies</a>
            </NavLink> */}
            {/* <a
              href="/home"
              className="text-base font-medium text-white  hover:underline underline-offset-4 transition duration-1000"
            >
              Self Sovereign Identity OLD
            </a>
            <a
              href="/sign"
              className="text-base font-medium text-white  hover:underline underline-offset-4 transition duration-1000"
            >
              Sign Document OLD
            </a>
            <a
              href="/my-docs"
              className="text-base font-medium text-white  hover:underline underline-offset-4 transition duration-1000"
            >
              My Verified Documenets OLD
            </a>
            <a
              href="/verify"
              className="text-base font-medium text-white  hover:underline underline-offset-4 transition duration-1000"
            >
              Verify Document OLD
            </a> */}
          </div>
          <div className="l md:flex items-center justify-end md:flex-1 lg:w-0 sm:flex-wrap">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
