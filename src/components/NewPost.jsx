import { useEffect, useRef, useState,useLayoutEffect } from "react";
import * as faceapi from "face-api.js";

const NewPost = ({ image }) => {
  console.log(image);
  const { url, width, height } = image;
  const [faces, setFaces] = useState([]);
  const [friends, setFriends] = useState([]);

  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    console.log("in handleImage ",typeof(faceapi.detectAllFaces));
    const detections = await faceapi.detectAllFaces(
      imgRef.current,
      new faceapi.TinyFaceDetectorOptions()
    );
    setFaces(detections.map((d) => Object.values(d.box)));
  };

  const enter = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 5;
    ctx.strokeStyle = "yellow";
    faces.map((face) => ctx.strokeRect(...face));
  };

  useLayoutEffect(() => {
    const loadModels = () => {
      console.log("loadModels");
      Promise.all([
        // faceapi.nets.ssdMobilenetv1.loadFromDisk("../public/models/"),
        // faceapi.nets.faceLandmark68Net.loadFromDisk("../public/models/"),
        // faceapi.nets.faceExpressionNet.loadFromDisk("../public/models/"),

        // faceapi.nets.ssdMobilenetv1.loadFromUri(
        //   "http://127.0.0.1:5500/public/models/"
        // ),
        // faceapi.nets.faceLandmark68Net.loadFromUri(
        //   "http://127.0.0.1:5500/public/models/"
        // ),
        // faceapi.nets.faceExpressionNet.loadFromUri(
        //   "http://127.0.0.1:5500/public/models/"
        // ),

        faceapi.nets.ssdMobilenetv1.loadFromUri(
          "../public/models/"
        ),
        faceapi.nets.faceLandmark68Net.loadFromUri(
          "../public/models/"
        ),
        faceapi.nets.faceExpressionNet.loadFromUri(
          "../public/models/"
        ),
      ])
        .then(handleImage())
        .catch((e) => console.log(e));
    };

    imgRef.current && loadModels();
  }, []);

  useEffect(() => {
    console.log(faces);
  }, [faces]);

  const addFriend = (e) => {
    setFriends((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  console.log(friends);
  return (
    <div className="container">
      <div className="left" style={{ width, height }}>
        <img ref={imgRef} crossOrigin="anonymous" src={url} alt="" />
        <canvas
          onMouseEnter={enter}
          ref={canvasRef}
          width={width}
          height={height}
        />
        {faces.map((face, i) => (
          <input
            name={`input${i}`}
            style={{ left: face[0], top: face[1] + face[3] + 5 }}
            placeholder="Tag a friend"
            key={i}
            className="friendInput"
            onChange={addFriend}
          />
        ))}
      </div>
      <div className="right">
        <h1>Share your post</h1>
        <input
          type="text"
          placeholder="What's on your mind?"
          className="rightInput"
        />
        {friends && (
          <span className="friends">
            with <span className="name">{Object.values(friends) + " "}</span>
          </span>
        )}
        <button className="rightButton">Send</button>
      </div>
    </div>
  );
};

export default NewPost;
