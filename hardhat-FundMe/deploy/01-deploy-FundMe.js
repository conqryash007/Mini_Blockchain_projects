const {
  networkConfig,
  developmentChains,
} = require("./../helper-hardhat-config");

const { verifyContract } = require("./../utils/verify");

const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    ethUsdPriceFeedAddress = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdPriceFeedAddress.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const args = [ethUsdPriceFeedAddress];

  const fundMe = await deploy("FundMe", {
    contract: "FundMe",
    log: true,
    from: deployer,
    args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log("---------------------------------------------------------");

  await verifyContract(fundMe.address, args);
};

module.exports.tags = ["all", "fundme"];
