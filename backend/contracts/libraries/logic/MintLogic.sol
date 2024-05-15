// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {DataTypes} from "../DataTypes.sol";
import {ProtocolConfiguration} from "../configuration/ProtocolConfiguration.sol";
import {Errors} from "../helpers/Errors.sol";
import "../../interfaces/ITokenReputation.sol";
import "../../TokenReputation.sol";
library MintLogic {
    function checkRules(
        DataTypes.AdminRules memory _rules
    ) internal pure returns (bool) {
        require(
            _rules.initialSupply <= _rules.maxSupply / 2,
            Errors.INVALID_SUPPLY
        );
        require(
            _rules.maxSupply <= ProtocolConfiguration.MAX_SUPPLY,
            Errors.INVALID_SUPPLY
        );
        require(
            _rules.adminRetainedTokensPercentage <=
                ProtocolConfiguration.MAX_ADMIN_RETAINED_TOKENS_PERCENTAGE,
            Errors.INVALID_RETAINED_PERCENTAGE
        );
        require(
            _rules.networkParticipationPercentage <=
                ProtocolConfiguration.MAX_NETWORK_PARTICIPATION_PERCENTAGE,
            Errors.INVALID_NETWORK_PARTICIPATION_PERCENTAGE
        );
        require(
            _rules.adminLegacyFeePercentage <=
                ProtocolConfiguration.MAX_ADMIN_LEGACY_FEE_PERCENTAGE,
            Errors.INVALID_LEGACY_FEE_PERCENTAGE
        );
        require(
            _rules.adminRevokeFeePercentage <=
                ProtocolConfiguration.MAX_ADMIN_REVOKE_FEE_PERCENTAGE,
            Errors.INVALID_REVOKE_FEE_PERCENTAGE
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
