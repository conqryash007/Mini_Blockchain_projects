const { getNamedAccounts, ethers } = require("hardhat");

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);

  console.log("Funding...");

  const transaction = await fundMe.fund({
    value: ethers.utils.parseEther("1"),
  });

  await transaction.wait(1);
  console.log("Funded!");

  await fundMe.withdraw();
  console.log("Withdraw all money");
};

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
