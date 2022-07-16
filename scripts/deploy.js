// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const readline = require("readline");
const async = require("async");

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question('Write down pool name\n', function (name) {
//   console.log("NAME", name);
//   const INFO = require("../info/3.2/" + name + ".js"); //bsc.locked.0.500.js");
//   console.log("Pool Info: ", INFO);
//   rl.close();
// });

// rl.on('close', function () {
//   console.log('\nBYE BYE !!!');
//   process.exit(0);
// });

// return;

const INFO = require("../info/4.7/bsc.locked.50000.js");

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
  const poolV2 = await PoolV2.deploy(...INFO);

  const pool = await poolV2.deployed();
  // 생성자는 Pool 계정 secret.main, 0x3c2465d88C6546eac6F9aa6f79081Ad874CA2E8b
  await pool.setRewardDistribution(
    "0x82C02b9E84eeF14354698AD48dc99Caf5261C568" // hub 계정
  );

  console.log("PoolV2 deployed to:", pool.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
