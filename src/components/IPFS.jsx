import React, { useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import { Group, Text, useMantineTheme, MantineTheme } from "@mantine/core";
import { Upload, Photo, X, Icon as TablerIcon } from "tabler-icons-react";
import { Dropzone, DropzoneStatus, PDF_MIME_TYPE } from "@mantine/dropzone";
// import { useMoralis, useMoralisFile } from "react-moralis";

function getIconColor(status, theme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

function ImageUploadIcon({ status, ...props }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}

// import projectContract from "../interface/projectContract.json"
// const contractAddress = "0x2b33a306F68f208C97d0DbdbE702431b22745377";

// async function startProject() {

//    const provider = new ethers.providers.Web3Provider(window.ethereum);
//    const signer = provider.getSigner();
//     const contract = new ethers.Contract(contractAddress, projectContract.abi, signer);

//     try {
//         let title = document.getElementById("title").value;
//         let desc = document.getElementById("description").value;

//         let amountInEthers = document.getElementById("fundamount").value;
//         let amount = ethers.utils.parseEther(amountInEthers);

//         let time = document.getElementById("time").value;
//         let location = document.getElementById("location").value;

//         // image process upload to ipfs first
//         let img = await uploadImageOnIPFS();
//         console.log(img);

//        // const object = {
//        // 	"title" : "Light POC NFT",
//        // 	"description": "This is a nft which is rewarded for contributing in any project on light",
//        // 	"image": "https://gateway.pinata.cloud/ipfs/QmeuqW1sFYDS1nMWSKszFaM4rkEtGQ7kxsXHGpMARhci5W",
//        //   }
//        // const file = new Moralis.File("file.json", {base64 : btoa(JSON.stringify(object))});
//        // let uri = await file.saveIPFS();
//        // console.log(uri._ipfs);

//        let uri = "https://gateway.pinata.cloud/ipfs/QmUa2KQr7xmuFA9VCMLKbGFDBGwXnEroHxoFNVahs49HtQ";
//        let txn = await contract.startProject(title, desc, time, amount, location, img, uri);
//        let txnreceipt = await txn.wait();
//        console.log(txnreceipt);

//     } catch (e) {

//         alert(e.message)
//       }
// }

export const dropzoneChildren = (status, theme) => (
  <Group
    position="center"
    spacing="xl"
    style={{ minHeight: 220, pointerEvents: "none" }}
  >
    <ImageUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={80}
    />

    <div>
      <Text size="xl" inline>
        Drag images here or click to select files
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        Attach as many files as you like, each file should not exceed 5mb
      </Text>
    </div>
  </Group>
);

const IPFS = () => {
  const [file, setFile] = useState("");
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

//   const { saveFile, moralisFile } = useMoralisFile();

//   const saveFileIPFS = async (f) => {
//     console.log("FILE", f);
//     const fileIpfs = await saveFile(f.name, file, { saveIPFS: true });
//     console.log(fileIpfs);
//   };

//   const handleFinal = () => {
//     saveFileIPFS(file);
//     handleClose();
//   };

  return (
    <>
      <button variant="warning" onClick={handleShow}>
        Upload File
      </button>
      <div>
        <div>
          <form>
            <label>Upload the file</label>
            <input
              type="file"
              placeholder="Upload the file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default IPFS;
