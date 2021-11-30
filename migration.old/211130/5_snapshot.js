const POOL = artifacts.require("PoolV2");
module.exports = async function (deployer, network) {
  const Holders = {
    "0xF38675990F531eb099e6727b3dfFbE1fdB395CC0": [
      "0x0f63514b88d1b5223be7ad275edc170912f7320f",
      "0x2068f907008575dd155255d3c542662d84a62dfa",
      "0x38c97714f86597ba7260aa640453b2c6dcb961e0",
      "0x423c0c95d3f94e8d7655d37caca3da77e6750130",
      "0x4bb4b34f4ded329010fdfaae5d7bd491c4f6f2ad",
      "0x5ebd148f092839b3ef38acfc48eef7df580cebdd",
      "0x61247af7aad30cf1cba25adf1a635a31e33ea04a",
      "0x9b979cda3b41cbd0431363ada92d7f2d3d665051",
      "0xa19665ca7e799cb90c540ff593fc1c73ff8b97fd",
      "0xabc774c1bcd460bd8fcb0624d2f7bc35ee771189",
      "0xb62432628eba58013c1e7074a2f04e8783f2535c",
      "0xd50e812f315ad23e31692316cdb7be4c375e86d2",
      "0xd6cd88f8be233dabd80f6c6a3bf58f191fc8e0f9",
      "0xec4034472cba46605957b4c1296902ece485d665",
    ],
    // "0x8fe435bb891eCf28c01F6a8Cc3ca5C6AdfEFeF90": [
    //   "0x0c435bcdf2af9df9e6a34546e2e6a4c38beee20f",
    //   "0x1a3dc81950ef91661b2f2a1c48ee261b6cb58a91",
    //   "0x2afcee5ac2a0293dca9ae09914ba23abd16a440f",
    //   "0x38c97714f86597ba7260aa640453b2c6dcb961e0",
    //   "0x5791d25eff429b47078d49ea681b3ad57ebe187c",
    //   "0x6a09c1cc35b20f8766117ef1cc3d28b9ef5caccf",
    //   "0x78d0b7dcc663801fe32a291e25b1f0cc987d02d4",
    //   "0x7aa98b668df98f2442e41dbdd5afeb15520e4cec",
    //   "0x87aa07536ff9c00b2088f9adda60ab160524992b",
    //   "0x9c47a3d18b1d27eeaef432df1d6441a2c1bd10fb",
    //   "0x9f10f262053264ba2b06e9c1463aa8066f92a5e9",
    //   "0xa1c1788ef4379f9c69dea2c12998aa34ba1a73aa",
    //   "0xa8b1b971968420c0ba4413bcfd1cc4c87abb3a98",
    //   "0xaed626412c5819ad649211bee83c2967897eec8e",
    //   "0xb0875feaec97640e01186971b7b75b590c3fbee0",
    //   "0xbb7c771178b15e972ddac133d325a792b3c0d080",
    //   "0xc379f830fdf936b30b9c1daaa223e54a54ce1eed",
    //   "0xee844652603f953dc2094d20faeea9b87eeb7f54",
    //   "0xfcad15bf1eb3d4155290f14f740f768ead63ac5b",
    // ],
    // "0xF50585D1B917ED34c9D82d0eEF8C8a40597A294A": [
    //   // "0x4bb4b34f4ded329010fdfaae5d7bd491c4f6f2ad",
    //   "0x5356b6e62112c8d527ca3658feeba765e590aabb",
    // ],
    // "0x7DA22c5d625B9eB40f1F54D440ba826433068C91": [
    //   // "0x3a89dbe32002e68b543b5b683b205bd59aa0ca89",
    //   "0x5356b6e62112c8d527ca3658feeba765e590aabb",
    //   // "0xb62432628eba58013c1e7074a2f04e8783f2535c",
    //   "0xd50e812f315ad23e31692316cdb7be4c375e86d2",
    // ],
  };
  const Chargers = Object.keys(Holders);
  const Balances = await Promise.all(
    Chargers.map(async (charger) => {
      const holders = Holders[charger];
      const Pool = await POOL.at(charger);
      return await Promise.all(
        holders.map(async (holder) => {
          return (await Pool.earned(holder)).toString();
        })
      );
    })
  );
  let Return = {};
  Chargers.forEach(async (charger, i) => {
    Return[charger] = {};
    // const Pool = await POOL.at(charger);
    Balances[i].forEach(async (balance, j) => {
      console.log(charger, Holders[charger][j], balance);
      Return[charger][Holders[charger][j]] = balance;
      // if (balance > 0) await Pool.withdrawAccount(Holders[charger][j], balance);
    });
  });
  console.log(Return);
};
