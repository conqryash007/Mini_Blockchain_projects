const { assert } = require("chai");
const { network, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("./../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async () => {
      let fundMe, deployer;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
        console.log("address :", fundMe.address);
      });

      it("Allows people to fund and borrow", async () => {
        await fundMe.fund({ value: ethers.utils.parseEther("2") });
        await fundMe.withdraw();

        const finalBalance = await fundMe.provider.getBalance(fundMe.address);

        assert.equal(finalBalance.toString(), "0");
      });
    });
