const Pools = 
[
  artifacts.require("Flexible100"),
  artifacts.require("Flexible200"),
  artifacts.require("Locked300"),
  artifacts.require("Flexible1000LP")
];

module.exports = function (deployer) {
  Pools.forEach(pool => {
    deployer.deploy(pool);
  })
};
