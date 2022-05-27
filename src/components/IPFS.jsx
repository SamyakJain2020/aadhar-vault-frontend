import React, { useState, useEffect } from "react";
import { create } from "ipfs-http-client";
import { ethers } from "ethers";
import { Viewer } from "@react-pdf-viewer/core";
import { Modal } from "@mantine/core";
import Auth from "./Auth";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import dCertifyABI from "../artifacts/contracts/Greeter.sol/DCertify.json";
import { getFilePlugin } from "@react-pdf-viewer/get-file";
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
    <div className="App">
      {ipfs && (
        <>
          <p>Upload File using IPFS</p>

          <form onSubmit={onSubmitHandler}>
            <input name="file" type="file" />

            <button type="submit">Upload File on IPFS</button>
          </form>
          <button
            onClick={() => {
              if (verified && isDoneMFA) {
                addDocument(
                  `https://ipfs.infura.io/ipfs/${
                    images[images.length - 1]?.path
                  }`
                );
              }
            }}
          >
            {verified
              ? "Verify Document and Save to the Blockchain"
              : "Enable MFA for the SSI Wallet"}
          </button>
          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            // title="Introduce yourself!"
          >
            {!verified ? (
              <Auth
                verified={verified}
                setVerified={setVerified}
                setIsDoneMFA={setIsDoneMFA}
              />
            ) : (
              <button>
                <a href="/home">Do the MFA Please</a>
              </button>
            )}
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
