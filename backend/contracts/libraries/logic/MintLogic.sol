// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {DataTypes} from "../DataTypes.sol";
import {ProtocolConfiguration} from "../configuration/ProtocolConfiguration.sol";
import "../../interfaces/ITokenReputation.sol";
import "../../TokenReputation.sol";
library MintLogic {
    function checkRules(
        DataTypes.AdminRules memory _rules
    ) internal pure returns (bool) {
        require(
            _rules.initialSupply <= ProtocolConfiguration.MAX_SUPPLY / 2,
            "MintLogic: Initial supply must be lower than 50% of MAX_SUPPLY"
        );
        require(
            _rules.initialChildSupply <=
                ProtocolConfiguration.MAX_INITIAL_SUPPLY,
            "MintLogic: Initial child supply must be lower than MAX_INITIAL_SUPPLY"
        );

        require(
            _rules.adminRetainedTokensPercentage <=
                ProtocolConfiguration.MAX_ADMIN_RETAINED_TOKENS_PERCENTAGE,
            "MintLogic: Admin retained tokens percentage must be less than max admin retained tokens percentage"
        );
        require(
            _rules.networkParticipationPercentage <=
                ProtocolConfiguration.MAX_NETWORK_PARTICIPATION_PERCENTAGE,
            "MintLogic: Network participation percentage must be less than max network participation percentage"
        );
        require(
            _rules.adminLegacyFeePercentage <=
                ProtocolConfiguration.MAX_ADMIN_LEGACY_FEE_PERCENTAGE,
            "MintLogic: Admin legacy fee percentage must be less than max admin legacy fee percentage"
        );
        require(
            _rules.adminRevokeFeePercentage <=
                ProtocolConfiguration.MAX_ADMIN_REVOKE_FEE_PERCENTAGE,
            "MintLogic: Admin revoke fee percentage must be less than max admin revoke fee percentage"
        );
        return true;
    }

    function checkMintNetworkCapacity(
        DataTypes.AdminRules memory _childRules,
        ITokenReputation _networkToken
    ) internal view returns (bool) {
        DataTypes.AdminRules memory _networkRules = _networkToken.rules();
        uint mintAmount = (_childRules.initialSupply *
            _networkRules.networkToChildAllocationPercentage) / 100;
        require(
            _networkToken.totalSupply() + mintAmount <= _networkRules.maxSupply
        );
        return true;
    }
}
