const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

describe("SimpleStorage", function () {
  let simpleStorage;
  beforeEach(async function () {
    const simpleStorageFactory = await ethers.getContractFactory(
      "SimpleStorage"
    );
    simpleStorage = await simpleStorageFactory.deploy();
    await simpleStorage.deployed();
  });

  // #1
  it("number should initialise with 0 ", async () => {
    const currNum = await simpleStorage.retrieve();
    assert.equal(currNum.toString(), "0");
  });

  //#2
  it("The update function working ", async () => {
    const expectedNum = 7;
    const newNum = await simpleStorage.store(expectedNum);
    const currNum = await simpleStorage.retrieve();

    assert(currNum.toString(), expectedNum.toString());
  });
});
