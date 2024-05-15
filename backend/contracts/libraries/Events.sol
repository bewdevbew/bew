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

    event AirdropClaimed(
        address indexed from,
        address indexed erc20,
        uint256 value
    );
}
