const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();

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
          mnemonic,
          `https://data-seed-prebsc-1-s1.binance.org:8545`
        ),
      network_id: 97,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    bsc: {
      provider: () =>
        new HDWalletProvider([mnemonic], `https://bsc-dataseed.binance.org`),
      network_id: 56,
      timeoutBlocks: 200,
      confrims: 1,
      skipDryRun: true,
      gas: 500000,
    },
    eth: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://mainnet.infura.io/v3/669c080d48f948219728461699c747de`
        ),
      network_id: 1,
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
