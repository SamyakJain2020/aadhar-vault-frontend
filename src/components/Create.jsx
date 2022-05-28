import React, { useState, useEffect } from "react";
import { create } from "ipfs-http-client";
import { ethers } from "ethers";
import dCertifyABI from "../artifacts/contracts/Greeter.sol/DCertify.json";

const dCertifyAddress = "0xC5F69dFB40f6755400F600e1c7E3d9D73801253d";
let ipfs;
try {
  ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
  });
} catch (error) {
  console.error("IPFS error ", error);
  ipfs = undefined;
}

const Create = ({ verified, setVerified, setMFADone, updateProfile }) => {
  const [images, setImages] = React.useState([]);
  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();
  const [account, setAccount] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log(image1);
    console.log(image2);
  }, [image1, image2]);

  useEffect(() => {
    console.log(images);
    console.log("length", images.length);
    images.map((image, index) =>
      console.log(`https://ipfs.infura.io/ipfs/${image.path}`)
    );
  }, [images]);

  useEffect(() => {
    checkWalletConnected();
    // startCamera();
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

  async function getIpfs(state, link) {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(link, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        //console.log(result);
        if (state === "image1") {
          setImage1(result);
        } else {
          setImage2(result);
        }
      })
      .then(() => {
        setTimeout(() => {
          apiCall();
        }, 2000);
      })
      .catch((error) => console.log("error", error));
  }

  async function setMFI() {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    console.log("signer", signer);
    setImage2(`https://ipfs.infura.io/ipfs/${images[images.length - 1].path}`);
    let contract = new ethers.Contract(
      dCertifyAddress,
      dCertifyABI.abi,
      signer
    );
    try {
      let Register = await contract.register(account, image2, "True");
      await Register.wait();

      console.log("Registered");
      setMFADone(true);
      await updateProfile();
      let link = await contract.login(account);
      console.log("ipfs link", link);
      await getIpfs("image1", link);
      await getIpfs("image2", image2);
    } catch (error) {
      setError(error);
    }
  }

  const onSubmitHandler = async (image) => {
    const file = image;
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

    await setImages(uniqueImages);
    // setImage2(`https://ipfs.infura.io/ipfs/${images[images.length - 1].path}`);
    setImage2(
      `https://ipfs.infura.io/ipfs/QmPo4pk65YhPjb72S2sVTGgvjFfJxhkkExZEckFaRPWVGB`
    );
  };
  let startCamera = async () => {
    try {
      let video = document.querySelector("#video");
      let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      video.srcObject = stream;
    } catch (error) {
      setError(error);
    }
  };

  let apiCall = () => {
    var myHeaders = new Headers();
    myHeaders.append("X-RapidAPI-Host", "face-verification2.p.rapidapi.com");
    myHeaders.append(
      "X-RapidAPI-Key",
      "e70f2c9198mshaac16bc3dd4f504p168ec3jsn398392c93211"
    );
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("image1Base64", `${image1}`);
    urlencoded.append("image2Base64", `${image2}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(
      "https://face-verification2.p.rapidapi.com/faceverification",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        if (result.similarPercent > 0.75) {
          setVerified(true);
        } else {
          setVerified(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div>
      <video id="video" width="320" height="240" autoPlay></video>
      <button id="start-camera" onClick={startCamera}>
        Start Camera
      </button>
      <button
        id="click-photo"
        onClick={function () {
          let video = document.querySelector("#video");
          let canvas = document.querySelector("#canvas");
          canvas
            .getContext("2d")
            .drawImage(video, 0, 0, canvas.width, canvas.height);

          let image_data_url = canvas.toDataURL("image/png");
          onSubmitHandler(image_data_url);
        }}
      >
        Click Photo
      </button>
      <canvas id="canvas" width="320" height="240"></canvas>
      <button
        type="submit"
        onClick={async (e) => {
          console.log("in fetch");
          e.preventDefault();
          let video = document.querySelector("#video");
          // A video's MediaStream object is available through its srcObject attribute
          const mediaStream = video.srcObject;

          // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
          // const tracks = mediaStream.getTracks();

          // Tracks are returned as an array, so if you know you only have one, you can stop it with:
          // tracks[0].stop();

          // Or stop all like so:
          // tracks.forEach((track) => track.stop());
          setMFI();
        }}
      >
        Submit
      </button>
      <button
        type="submit"
        onClick={async (e) => {
          console.log("in fetch");
          e.preventDefault();
          apiCall();
        }}
      >
        Verify
      </button>
    </div>
  );
};

export default Create;
