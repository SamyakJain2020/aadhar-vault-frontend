import React, { useState, useEffect } from "react";
import { create } from "ipfs-http-client";
import { ethers } from "ethers";
// import dCertifyABI from "../artifacts/contracts/Greeter.sol/DCertify.json";
import { Button } from "@mantine/core";
// https://rapidapi.com/PresentID/api/face-verification2/
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

const Auth = ({ verified, setVerified, setIsDoneMFA ,setOpened }) => {
  const [images, setImages] = React.useState([]);
  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();
  const [account, setAccount] = useState("");
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    console.log(image1);
    console.log(image2);
  }, [image1, image2]);

  useEffect(() => {
    console.log(error);
  }, [error]);

  useEffect(() => {
    console.log(images);
    console.log("length", images.length);
    images.map((image, index) =>
      console.log(`https://ipfs.infura.io/ipfs/${image.path}`)
    );
  }, [images]);

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
          if (state === "image1") apiCall();
        }, 2000);
      })
      .catch((error) => console.log("error", error));
  }

  async function getMFI() {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(
      dCertifyAddress,
      // dCertifyABI.abi,
      signer
    );
    try {
      let link = await contract.login(account);
      console.log("ipfs link", link);
      await getIpfs("image1", link);
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

    setImages(uniqueImages);
    setLoading(false);
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
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        console.log(result?.data);
        console.log(result.data?.similarPercent);
        if (!result.hasError && result.data.similarPercent > 0.75) {
          console.log("verified");
          window.alert("verified");
          setIsDoneMFA(true);
          setLoading2(false);
          setVerified(true);
          setOpened(false);
          setVisible((v) => !v);
        } else {
          console.log("not verified");
          setLoading1("inBetween");
          setVerified(false);
          setIsDoneMFA(false);
        }
      })
      .catch((error) => console.log("error", error));
  };


  return (
    <div className=" m-auto w-full ">
      <video id="video" width="320" height="240" autoPlay></video>
      <Button
        className="m-2 pt-4 shadow-md bg-green-500 text-white  "
        id="start-camera"
        onClick={startCamera}
      >
        Start Camera
      </Button>
      <Button
        className=" m-2 pt-4 shadow-md bg-green-500 text-white "
        id="click-photo"
        loading={loading}
        onClick={function () {
          let video = document.querySelector("#video");
          let canvas = document.querySelector("#canvas");
          canvas
            .getContext("2d")
            .drawImage(video, 0, 0, canvas.width, canvas.height);
          //get the image data in base64

          let image_data_url = canvas.toDataURL("image/png");
          setLoading(true);
          setImage2(image_data_url);
          // getIpfs("image2","https://ipfs.infura.io/ipfs/QmPo4pk65YhPjb72S2sVTGgvjFfJxhkkExZEckFaRPWVGB");
          onSubmitHandler(image_data_url);
        }}
      >
        Click Photo
      </Button>
      <canvas id="canvas" width="320" height="240"></canvas>
      {loading1 !== "inBetween" && (
        <Button
          className=" shadow-md bg-green-500  text-white"
          type="submit"
          loading={loading1 === "inBetween" ? false : loading1}
          onClick={async (e) => {
            console.log("in fetch");
            e.preventDefault();
            let video = document.querySelector("#video");
            // A video's MediaStream object is available through its srcObject attribute
            const mediaStream = video.srcObject;

            // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
            const tracks = mediaStream.getTracks();
            // Tracks are returned as an array, so if you know you only have one, you can stop it with:
            tracks[0].stop();
            // Or stop all like so:
            tracks.forEach((track) => track.stop());
            setLoading1(true);
            setVisible((v) => !v);
            getMFI();
          }}
        >
          Submit
        </Button>
      )}
    {loading1 === "inBetween" && (
        <Button
          className=" shadow-md bg-green-500  text-white"
          type="submit"
          loading={loading1 === "inBetween" ? false : loading1}
          onClick={async (e) => {
            console.log("in fetch");
            e.preventDefault();
            let video = document.querySelector("#video");
            // A video's MediaStream object is available through its srcObject attribute
            const mediaStream = video.srcObject;

            // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
            const tracks = mediaStream.getTracks();
            // Tracks are returned as an array, so if you know you only have one, you can stop it with:
            tracks[0].stop();
            // Or stop all like so:
            tracks.forEach((track) => track.stop());
            setLoading1(true);
            setVisible((v) => !v);
            getMFI();
          }}
        >
          Confirm Submit
        </Button>
      )}

    </div>
  );
};

export default Auth;
