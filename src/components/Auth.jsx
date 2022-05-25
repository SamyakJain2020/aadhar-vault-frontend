import React, { useState, useEffect } from "react";

const Auth = () => {
  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();
  useEffect(() => {
    console.log(image1);
    console.log(image2);
  }, [image1, image2]);
  return (
    <div>
      <video id="video" width="320" height="240" autoPlay></video>
      <button
        id="start-camera"
        onClick={async function () {
          let video = document.querySelector("#video");
          let stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          video.srcObject = stream;
        }}
      >
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
          let image_data_url = canvas.toDataURL("image/jpeg");

          // data url of the image
          console.log(image_data_url);
          setImage1(image_data_url);
          setImage2(image_data_url);
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
          const formData = new FormData();
          formData.append("image1", image1);
          formData.append("image2", image2);
          const response = await fetch(
            "https://api.deepai.org/api/image-similarity",
            {
              method: "POST",
              headers: {
                "api-key": `a60e800c-3881-41e2-89e2-ab4efeea272f`,
              },
              body: formData,
              redirect: "follow",
            }
          );
          const data = await response.text();
          console.log(data);
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default Auth;
