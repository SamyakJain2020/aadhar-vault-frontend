import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import dataVaultAbi from "../contracts/DataVault.json";
const dataVaultAddress = "0x24079D400bE84984ABe17E587B650F247e2df2A4";
function Agency() {
  const [account, setAccount] = useState("");
  const [error, setError] = useState(false);
  const [Agencies, setAgencies] = useState([]);
  useEffect(() => {
    checkWalletConnected();
    getAgency();
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
      let Aaproval = await contract.AaproveAgency(id, status);
      await Aaproval.wait();

      console.log("Aaproval DONE");
    } catch (error) {
      setError(error);
    }
  };
  let getAgency = async () => {
    console.log("Finding ");
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
  return (
    <div className=" px-5 py-24 mx-auto flex flex-wrap">
      {Agencies[1]?.map((agency, index) => {
        if (index === 0) return;
        return (
          <div
            key={index}
            className=" w-1/3 bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative"
          >
            <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
              ID: {Number(Agencies[0][index])}
            </h2>
            <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
              {agency}
            </h1>
            <p className="leading-relaxed mb-3">Permissions</p>
            {Agencies[3][index].map((permission) => {
              return (
                <div>
                  <p className="leading-relaxed mb-3">{Number(permission)}</p>
                </div>
              );
            })}
            <p className="leading-relaxed mb-3">Status</p>
            <p>{`${Agencies[2][index]}`}</p>
            <p className="leading-relaxed mb-3">Admins</p>
            {Agencies[4][index].map((Admin) => {
              return (
                <div>
                  <p className="leading-relaxed mb-3">{Admin}</p>
                </div>
              );
            })}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => handleAgency(agency, true)}
            >
              {Agencies[2][index] !== true ? `Approve` : `Remove Agency`}
            </button>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              // onClick={() => handleAgency(agency, true)}
            >
              <a
                href="/myAgency"
                className="text-base font-medium text-white hover:underline underline-offset-4 transition duration-1000 "
              >
                Agency Dashboard
              </a>
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Agency;
