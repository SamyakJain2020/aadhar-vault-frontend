import React, { useState, useEffect } from "react";

import { create } from "ipfs-http-client";
import { ethers } from "ethers";

import { Modal, Button } from "@mantine/core";

import Auth from "./Auth";

// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Viewer } from "@react-pdf-viewer/core";
import { getFilePlugin } from "@react-pdf-viewer/get-file";

// import dCertifyABI from "../artifacts/contracts/Greeter.sol/DCertify.json";
let dCertifyABI 
const dCertifyAddress = "0xC5F69dFB40f6755400F600e1c7E3d9D73801253d";

function IPFS({ verified, setVerified }) {
  const [images, setImages] = React.useState([]);
  const [opened, setOpened] = useState(false);
  const [account, setAccount] = useState("");
  const [isDoneMFA, setIsDoneMFA] = useState(false);

  const [error, setError] = useState(false);
  const getFilePluginInstance = getFilePlugin();
  const { Download } = getFilePluginInstance;
  useEffect(() => {
    if (isDoneMFA) {
      setOpened(true);
    } else setOpened(false);
  }, [isDoneMFA]);

  let ipfs;
  try {
    ipfs = create({
      url: "https://ipfs.infura.io:5001/api/v0",
    });
  } catch (error) {
    console.error("IPFS error ", error);
    ipfs = undefined;
  }

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
      console.log("Create a Ethereum Account");
    }
  };
  let verifyDocument = async (ipfsLink) => {
    const wallet = ethers.Wallet.createRandom();
    console.log("address:", wallet.address);
    console.log("mnemonic:", wallet.mnemonic.phrase);
    console.log("privateKey:", wallet.privateKey);
    let hash = ethers.utils.hashMessage(ipfsLink);
    console.log("hash:", hash);
    let signPromise = wallet.signMessage(ipfsLink);
    signPromise.then((signature) => {
      console.log("sign:", signature);
      let ans = ethers.utils.verifyMessage(ipfsLink, signature);
      console.log("asm:", ans);
    });
  };
  let addDocument = async (ipfsLink) => {
    const wallet = ethers.Wallet.createRandom();
    console.log("address:", wallet.address);
    console.log("mnemonic:", wallet.mnemonic.phrase);
    console.log("privateKey:", wallet.privateKey);
    let hash = ethers.utils.hashMessage(ipfsLink);
    console.log("hash:", hash);
    let signPromise = wallet.signMessage(ipfsLink);
    // handle promise using async/await
    let signature = await signPromise;
    console.log("sign:", signature);
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(
      dCertifyAddress,
      dCertifyABI.abi,
      signer
    );
    try {
      let addDocument = await contract.addDocument(
        `https://ipfs.infura.io/ipfs/${images[images.length - 1]?.path}`,
        account,
        signature,
        "True"
      );
      await addDocument.wait();

      console.log("Document Added");
    } catch (error) {
      setError(error);
    }
  };

  /**
   * @description event handler that uploads the file selected by the user
   */
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    const files = form[0].files;

    if (!files || files.length === 0) {
      return alert("No files selected");
    }

    const file = files[0];
    // upload files
    const result = await ipfs.add(file);

    const uniquePaths = new Set([
      ...images.map((image) => image.path),
      result.path,
    ]);
    const uniqueImages = [...uniquePaths.values()].map((path) => {
      return [
        ...images,
        {
          cid: result.cid,
          path: result.path,
        },
      ].find((image) => image.path === path);
    });

    // @ts-ignore
    setImages(uniqueImages);

    form.reset();
  };

  console.log("images ", images);

  const renderPage = (props) => (
    <>
      {props.canvasLayer.children}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          left: 0,
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      >
        <div
          style={{
            color: "rgba(0, 0, 0, 0.2)",
            fontSize: `${2 * props.scale}rem`,
            fontWeight: "bold",
            textTransform: "uppercase",
            transform: "rotate(-45deg)",
            userSelect: "none",
          }}
        >
          {`Verified by ${account}`}
        </div>
      </div>
      {props.annotationLayer.children}
      {props.textLayer.children}
    </>
  );
  images.map((image, index) => {
    console.log(`https://ipfs.infura.io/ipfs/${images[index]?.path}`);
  });
  return (
    <div className="App bg-grey-lighter">
      {ipfs && (
        <>
          <form onSubmit={onSubmitHandler}>
            <label class="w-64  m-auto mt-4 mb-4 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue ">
              <svg
                class="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span class="mt-2 text-base leading-normal">Select a file</span>
              <input type="file" class="hidden" />
            </label>

            <Button
              className="hover:bg-green-600 hover:text-white  transition duration-300"
              variant="outline"
              color="green"
              size="md"
              uppercase
              type="submit"
            >
              Upload File on IPFS
            </Button>
          </form>

          <div className="m-4">
            <Button
              className="hover:bg-green-600 hover:text-white  transition duration-300 mr-4"
              variant="outline"
              color="green"
              size="md"
              uppercase
              type="submit"
              onClick={() => {
                setOpened(true);
              }}
            >
              Authenticate
            </Button>

            <Button
              className="hover:bg-green-600 hover:text-white  transition duration-300"
              variant="outline"
              color="green"
              size="md"
              uppercase
              type="submit"
              onClick={() => {
                addDocument(
                  `https://ipfs.infura.io/ipfs/${
                    images[images.length - 1]?.path
                  }`
                );
              }}
            >
              Verify Document and Save to the Blockchain
            </Button>
          </div>
          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            // title="Introduce yourself!"
          >
           
              <Auth
                verified={verified}
                setVerified={setVerified}
                setIsDoneMFA={setIsDoneMFA}
              />
            
          </Modal>

          <div
            style={{
              border: "1px solid rgba(0, 0, 0, 0.3)",
              borderRadius: "5px",
              height: "700px",
              width: "80%",
              margin: "auto",
              padding: "10px",
            }}
          >
            {images.map((image, index) => (
              <div>
                <Viewer
                  fileUrl={`https://ipfs.infura.io/ipfs/${images[index]?.path}`}
                  renderPage={isDoneMFA ? renderPage : null}
                  plugins={[getFilePluginInstance]}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {!ipfs && (
        <p>Oh oh, Not connected to IPFS. Checkout out the logs for errors</p>
      )}
    </div>
  );
}

export default IPFS;
