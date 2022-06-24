// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.5 <0.9.0;

import '@openzeppelin/contracts/access/Ownable.sol';

contract Spendable is Ownable {
    address public spender;

    modifier onlySpender() {      
        require(msg.sender == spender, "Only spender can call this function");
        _;
    }

    function setSpender(address _spender) public onlyOwner {
        spender = _spender;
    }
}

