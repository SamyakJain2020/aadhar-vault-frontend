/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

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
      <header className="App-header"></header>
    </div>
  );
}

export default App;
