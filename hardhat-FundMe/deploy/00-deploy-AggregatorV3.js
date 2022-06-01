const { network } = require("hardhat");
const { developmentChains } = require("./../helper-hardhat-config");

const DECIMALS = "8";
const INITIAL_PRICE = "200000000000"; // 2000

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  // console.log("deployer : ", deployer);
  const chainId = network.config.chainId;

  if (developmentChains.includes(network.name)) {
    log("Deploying mocks on local network...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    });
    log("Mocks deployed ....");
    log("------------------------------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
