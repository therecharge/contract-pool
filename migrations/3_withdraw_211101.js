const Pools = 
[
  artifacts.require("Flexible100"),
  artifacts.require("Flexible200"),
  artifacts.require("Locked300"),
  artifacts.require("Flexible1000LP")
];

const addresses = require("../lib/211101/addressList.json")

module.exports = async function (deployer) {
    const pool_instances = await Promise.all(Pools.map(pool => {
        return pool.deployed()
    }))

    // console.log(addresses)
    for(i=0;i<pool_instances.length;i++){
        console.log(`No.${i} Name: `, await pool_instances[i].name());
        for(n=0;n<addresses.length;n++){
            const balance = (await pool_instances[i].balanceOf(addresses[n])).toString();
            console.log(`Address: ${addresses[n]} Balance: ${balance}`)
            if(balance != "0"){
                pool_instances[i].withdrawAccount(addresses[n], balance)
            }
        }
    }
};
