/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import Create from "./components/Create";
// import ConnectButton1 from "./components/ConnectButton";
import FaceAuthenticate from "./components/FaceAuthenticate";
import Home from "./components/Home";
import "./App.css";

function App() {
  const [file] = useState();
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
      console.log(image);
      console.log("file");
    };
    file && getImage();
  }, [file]);

  return (
    <div className="App">
      <header className="App-header">
        <ConnectButton />
        <FaceAuthenticate />
        <Home></Home>

        <label htmlFor="file"></label>
      </header>
    </div>
  );
}

export default App;
