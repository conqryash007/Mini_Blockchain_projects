const { run } = require("hardhat");

const verifyContract = async (contractAddress, args) => {
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Vaerified!!!");
    } else {
      console.log(e.message);
    }
  }
};

module.exports = { verifyContract };
