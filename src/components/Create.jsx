import { ethers } from "ethers";
import { useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
const ContractAddress = "";
const Create = () => {
  const [name, setName] = useState({
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
  });
  const [account, setAccount] = useState("");
  // const [image, setImage] = useState("");
  const [loaded, setLoaded] = useState(false);

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

  useEffect(() => checkWalletConnected, []);

  async function getAddresses() {
    setLoaded(true);
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    // let alive = new ethers.Contract(ContractAddress, AliveCore.abi, signer);
    try {
      // let allbands = await alive.returnAllBands();
      let hash = ethers.utils.hashMessage("123123");
      let result = await signer.signMessage("123123");
      console.log("hash: ", hash);
      console.log("resuilt:", result);
      let ans = ethers.utils.verifyMessage("123123", result);
      console.log("asm:", ans);
      setLoaded(false);
    } catch (error) {}
  }

  return (
    <div className="p-10 m-10 ">
      <h2>EIP 712 Example</h2>
      <p>
        Try changing the value stored on <strong>line 51</strong> of App.js.
      </p>
      <div>The stored value is: {name.storageValue}</div>
      <button onClick={getAddresses}> Press to sign </button>
    </div>
  );
};

export default Create;
