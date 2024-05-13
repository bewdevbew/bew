// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library DataTypes {
    struct Pool {
        uint256 balanceGovernanceTokens; // Total tokens lock on pool governance
        uint256 balanceSponsorTokens; // Total tokens send on pool sponsor
    }

    struct AdminRules {
        bool customRules;
        uint8 adminMintFeePercentage; // 100% Echange 1 token Network vs 1 token Child1n
        uint8 adminLegacyFeePercentage; // 100% Récupère tout les tokens ChildN de Child1n récupéré au moment du mint  // ! Recommandé max 49%
        uint8 adminRevokeFeePercentage;
        uint8 governancePercentageToTokensPercentage; // Nombre de tokens a redistribué de la gouvernance vers les sponsor
        uint256 sponsorTokenRequirement; // Nombre de tokens engagé du Network dans un autre Network pour que celui ci accéde à l'interface ERC721
    }
}
