import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import dataVaultAbi from "../contracts/DataVault.json";
const dataVaultAddress = "0x37E792b19e968B6E5BdfE70ba3Db76a158304ba0";
function Agency() {
  const [account, setAccount] = useState("");
  const [error, setError] = useState(false);
  const [Agencies, setAgencies] = useState([]);
  const [isUidai, setIsUidai] = useState(false);
  const [Message, setMessage] = useState("");

  useEffect(() => {
    checkWalletConnected();
    handleUIDAI();
    getAgency();
  }, []);
  let handleUIDAI = async () => {};
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

  let handleAgency = async (id, status) => {
    console.log("Registering");

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(
      dataVaultAddress,
      dataVaultAbi.abi,
      signer
    );
    try {
      let Aaproval = await contract.ApproveAgency(id, status);
      await Aaproval.wait();

      console.log("Aaproval DONE");
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  let getAgency = async () => {
    console.log("Finding ");

    // console.log("Finding UIDAI");
    // let provider = new ethers.providers.Web3Provider(window.ethereum);
    // let signer = await provider.getSigner();
    // let contract1 = new ethers.Contract(
    //   dataVaultAddress,
    //   dataVaultAbi.abi,
    //   signer
    // );
    // let addDocument;
    // try {
    //   addDocument = await contract1._UIDAI();
    //   console.log("UIDAI=" + addDocument);
    //   await addDocument.wait();
    //   setIsUidai(true);
    // } catch (error) {
    //   // setError(error);
    // }  
    // console.log("account",account)
    // if (addDocument != account) {
    //   console.log("Not UIDAI");
    //   setMessage("You are not authorized to This route");
    //   return
    // }

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(
      dataVaultAddress,
      dataVaultAbi.abi,
      signer
    );
    try {
      let Agencies = await contract.getAllAgencyData();
      //   await Agencies.wait();
      setAgencies(Agencies);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  if (Message !== "")
  return <div className="text-center">{Message}</div>;
  return (
    <div className=" p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5 text-center">
      {Agencies[1]?.map((agency, index) => {
        if (index === 0) return;
       
        return (
          <>
            <div
              key={index}
              className=" rounded overflow-hidden shadow-lg ring ring-pink-500 ring-offset-2 ring-offset-pink-100"
            >
              <div className="px-6 py-4">
                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                  ID: {Number(Agencies[0][index])}
                </h2>
                <div className="font-bold text-xl mb-2"> Name:{agency}</div>
                <p className="text-gray-700 text-base font-bold">Permissions</p>
                {Agencies[3][index].map((permission, i) => {
                  return (
                    <div className="leading-relaxed mb-3">
                      <p>
                        {i === 0
                          ? "SSI Address: "
                          : i === 1
                          ? "Name: "
                          : "Aadhar Signature: "}
                        {Number(permission) === 1 ? (
                          <span class="px-2  m-2 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                            {" "}
                            Granted{" "}
                          </span>
                        ) : (
                          <span class="px-2  m-2 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700">
                            {" "}
                            Revoked{" "}
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p>
                {`Status:`}
                {Agencies[2][index] ? (
                  <span class="px-2  m-2 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                    {" "}
                    Approved{" "}
                  </span>
                ) : (
                  <span class="px-2  font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full">
                    {" "}
                    Pending{" "}
                  </span>
                )}
              </p>
              <p className="leading-relaxed mb-3 font-bold">Admins</p>
              <div className="px-3  pb-2">
                {Agencies[4][index].map((Admin) => {
                  return (
                    <div>
                      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        {`# ${Admin.substring(0, 8)}`}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() =>
                  handleAgency(Agencies[0][index], !Agencies[2][index])
                }
              >
                {Agencies[2][index] !== true ? `Approve` : `Remove Agency`}
              </button>

              <button
                className="bg-blue-500 ml-5 mb-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                // onClick={() => handleAgency(agency, true)}
              >
                <a
                  href={`/myAgency?id=${Number(Agencies[0][index])}`} ///${Number(Agencies[0][index])}
                  className="text-base font-medium text-white hover:underline underline-offset-4 transition duration-1000 "
                >
                  Agency Dashboard
                </a>
              </button>
            </div>
          </>
        );
      })}
    </div>
  );
}

export default Agency;
