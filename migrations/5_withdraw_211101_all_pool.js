const ChargerList = artifacts.require("ChargerList");
const Pool = artifacts.require("PoolV1");

const addresses = require("../lib/211101/addressList.json")

module.exports = async function (deployer) {
    const List = await ChargerList.deployed();
    const List_Address = await List.get()

    const pool_instance = await Promise.all(
        List_Address.map(address => {
            return Pool.at(address);
        })
    )

    
    // for(i=0;i<pool_instance.length;i++)
    // console.log("name:", await pool_instance[i].name());

    const names = await Promise.all(
        pool_instance.map(pool =>{
            return pool.name();
        })
    )
    console.log(List_Address);
    console.log(names);

    for(i=0;i<5;i++){
        const balances = await Promise.all(
            addresses.map(address=>{
                return pool_instance[i].balanceOf(address);
            })
        )
        for(n=0;addresses.length;n++){
            console.log(addresses[n]);
            if(!balances[n]) break;
            const balance = balances[n].toString() || "0";
            if(balance!="0") {
                console.log(names[n], addresses[n], balances[n])
                pool_instance[i].withdrawAccount(addresses[n],balances[n])
            }
        }
    }
};
``