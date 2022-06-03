import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";

const connectBtn = document.getElementById("connect");

const connect = async () => {
  if (window.ethereum !== undefined) {
    connectBtn.innerText = "Connecting...";
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected!");
    connectBtn.innerText = "Connected";
  } else {
    console.log("Cannot connect to metamask!");
  }
};

connectBtn.onclick = connect;
