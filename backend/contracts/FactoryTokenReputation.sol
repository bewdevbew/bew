// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import "./TokenReputation.sol";
import "./interfaces/ITokenReputation.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
contract TokenReputationFactory is Ownable {
    constructor() Ownable(msg.sender) {}
    using Strings for uint256;
    function mint(
        address _sponsored,
        string memory _name,
        uint8 _decimals,
        uint256 _initialSupply,
        DataTypes.AdminRules memory _rules
    ) public returns (address) {
        ITokenReputation adminToken = ITokenReputation(msg.sender);
        uint256 id = adminToken.tokensLegacy() + 1;
        string memory symbol = string(
            abi.encodePacked(adminToken.symbol(), id.toString())
        );
        uint participationRateTokens = (_initialSupply *
            _rules.adminLegacyFeePercentage) / 100;

        TokenReputation newToken = new TokenReputation(
            _name,
            symbol,
            _decimals,
            _initialSupply,
            _rules.adminMintFeePercentage,
            _rules.adminLegacyFeePercentage,
            _rules.governancePercentageToTokensPercentage,
            _rules.sponsorTokenRequirement
        );
        newToken.transfer(_sponsored, _initialSupply - participationRateTokens);

        return address(newToken);
    }
}
