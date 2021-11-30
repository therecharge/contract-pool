const POOL = artifacts.require("PoolV2");
const CHARGER_LIST = artifacts.require("ChargerList");
const POOL_SPEC_LIST = require("../lib/211116/pool.json");

module.exports = async function (deployer, network) {
  const chargerList = await CHARGER_LIST.deployed()
  
  for(let i=0;i<POOL_SPEC_LIST.length;i++){
    const {name, isLocked, isWhitelisted, startTime, DURATION, limit, stakeToken, rewardToken} = POOL_SPEC_LIST[i];
    const charger = await deployer.deploy(POOL, name, isLocked, isWhitelisted, startTime, DURATION, limit, stakeToken, rewardToken);
    console.log(name, charger.address);
    await chargerList.put(charger.address);
  }
};