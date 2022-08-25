import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Checkbox } from "@mantine/core";
import { Modal } from "@mantine/core";
import dataVaultAbi from "../contracts/DataVault.json";
const dataVaultAddress = "0x9AC6537422aB056B0A45A0EE1743e9d0659DfC50";

function Agency() {
  const [account, setAccount] = useState("");
  const [error, setError] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [permi1, setPermi1] = useState(false);
  const [permi2, setPermi2] = useState(false);
  const [permi3, setPermi3] = useState(false);
  const [openedSuccess, setOpenedSuccess] = useState(false);
  const [openedFailure, setOpenedFailure] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const [Agencies, setAgencies] = useState([]);

  useEffect(() => {
    checkWalletConnected();
    getAgency();
  }, []);
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
    if (orgName === "") return;
    // Agencies[1]
    // find if orgName is present in the list Agencies[1]
    let found = false;
    console.log(Agencies[1]);
    found = Agencies[1].find((element) => {
      return element === orgName;
    });
    if (found) {
      setMessage(
        `Organization already registered with us (with this ${account} reference Number)`
      );
    }
    console.log("Registering");
    setLoading(true);
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
      setOpenedSuccess(true);
      setLoading(false);
      console.log("RegisterAgency Registered");
    } catch (error) {
      console.log(error);
      setOpenedFailure(true);
      setLoading(false);
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
              alt="logo"
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
                    className="leading-7 text-xl text-gray-600"
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
                  {message ? (
                    <div className="text-red-500 text-sm">{message}</div>
                  ) : null}
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
                  className={`mt-5 tracking-wide font-semibold bg-gradient-to-tr from-blue-400 via-blue-400 to-blue-500 text-gray-100 w-full ${
                    Loading ? "disabled" : ""
                  } py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
                  onClick={handleRegister}
                >
                  {Loading !== true ? (
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
                  ) : (
                    <img
                      className="w-6 h-6 -ml-2"
                      src="https://icon-library.com/images/loading-icon-transparent-background/loading-icon-transparent-background-23.jpg"
                      alt="img"
                    />
                  )}
                  <span className="ml-3">
                    {Loading ? "Executing" : "Register Your Agency with us"}
                  </span>
                </button>
                <Modal
                  opened={openedSuccess}
                  onClose={() => setOpenedSuccess(false)}
                >
                  <div class="w-full  overflow-hidden rounded-lg bg-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mx-auto mt-8 h-16 w-16 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <h1 class="mt-2 text-center text-2xl font-bold text-gray-500">
                      Success
                    </h1>
                    <p class="my-4 text-center text-sm text-gray-500">
                      Woah, successfully completed 50% Tasks. We will Approve
                      You shortly.
                    </p>
                    <div class="space-x-4  py-4 text-center">
                      <button
                        class="inline-block rounded-md bg-red-500 px-10 py-2 font-semibold text-red-100 shadow-md duration-75 hover:bg-red-400"
                        onClick={() => setOpenedSuccess(false)}
                      >
                        Cancel
                      </button>
                      {/* <button class="inline-block rounded-md bg-green-500 px-6 py-2 font-semibold text-green-100 shadow-md duration-75 hover:bg-green-400">
                        Dashboard
                      </button> */}
                    </div>
                  </div>
                </Modal>

                <Modal
                  opened={openedFailure}
                  onClose={() => setOpenedFailure(false)}
                >
                  <div class="w-full  overflow-hidden rounded-lg bg-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mx-auto mt-8 h-16 w-16 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <h1 class="mt-2 text-center text-2xl font-bold text-gray-500">
                      Cancel
                    </h1>
                    <p class="my-4 text-center text-sm text-gray-500">
                      Just a small miss, 2/5 Tasks
                    </p>
                    <div class="space-x-4  py-4 text-center">
                      <button
                        class="inline-block rounded-md bg-red-500 px-10 py-2 font-semibold text-red-100 shadow-md duration-75 hover:bg-red-400"
                        onClick={() => setOpenedFailure(false)}
                      >
                        Cancel
                      </button>
                      {/* <button class="inline-block rounded-md bg-green-500 px-6 py-2 font-semibold text-green-100 shadow-md duration-75 hover:bg-green-400">
                        Try Again
                      </button> */}
                    </div>
                  </div>
                </Modal>

                <p className="mt-6 text-xs text-gray-600 text-center">
                  I agree to abide by UIDI Terms of Service and its Privacy
                  Policy
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1  text-center hidden lg:flex">
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
