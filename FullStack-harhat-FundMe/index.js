import { ethers } from "./ethers-5.6.esm.min.js";
import { contractAddress, abi } from "./constants.js";

const connectBtn = document.getElementById("connect");
const fundMe = document.getElementById("fundmebtn");
const balance = document.getElementById("getBalance");
const withdrawBtn = document.getElementById("withdrawBtn");

connectBtn.onclick = connect;
fundMe.onclick = fund;
balance.onclick = getBalance;
withdrawBtn.onclick = withdraw;

async function getBalance() {
  if (window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const x = await provider.getBalance(contractAddress);
    console.log("CONTRACT BALANCE : ", ethers.utils.formatEther(x));
  }
}

async function connect() {
  if (window.ethereum !== undefined) {
    connectBtn.innerText = "Connecting...";
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected!");
    connectBtn.innerText = "Connected";
  } else {
    console.log("Cannot connect to metamask!");
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount} ETH`);

  if (window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenTransaction(transactionResponse, provider);
      console.log("Done");
    } catch (err) {
      console.log(err.message);
    }
  }
}

async function withdraw() {
  if (window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenTransaction(transactionResponse, provider);
      console.log("Done!");
    } catch (err) {
      console.log(err.message);
    }
  }
}

function listenTransaction(transactionResponse, provider) {
  console.log("Mining ", transactionResponse.hash);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Complete with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}
