const POOL = artifacts.require("PoolV2");
const CHARGER_LIST = artifacts.require("ChargerList");
const ETH_POOL_SPEC_LIST = require("../lib/211201/eth.json");
const BSC_POOL_SPEC_LIST = require("../lib/211201/bsc.json");

module.exports = async function (deployer, network) {
  const chargerList = await CHARGER_LIST.deployed();
  const POOL_SPEC_LIST =
    network === "eth" ? ETH_POOL_SPEC_LIST : BSC_POOL_SPEC_LIST;
  console.log("Network", network);
  for (let i = 0; i < POOL_SPEC_LIST.length; i++) {
    const {
      name,
      isLocked,
      isWhitelisted,
      startTime,
      DURATION,
      limit,
      stakeToken,
      rewardToken,
    } = POOL_SPEC_LIST[i];
    const charger = await deployer.deploy(
      POOL,
      name,
      isLocked,
      isWhitelisted,
      startTime,
      DURATION,
      limit,
      stakeToken,
      rewardToken
    );
    console.log(name, charger.address);
    await chargerList.put(charger.address);
  }
};

// build -> test -> deploy(build) -> console
