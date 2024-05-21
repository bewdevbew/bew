// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Events {
    event NewTokenOnboarded(
        address indexed token,
        address indexed to,
        uint256 value
    );

    event DepositOnGovernance(
        address indexed from,
        address indexed erc20,
        uint256 value
    );

    event DepositReputation(address indexed token, uint256 value);

    event AirdropClaimed(
        address indexed from,
        address indexed erc20,
        uint256 value
    );

    event DepositSponsorship(
        address indexed token,
        address indexed from,
        uint256 value
    );

    event WithdrawSponsorship(
        address indexed token,
        address indexed to,
        uint256 value
    );

    event WithdrawReputation(address indexed token, address to, uint256 value);
}
