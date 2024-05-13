// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import {DataTypes} from "../libraries/DataTypes.sol";

interface ITokenReputationFactory {
    function mint(
        address _sponsored,
        string memory _name,
        uint256 _initialSupply,
        DataTypes.AdminRules memory _rules
    ) external returns (address);
}
