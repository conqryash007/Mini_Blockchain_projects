const { ethers, run, network } = require("hardhat");

async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await simpleStorageFactory.deploy();

  console.log("Deploying contract...");
  await simpleStorage.deployed();
  console.log(`Contract Deployed on address : ${simpleStorage.address}`);

  // verifing contracts on etherscan

  if (network.config.chainId === 4 && ETHERSCAN_API_KEY) {
    verifyContract(simpleStorage.address, []);
  }

  // Interacting with contract

  const currentValue = await simpleStorage.retrieve();
  console.log(`The Current Value is : ${currentValue}`);

  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`The Updated Value is : ${updatedValue}`);
}

const verifyContract = async (contractAddress, args) => {
  console.log("Verifing...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!!!");
    } else {
      console.log(e.message);
    }
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
