// SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

interface PoolV2 {
  function earned(address account) external view returns (uint256);
}

contract RewardGiver is Ownable {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  IERC20 public RCG = IERC20(0x2D94172436D869c1e3c094BeaD272508faB0d9E3);
  PoolV2 public POOL = PoolV2(0xF38675990F531eb099e6727b3dfFbE1fdB395CC0); // Flexible pool 100

  mapping(address => uint256) public EarnedSnapshot;
  mapping(address => uint256) public EarnedPaid; // Get Total

  function curve() public returns (uint256) {}

  function earned(address account) public view returns (uint256) {
    // (En - Es) * y + Es - P = earned()
    // y =
    // uint256 En = pool.earned(account);
    // uint256 Es = EarnedSnapshot[account];
    // uint256 P = EarnedPaid[account];
    // uint256 reward = En.sub(Es).div(5).mul(3).add(Es).sub(P);
    return
      POOL
        .earned(account)
        .sub(EarnedSnapshot[account])
        .div(5)
        .mul(3)
        .add(EarnedSnapshot[account])
        .sub(EarnedPaid[account]);
  }

  function getReward(address account) public returns (uint256) {
    uint256 reward = earned(account);
    EarnedPaid[account] += reward;
    RCG.safeTransfer(account, reward);

    return reward;
  }

  function withdraw(address account, uint256 amount) public onlyOwner {
    require(amount > 0, "POOL: Cannot withdraw 0");
    RCG.safeTransfer(account, amount);
  }

  function setSnapshot(address[] memory account, uint256[] memory amount)
    public
    onlyOwner
  {
    require(
      account.length == amount.length,
      "POOL: account.length != amount.length"
    );
    for (uint256 i = 0; i < account.length; i++) {
      EarnedSnapshot[account[i]] = amount[i];
    }
  }

  event Earned(address _receiver, uint256 _amount);
}
