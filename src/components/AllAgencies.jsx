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
    <div className=" p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
      {Agencies[1]?.map((agency, index) => {
        if (index === 0) return;
        return (
          <>
            <div
              key={index}
              className=" rounded overflow-hidden shadow-lg"
            >
              <div className="px-6 py-4">
                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                  ID: {Number(Agencies[0][index])}
                </h2>
                <div className="font-bold text-xl mb-2"> Name:{agency}</div>
                <p className="text-gray-700 text-base">Permissions</p>
                {Agencies[3][index].map((permission, i) => {
                  return (
                    <div>
                      <p className="leading-relaxed mb-3">
                        {i === 0
                          ? "SSI Address: "
                          : i === 1
                          ? "Name: "
                          : "Aadhar Signature: "}
                        {Number(permission) === 1 ? "Granted" : "Denied"}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p>{`Status: ${Agencies[2][index]}`}</p>
              <p className="leading-relaxed mb-3">Admins</p>
              <div className="px-6 pt-4 pb-2">
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
          </>
        );
      })}
    </div>
  );
}

export default Agency;
