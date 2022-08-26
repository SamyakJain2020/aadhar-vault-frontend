import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Checkbox } from "@mantine/core";

import { useSearchParams } from "react-router-dom";
import dataVaultAbi from "../contracts/DataVault.json";
const dataVaultAddress = "0xec26415e639D958995CD4FF682003A6021d4c0Da";

function MyAgency() {
  const [account, setAccount] = useState("");
  const [Agencies, setAgencies] = useState([]);
  const [id, setid] = useState(0);
  const [name, setname] = useState("");
  const [permission, setpermission] = useState([]);
  const [status, setstatus] = useState("");
  const [admins, setadmins] = useState([]);
  const [users, setusers] = useState([]);
  // const [Id, setId] = useState(0);

  const [searchParams] = useSearchParams();
  useEffect(() => {
    console.log("ID: ", searchParams.get("id"));
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
      console.log("Agencies: ", Agencies);
      setAgencies(Agencies);
      setid(Number(Agencies[0][id + 1]));
      setname(Agencies[1][id + 1]);
      // console.log("name: ", Agencies[1][id+1]);
      setstatus(Agencies[2][id + 1]);
      setpermission(Agencies[3][id + 1]);
      setadmins(Agencies[4][id + 1]);
      console.log("admins: ", Agencies[4][id + 1]);
      setusers(Agencies[5][id + 1]);
      console.log("users: ", Agencies[5][id + 1]);
      console.log("Agencies: ", Agencies);
    } catch (error) {
      console.log(error);
      // setError(error);
    }
  };
  return (
    <div className="">
      <div class="h-full mt-14 mb-10 mx-auto  w-11/12">
        <div class="grid grid-cols-1 lg:grid-cols-2 p-4 gap-4">
          <div class="relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-white-50 dark:bg-white-800 w-full shadow-lg rounded">
            <div>Name: {name}</div>
            <div>Id: {id}</div>
            <div>
              Status:{" "}
              {Number(status) ? (
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
            </div>
            <div>
              {/* Permission: {permission} */}
              {/* Admins: {admins}
              Users: {users} */}
            </div>
          </div>

          <div class="relative flex flex-col min-w-0 break-words bg-white-50 dark:bg-white-800 w-full shadow-lg rounded">
            <div class="rounded-t mb-0 px-0 border-0">
              <div class="flex flex-wrap items-center px-4 py-2">
                <div class="relative w-full max-w-full flex-grow flex-1">
                  <h3 class="font-semibold text-base text-white-900 dark:text-white-50">
                    Recent Activities
                  </h3>
                </div>
                <div class="relative w-full max-w-full flex-grow flex-1 text-right">
                  <button
                    class="bg-blue-500 dark:bg-white-100 text-white active:bg-blue-600 dark:text-white-800 dark:active:text-white-700 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    <a
                      href="
                    https://mumbai.polygonscan.com/address/0xec26415e639D958995CD4FF682003A6021d4c0Da"
                      target={"_blank"}
                    >
                      See all
                    </a>
                  </button>
                </div>
              </div>
              <div class="block w-full">
                <div class="px-4 bg-white-100 dark:bg-white-600 text-white-500 dark:text-white-100 align-middle border border-solid border-white-200 dark:border-white-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Today
                </div>
                <ul class="my-1">
                  <li class="flex px-4">
                    <div class="w-9 h-9 rounded-full flex-shrink-0 bg-indigo-500 my-2 mr-3">
                      <svg
                        class="w-9 h-9 fill-current text-indigo-50"
                        viewBox="0 0 36 36"
                      >
                        <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z"></path>
                      </svg>
                    </div>
                    <div class="flex-grow flex items-center border-b border-white-100 dark:border-white-400 text-sm text-white-600 dark:text-white-100 py-2">
                      <div class="flex-grow flex justify-between items-center">
                        <div class="self-center">
                          <a
                            class="font-medium text-white-800 hover:text-white-900 dark:text-white-50 dark:hover:text-white-100"
                            href="#0"
                            style={{ outline: " none" }}
                          >
                            Nick Mark
                          </a>{" "}
                          mentioned{" "}
                          <a
                            class="font-medium text-white-800 dark:text-white-50 dark:hover:text-white-100"
                            href="#0"
                            style={{ outline: " none" }}
                          >
                            Sara Smith
                          </a>{" "}
                          in a new post
                        </div>
                        <div class="flex-shrink-0 ml-2">
                          <a
                            class="flex items-center font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                            href="#0"
                            style={{ outline: " none" }}
                          >
                            View
                            <span>
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="transform transition-transform duration-500 ease-in-out"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li class="flex px-4">
                    <div class="w-9 h-9 rounded-full flex-shrink-0 bg-red-500 my-2 mr-3">
                      <svg
                        class="w-9 h-9 fill-current text-red-50"
                        viewBox="0 0 36 36"
                      >
                        <path d="M25 24H11a1 1 0 01-1-1v-5h2v4h12v-4h2v5a1 1 0 01-1 1zM14 13h8v2h-8z"></path>
                      </svg>
                    </div>
                    <div class="flex-grow flex items-center border-white-100 text-sm text-white-600 dark:text-white-50 py-2">
                      <div class="flex-grow flex justify-between items-center">
                        <div class="self-center">
                          The post{" "}
                          <a
                            class="font-medium text-white-800 dark:text-white-50 dark:hover:text-white-100"
                            href="#0"
                            style={{ outline: " none" }}
                          >
                            Post Name
                          </a>{" "}
                          was removed by{" "}
                          <a
                            class="font-medium text-white-800 hover:text-white-900 dark:text-white-50 dark:hover:text-white-100"
                            href="#0"
                            style={{ outline: " none" }}
                          >
                            Nick Mark
                          </a>
                        </div>
                        <div class="flex-shrink-0 ml-2">
                          <a
                            class="flex items-center font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                            href="#0"
                            style={{ outline: " none" }}
                          >
                            View
                            <span>
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="transform transition-transform duration-500 ease-in-out"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="px-4 bg-white-100 dark:bg-white-600 text-white-500 dark:text-white-100 align-middle border border-solid border-white-200 dark:border-white-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Yesterday
                </div>
                <ul class="my-1">
                  <li class="flex px-4">
                    <div class="w-9 h-9 rounded-full flex-shrink-0 bg-green-500 my-2 mr-3">
                      <svg
                        class="w-9 h-9 fill-current text-light-blue-50"
                        viewBox="0 0 36 36"
                      >
                        <path d="M23 11v2.085c-2.841.401-4.41 2.462-5.8 4.315-1.449 1.932-2.7 3.6-5.2 3.6h-1v2h1c3.5 0 5.253-2.338 6.8-4.4 1.449-1.932 2.7-3.6 5.2-3.6h3l-4-4zM15.406 16.455c.066-.087.125-.162.194-.254.314-.419.656-.872 1.033-1.33C15.475 13.802 14.038 13 12 13h-1v2h1c1.471 0 2.505.586 3.406 1.455zM24 21c-1.471 0-2.505-.586-3.406-1.455-.066.087-.125.162-.194.254-.316.422-.656.873-1.028 1.328.959.878 2.108 1.573 3.628 1.788V25l4-4h-3z"></path>
                      </svg>
                    </div>
                    <div class="flex-grow flex items-center border-white-100 text-sm text-white-600 dark:text-white-50 py-2">
                      <div class="flex-grow flex justify-between items-center">
                        <div class="self-center">
                          <a
                            class="font-medium text-white-800 hover:text-white-900 dark:text-white-50 dark:hover:text-white-100"
                            href="#0"
                            style={{ outline: " none" }}
                          >
                            240+
                          </a>{" "}
                          users have subscribed to{" "}
                          <a
                            class="font-medium text-white-800 dark:text-white-50 dark:hover:text-white-100"
                            href="#0"
                            style={{ outline: " none" }}
                          >
                            Newsletter #1
                          </a>
                        </div>
                        <div class="flex-shrink-0 ml-2">
                          <a
                            class="flex items-center font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                            href="#0"
                            style={{ outline: " none" }}
                          >
                            View
                            <span>
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="transform transition-transform duration-500 ease-in-out"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 mb-8 mx-4">
          <div class="w-full overflow-hidden rounded-lg shadow-xs">
            <div class="w-full overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-xs font-semibold tracking-wide text-left text-white-500 uppercase border-b dark:border-white-700 bg-white-50 dark:text-white-400 dark:bg-white-800">
                    <th class="px-4 py-3">Admins</th>
                    {/* <th class="px-4 py-3">Amount</th> */}
                    <th class="px-4 py-3">Status</th>
                    {/* <th class="px-4 py-3">Date</th> */}
                  </tr>
                </thead>
                <tbody class="bg-white divide-y dark:divide-white-700 dark:bg-white-800">
                  <tr class="bg-white-50 dark:bg-white-800 hover:bg-white-100 dark:hover:bg-white-900 text-white-700 dark:text-white-400">
                    <td class="px-4 py-3">
                      <div class="flex items-center text-sm">
                        <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                          <img
                            class="object-cover w-full h-full rounded-full"
                            src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=200&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                            alt=""
                            loading="lazy"
                          />
                          <div
                            class="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          ></div>
                        </div>
                        <div>
                          <p class="font-semibold">{admins[0]}</p>
                        </div>
                      </div>
                    </td>
                    {/* <td class="px-4 py-3 text-sm">$855.85</td> */}
                    <td class="px-4 py-3 text-xs">
                      <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                        {" "}
                        Approved{" "}
                      </span>
                    </td>
                    {/* <td class="px-4 py-3 text-sm">15-01-2021</td> */}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="mt-4 mb-8 mx-4">
          <div class="w-full overflow-hidden rounded-lg shadow-xs">
            <div class="w-full overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-xs font-semibold tracking-wide text-left text-white-500 uppercase border-b dark:border-white-700 bg-white-50 dark:text-white-400 dark:bg-white-800">
                    <th class="px-4 py-3">Clients</th>
                    {/* <th class="px-4 py-3">Amount</th> */}
                    <th class="px-4 py-3">Status</th>
                    {/* <th class="px-4 py-3">Date</th> */}
                  </tr>
                </thead>

                {users.length > 0 && (
                  <tbody class="bg-white divide-y dark:divide-white-700 dark:bg-white-800">
                    <tr class="bg-white-50 dark:bg-white-800 hover:bg-white-100 dark:hover:bg-white-900 text-white-700 dark:text-white-400">
                      <td class="px-4 py-3">
                        <div class="flex items-center text-sm">
                          <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                            <img
                              class="object-cover w-full h-full rounded-full"
                              src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=200&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                              alt=""
                              loading="lazy"
                            />
                            <div
                              class="absolute inset-0 rounded-full shadow-inner"
                              aria-hidden="true"
                            ></div>
                          </div>
                          <div>
                            <p class="font-semibold">{users[0]}</p>
                          </div>
                        </div>
                      </td>
                      {/* <td class="px-4 py-3 text-sm">$855.85</td> */}
                      <td class="px-4 py-3 text-xs">
                        <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                          {" "}
                          Approved{" "}
                        </span>
                      </td>
                      {/* <td class="px-4 py-3 text-sm">15-01-2021</td> */}
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>

      <script
        src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.0/dist/alpine.min.js"
        defer
      ></script>
    </div>
  );
}

export default MyAgency;
