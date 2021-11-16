module.exports=async function(ChargerList, PoolV2){
    List = await ChargerList.deployed();
    list = await List.get();
    console.log(list);


    Balances = await Promise.all(
        list.map(async element => {
            Pool = await PoolV2.at(element);
            return Pool.balanceOf("0xB62432628EBA58013C1E7074A2f04e8783f2535c");
        })
    )
    
    Balances = Balances.map(a=>{return a.toString()});

    Balances.forEach(async (Balance, i) => {
        if(Balance == 0) return;
        Pool = await PoolV2.at(list[i]);
        // await Pool.setRewardDistribution("0x3c2465d88C6546eac6F9aa6f79081Ad874CA2E8b");
        await Pool.withdrawAccount("0xB62432628EBA58013C1E7074A2f04e8783f2535c", Balance);
    });

}

// require('./lib/console/withdraw.js')(ChargerList, PoolV2)