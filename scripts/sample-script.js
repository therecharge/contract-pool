// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  console.log("HARDHAT_NETWORK", process.env.HARDHAT_NETWORK);
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const PoolV2 = await hre.ethers.getContractFactory("PoolV2");
  // const poolV2 = await PoolV2.deploy(
  //   "1.3 BSC Locked Pool 100", 
  //   true, 
  //   false, 
  //   1641186000,
  //   1 * 60 * 60 * 24 * 28,
  //   0,
  //   "0x2D94172436D869c1e3c094BeaD272508faB0d9E3", 
  //   "0x2D94172436D869c1e3c094BeaD272508faB0d9E3");
  const pool = await PoolV2.at(
    "0xA7ad096Ca2364EaE97F96e836f08dbb2b9b0b70B"
  );

  await pool.setRewardDistribution("0x82C02b9E84eeF14354698AD48dc99Caf5261C568");
  console.log("PoolV2 deployed to:", PoolV2.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
