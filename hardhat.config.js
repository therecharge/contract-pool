require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
const fs = require("fs");
const privateKey = fs.readFileSync(".secret.main").toString().trim();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  // defaultNetwork: "mainnet",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {},
    bsc_test: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [privateKey],
      chargerList: "",
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [privateKey],
      chargerList: "",
    },
    eth: {
      url: "https://mainnet.infura.io/v3/669c080d48f948219728461699c747de",
      chainId: 1,
      gasPrice: 70000000000,
      accounts: [privateKey],
      chargerList: "",
    },
    polygon: {
      chainId: 137,
      url: "https://solitary-red-hill.matic.quiknode.pro/d8f8de3db26950e632fba65be6cbe98043f031d5/",
      accounts: ["08eaa4007f4f9976f80ec9923de8e693a95f25ba1fe9727053352a3c64e474d0"],
      gasPrice: 30000000000,
      apiKey: "EIH4V4N2YS7HKXI3DCKUTV3H687X8P878U"
      // npx hardhat verify --network polygon 0x542Ed8B5378F655C9EF08C88096a1541cd0A15ab --constructor-args args/sandoll.fonter.js
      // npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
  },      
  },
   
  solidity: {
    version: "0.5.16",
    // version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
  etherscan: {
    // EXAMPLE
    // npx hardhat verify --network bsc --constructor-args info/1.3/bsc.locked.100.js 0xA7ad096Ca2364EaE97F96e836f08dbb2b9b0b70B
    
    // THEN LIST ON CONTRACT CHARGER LIST
    // https://etherscan.io/address/0xb6ea0d1c92700b3dc95db19183de95df76994f37#writeContract
    // https://bscscan.com/address/0xf88bf2a6af4255ee9862b1ac8891402f6d0952ec#writeContract
    // apiKey: "Q8JWXRR74VDN9E3BF1857UTDX8HWSBRRYV", //BSCscan
    // apiKey: "YNMXP21Q3WF9RXAKPXM3EP6VDSAYJ8TQ6T", //ETHERscan
    apiKey: "EIH4V4N2YS7HKXI3DCKUTV3H687X8P878U", //ETHERscan
    // apiKey: {
    //   mainnet: "YNMXP21Q3WF9RXAKPXM3EP6VDSAYJ8TQ6T",
    //   //polygon
    //   polygon: "EIH4V4N2YS7HKXI3DCKUTV3H687X8P878U"
    // }        
  // apiKey: ZGPFVHX8A27KGX5CNMCAXWY2R89F5H53CM Protocon    
  },
};
// npx hardhat verify --network bsc --constructor-args info/4.7/bsc.locked.50000.js 0x73eDf7270aDEB120ee60396be4B8493D01A1982b
// npx hardhat verify --network bsc --constructor-args info/4.7/bsc.locked.50000.js 0x73eDf7270aDEB120ee60396be4B8493D01A1982b