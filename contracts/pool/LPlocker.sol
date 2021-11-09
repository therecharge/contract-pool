// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";


contract LPlocker {

    address public owner;
    IERC20 public lpToken;

    constructor(address _owner, address _lpToken) {
        owner = _owner;
        lpToken = IERC20(_lpToken);
    }

    function deposit(uint256 amount) external {
        require(msg.sender == owner, "You are not an owner");
        lpToken.transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) external {
        require(msg.sender == owner, "You are not an owner");
        lpToken.transfer(msg.sender, amount);
    }    
}