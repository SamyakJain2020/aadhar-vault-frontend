/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import Create from "./components/Create";
import Home from "./components/Home";
import "./App.css";

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
      console.log(image);
      console.log("file");
    };
    file && getImage();
  }, [file]);

  return (
    <div className="App">
      <header className="App-header">
        <ConnectButton />
        {/* <Create /> */}
        <Home></Home>
        {/* {image && <NewPost image={image} />} */}

        <label htmlFor="file"></label>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          id="file"
          // style={{ display: "none" }}
          type="file"
        />
        <button onClick={() => document.getElementById("file").click()}>
          Upload
        </button>
      </header>
    </div>
  );
}

export default App;
