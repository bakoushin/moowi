// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.5 <0.9.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import './Spendable.sol';

contract MoowiCards is Ownable, Spendable {
    using SafeMath for uint256;

    address public tokenAddress;

    mapping(bytes32 => uint256) public cards;
    mapping(bytes32 => bool) public discardedCards;

    constructor(
      address _tokenAddress,
      address _spender
    ) {
        tokenAddress = _tokenAddress;
        spender = _spender;
    }

    function addCard(bytes32 hash, uint256 value) public onlyOwner {
        cards[hash] = value;
    }

    function getCardValue(bytes32 hash) public view returns (uint256) {
      if (discardedCards[hash]) {
        return 0;
      }
      return cards[hash];
    }

    function redeemCard(bytes32 hash, address receiver) public onlySpender {
        require(!discardedCards[hash], "Card is discarded");

        uint256 value = cards[hash];
        require(value > 0, "Card does not exist");

        ERC20 token = ERC20(tokenAddress);
        require(token.balanceOf(address(this)) >= value, "Insufficient balance");

        discardedCards[hash] = true;

        token.transfer(receiver, value);
    }

    function discardCard(bytes32 hash) public onlyOwner {
        discardedCards[hash] = true;
    }

    function redeemBalance(address receiver, uint256 value) public onlyOwner {
        ERC20 token = ERC20(tokenAddress);
        require(token.balanceOf(address(this)) >= value, "Insufficient balance");

        token.transfer(receiver, value);
    }

    fallback() external {
        revert();
    }       
}