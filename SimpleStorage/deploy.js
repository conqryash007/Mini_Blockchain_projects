const ethers = require("ethers");
const fs = require("fs-extra");

require("dotenv").config();

const main = async () => {
  let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // if using encrpted key

  // const encryptedJson = fs.readFileSync("./encryptedKey.json", "utf8");
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );
  // wallet = wallet.connect(provider);

  /////////////////////////////////////

  const abi = fs.readFileSync(
    "./__SimpleStorage_sol_SimpleStorage.abi",
    "utf8"
  );
  const binary = fs.readFileSync(
    "./__SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");

  const contract = await contractFactory.deploy();

  const deploymentReceipt = await contract.deployTransaction.wait(1);

  console.log(`contract deployed to ${contract.address}`);

  // ---- interacting with contract

  let currentFavoriteNumber = await contract.retrieve();
  console.log(`Current Favorite Number: ${currentFavoriteNumber}`);
  console.log("Updating favorite number...");
  let transactionResponse = await contract.store(7);
  let transactionReceipt = await transactionResponse.wait();
  currentFavoriteNumber = await contract.retrieve();
  console.log(`New Favorite Number: ${currentFavoriteNumber}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
