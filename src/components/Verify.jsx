import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, InputWrapper, Input } from "@mantine/core";
import dCertifyABI from "../artifacts/contracts/Greeter.sol/DCertify.json";
const dCertifyAddress = "0xC5F69dFB40f6755400F600e1c7E3d9D73801253d";


const Verify = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState(false);
  const [signature, setSignature] = useState(false);
  let verifyDocument = async () => {
    setLoading(true);
    let ans = ethers.utils.verifyMessage(link, signature);
    if (ans) {
        setError("");
        setLoading(false);
        setLink(false);
        setSignature(false);
        setCode(ans);
    }
    
  };
  
  return (
    <div className="m-10 p-5">
      <InputWrapper
        id="input-demo"
        required
        label="Document:"
        description="Please enter you Document Link"
        error="Your Document: IPFS LINK"
      >
        <Input
          id="Document"
          placeholder="Document"
          onChange={(e) => setLink(e.target.value)}
            value={link}
        />
      </InputWrapper>
      <InputWrapper
        id="input-demo"
        required
        label="Signature:"
        description="Please enter you Signature"
        error="Your Signature: Start with a capital letter"
      >
        <Input
          id="Signature"
          placeholder="Signature"
          onChange={(e) => setSignature(e.target.value)}
            value={signature}   
        />
      </InputWrapper>
      <Button
        onClick={() => verifyDocument(link)}
        disabled={loading}
        loading={loading}
        type="primary"
        size="large"
        style={{ marginTop: "20px" }}
      >
        Verify
      </Button>
      <div>{error}</div>
        <div>SIGNED BY: {code}</div>
    </div>
  );
};

export default Verify;
