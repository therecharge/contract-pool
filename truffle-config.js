// const PrivateKeyProvider = require("truffle-privatekey-provider");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");
const privateKey = fs.readFileSync(".secret.main").toString().trim();
// const privateKey = fs.readFileSync(".secret.ih").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard BSC port (default: none)
      network_id: "*", // Any network (default: none)
    },
    testnet: {
      provider: () =>
        new HDWalletProvider(
          [privateKey],
          `https://data-seed-prebsc-1-s1.binance.org:8545`
        ),
      network_id: 97,
      confirms: 1,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    bsc: {
      provider: () =>
        new HDWalletProvider(
          [privateKey],
          "https://bsc-dataseed4.binance.org" //`https://bsc-dataseed4.defibit.io/`
        ),
      network_id: 56,
      timeoutBlocks: 200,
      confirms: 1,
      skipDryRun: true,
      gas: 4500000,
    },
    eth: {
      provider: () =>
        new HDWalletProvider(
          [privateKey],
          `https://mainnet.infura.io/v3/669c080d48f948219728461699c747de`
        ),
      network_id: 1,
      confirms: 1,
      skipDryRun: true,
      gas: 5000000,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.16", // A version or constraint - Ex. "^0.5.0"
    },
  },
};
