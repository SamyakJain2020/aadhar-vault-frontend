/* eslint-disable react-hooks/rules-of-hooks */

import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NewPost from "./components/NewPost";
 import Canvas from "./components/Canvas";
import { useState, useEffect } from "react";

// async function loadModels() {
//   await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
//   console.log("models loaded");
//   const input = document.getElementById("myCanvas");
//   const ctx = input.getContext("2d");
//   const image = document.getElementById("myImage");
//   const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 128 });
//   const result = await faceapi

//     .detectSingleFace(image, options)
//     .withFaceLandmarks()
//     .withFaceExpressions();
//   console.log(result);
//   const resizedResults = faceapi.resizeResults(result, { width: image.width });
//   faceapi.draw.drawFaceExpressions(input, resizedResults);
// }
function App() {
  const [file, setFile] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    const getImage = () => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage({
          url: img.src,
          width: img.width,
          height: img.height,
        });
      };
    };

    file && getImage();
  }, [file]);

  return (
    <div className="App">
      <header className="App-header">
      <video id="video" width="720" height="560" autoPlay muted></video>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>

        <ConnectButton />
        {/* <NewPost title="Hello world" /> */}
        <div className="flex justify-center flex-col">
        {image ? (
        <NewPost image={image} />
      ) : (
        <div className="newPostCard">
          <div className="addPost">
            <img
              src="https://images.pexels.com/photos/9371782/pexels-photo-9371782.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              
              alt=""
              className="avatar"
              height={200}
            />
            <div className="postForm">
              <input
                type="text"
                placeholder="What's on your mind?"
                className="postInput"
              />
              <label htmlFor="file">
                {/* <img
                  className="addImg"
                  src="https://cdn.icon-icons.com/icons2/564/PNG/512/Add_Image_icon-icons.com_54218.png"
                  alt=""
                />
                <img
                  className="addImg"
                  src="https://icon-library.com/images/maps-icon-png/maps-icon-png-5.jpg"
                  alt=""
                />
                <img
                  className="addImg"
                  src="https://d29fhpw069ctt2.cloudfront.net/icon/image/84451/preview.svg"
                  alt=""
                /> */}
              </label>
                <button>Send</button>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                id="file"
                // style={{ display: "none" }}
                type="file"
              />
            </div>
          </div>
        </div>
      )}
        </div>
      </header>
    </div>
  );
}

export default App;
