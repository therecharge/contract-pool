// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const readline = require("readline");
const async = require("async");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('close', function () {
    console.log('\nBYE BYE !!!');
    process.exit(0);
});

async.waterfall([
    (callback) => {
        rl.question('Enter POOL NAME\n', function (name) {
            const info = require("../info/3.2/" + name + ".js");
            console.log("Pool Info: ", info);
            callback(null, info);
        });
    },
    (info, callback) => {
        console.log("HARDHAT_NETWORK", process.env.HARDHAT_NETWORK.toUpperCase());
        rl.question('Pool and Network correct? (Y/N)"\n', function (answer) {
            let err = null;
            if(answer && answer.toUpperCase() !== "Y") {
                err = new Error("No", "Cancel deploying contract");
            }
            callback(err, info);
        });
    },
    async (info, callback) => {        
        const PoolV2 = await hre.ethers.getContractFactory("PoolV2");
        const poolV2 = await PoolV2.deploy(...info);
        const pool = await poolV2.deployed();
        await pool.setRewardDistribution(
          "0x82C02b9E84eeF14354698AD48dc99Caf5261C568"
        );
        // appove
        // notifyReward
        console.log("PoolV2 deployed to:", pool.address);
    }], (err) => {
        if(err) { return console.log("ERROR", err); }
        rl.close();
});
ㅇ