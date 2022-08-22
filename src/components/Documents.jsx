import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { Modal, Button } from "@mantine/core";

import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";

// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/thumbnail/lib/styles/index.css";

// import dCertifyABI from "../artifacts/contracts/Greeter.sol/DCertify.json";
let dCertifyABI
const dCertifyAddress = "0xC5F69dFB40f6755400F600e1c7E3d9D73801253d";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    getDocuments();
  }, []);
  useEffect(() => {
    console.log(documents);
  }, [documents]);
  let getDocuments = async () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let contract = new ethers.Contract(
      dCertifyAddress,
      dCertifyABI.abi,
      signer
    );
    try {
      let myDocuments = await contract.getAllCertificates();
      // await myDocuments.wait();
      setDocuments(myDocuments);
      console.log("documents set");
      console.log(documents[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const thumbnailInstance = thumbnailPlugin();

  const { Thumbnails } = thumbnailInstance;

  const customRender = (props) => (
    <div key={props.pageIndex} onClick={props.onJumpToPage}>
      {props.renderPageThumbnail}
      <p>{props.renderPageLabel}</p>
    </div>
  );
  return (
    <div>
      <div className="flex flex-col">
        {documents &&
          documents.map((document, index) => {
            const renderPage = (props) => (
              <>
                {props.canvasLayer.children}
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    height: "100%",
                    justifyContent: "center",
                    left: 0,
                    position: "absolute",
                    top: 0,
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      color: "rgba(0, 0, 0, 0.2)",
                      fontSize: `${2 * props.scale}rem`,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      transform: "rotate(-45deg)",
                      userSelect: "none",
                    }}
                  >
                    {`Verified by ${documents[index].owner.slice(0, 6)}...`}
                  </div>
                </div>
                {props.annotationLayer.children}
                {props.textLayer.children}
              </>
            );

            return (
              <div key={index}>
                <h1>{documents[index].document}</h1>
                <h2>Owner:{documents[index].owner}</h2>
                <h2>Signature:{documents[index].signature}</h2>
                <Thumbnails />

                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={`${documents[index]?.document}`}
                    renderPage={renderPage}
                    plugins={[thumbnailInstance]}
                  />
                </Worker>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Documents;
