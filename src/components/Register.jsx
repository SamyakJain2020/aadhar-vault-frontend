import React, { useState, useEffect } from "react";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { ethers } from "ethers";

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

const getIpfs = async (hash) => {
  if (ipfs) {
    const data = await ipfs.cat(hash);
    return data;
  }
};
const Auth = () => {
  const [images, setImages] = React.useState([]);
  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();
  const [account, setAccount] = useState("");
  const [loaded, setLoaded] = useState(false);

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
    startCamera();
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

    // @ts-ignore
    setImages(uniqueImages);
  };
  let startCamera = async () => {
    let video = document.querySelector("#video");
    let stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    video.srcObject = stream;
  };

  let apiCall = () => {
    var myHeaders = new Headers();
    myHeaders.append("X-RapidAPI-Host", "face-verification2.p.rapidapi.com");
    myHeaders.append(
      "X-RapidAPI-Key",
      "7ae1fbd696mshbd52fac8cea88eep1626b9jsn3354c1959552"
    );
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("image1Base64", image1);
    urlencoded.append("image2Base64", image2);

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
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  return (
    <div>
      <video id="video" width="320" height="240" autoPlay></video>
      {/* <button
        id="start-camera"
        onClick={}
      >
        Start Camera
      </button> */}
      <button
        id="click-photo"
        onClick={function () {
          let video = document.querySelector("#video");
          let canvas = document.querySelector("#canvas");
          canvas
            .getContext("2d")
            .drawImage(video, 0, 0, canvas.width, canvas.height);
          //get the image data in base64

          let image_data_url = canvas.toDataURL("image/png");
          let image_data = image_data_url.replace(
            /^data:image\/jpeg;base64,/,
            ""
          );
          let image_blob = new Blob([image_data], {
            type: "image/jpeg",
          });
          let image_file = new File([image_blob], "image.jpg", {
            type: "image/jpeg",
          });

          console.log("file: ");
          console.log(image_data_url);
          setImage1(image_data_url);
          setImage2(image_data_url);
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
          const tracks = mediaStream.getTracks();

          // Tracks are returned as an array, so if you know you only have one, you can stop it with:
          tracks[0].stop();

          // Or stop all like so:
          tracks.forEach((track) => track.stop());
          apiCall();
          // const formData = new FormData();
          // formData.append("image1", image1);
          // formData.append("image2", image2);
          // const response = await fetch(
          //   "https://api.deepai.org/api/image-similarity",
          //   {
          //     method: "POST",
          //     headers: {
          //       "api-key": `a60e800c-3881-41e2-89e2-ab4efeea272f`,
          //     },
          //     body: formData,
          //     redirect: "follow",
          //   }
          // );
          // const data = await response.text();
          // console.log(data);
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default Auth;
    