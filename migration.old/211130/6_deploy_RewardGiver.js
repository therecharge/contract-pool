const RewardGiver = artifacts.require("RewardGiver");

module.exports = function (deployer) {
  deployer.deploy(RewardGiver);
};
