const { ethers, getNamedAccounts, network } = require("hardhat");
const { getWeth, AMOUNT } = require("./getWeth");

const main = async () => {
  const weth = await getWeth();

  const { deployer } = await getNamedAccounts();
  const lendingPool = await getLendingPool(deployer);

  console.log(`The address of lending pool is : ${lendingPool.address}`);

  await approve(weth.address, deployer, lendingPool.address, AMOUNT);

  console.log("Depositing...");
  await lendingPool.deposit(weth.address, AMOUNT, deployer, 0);
  console.log("Depositted!");

  const { availableBorrowsETH } = await getBorrowedUserData(
    lendingPool,
    deployer
  );
  const daiEthPrice = await getDaiEthPriceFeed();

  const daiToBorrow =
    availableBorrowsETH.toString() * 0.95 * (1 / daiEthPrice.toNumber());

  const daiToBorrowWei = ethers.utils.parseEther(String(daiToBorrow));

  await borrowDai(
    lendingPool,
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    daiToBorrowWei,
    1,
    0,
    deployer
  );

  await getBorrowedUserData(lendingPool, deployer);

  await repayDai(
    lendingPool,
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    daiToBorrowWei,
    1,
    deployer
  );

  await getBorrowedUserData(lendingPool, deployer);
};

const getLendingPool = async (account) => {
  const lendingPoolAddressProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
    account
  );

  const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool();

  const lendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress,
    account
  );

  return lendingPool;
};

const approve = async (tokenAddress, owner, spender, value) => {
  const token = await ethers.getContractAt("IERC20", tokenAddress, owner);

  const txRes = await token.approve(spender, value);
  await txRes.wait(1);
  console.log("Approved!");
};

const getBorrowedUserData = async (LendingPool, account) => {
  const {
    totalCollateralETH,
    totalDebtETH,
    availableBorrowsETH,
    currentLiquidationThreshold,
    ltv,
    healthFactor,
  } = await LendingPool.getUserAccountData(account);
  console.log("----res----");
  console.log("totalCollateralETH ", totalCollateralETH.toString());
  console.log("totalDebtETH ", totalDebtETH.toString());
  console.log("availableBorrowsETH ", availableBorrowsETH.toString());
  console.log(
    "currentLiquidationThreshold ",
    currentLiquidationThreshold.toString()
  );
  console.log("ltv ", ltv.toString());
  console.log("healthFactor ", healthFactor.toString());

  return { availableBorrowsETH };
};

const getDaiEthPriceFeed = async () => {
  const aggregatorv3 = await ethers.getContractAt(
    "AggregatorV3Interface",
    "0x773616E4d11A78F511299002da57A0a94577F1f4"
  );

  const { answer } = await aggregatorv3.latestRoundData();

  console.log("DAI / ETH", answer.toString());

  return answer;
};

const borrowDai = async (
  lendingPool,
  asset,
  amount,
  interestRateMode,
  referralCode,
  onBehalfOf
) => {
  const tx = await lendingPool.borrow(
    asset,
    amount,
    interestRateMode,
    referralCode,
    onBehalfOf
  );

  await tx.wait(1);

  console.log("BORROWED!!");
};

const repayDai = async (lendingPool, asset, amount, rateMode, onBehalfOf) => {
  await approve(asset, onBehalfOf, lendingPool.address, amount);

  await lendingPool.repay(asset, amount, rateMode, onBehalfOf);

  console.log("---Repayed!!----");
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
