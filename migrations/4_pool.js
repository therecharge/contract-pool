const POOL = artifacts.require("PoolV2");
const CHARGER_LIST = artifacts.require("ChargerList");
const ETH_POOL_SPEC_LIST = require("../lib/211201/eth.json");
const BSC_POOL_SPEC_LIST = require("../lib/211201/bsc.json");

module.exports = async function (deployer, network) {
  const pool1 = await POOL.at("0x1EDB1f1625d550D3dF0a3693BA6BbE63d8Faf375");
  const pool2 = await POOL.at("0xEB44E1A48D6Fcc9676c01DB0a9131F137AF4D506");

  pool1.setRewardDistribution("0x82C02b9E84eeF14354698AD48dc99Caf5261C568");
  pool2.setRewardDistribution("0x82C02b9E84eeF14354698AD48dc99Caf5261C568");
};

// build -> test -> deploy(build) -> console
