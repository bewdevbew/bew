// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library DataTypes {
    // TODO Move this to event library
    event NewTokenOnboarded(
        address indexed token,
        address indexed to,
        uint256 value
    );

    struct Pool {
        uint256 balanceGovernanceTokens; // Total tokens lock on pool governance
        uint256 balanceSponsorTokens; // Total tokens send on pool sponsor
    }

    /**
     * @dev Rules was set once in constructor and can't be changed
     * @dev However admin can change the rules for a particular address when he want
     * @param customRules if true, the rules for this address are different from the default rules
     * @param adminRetainedTokensPercentage Percentage of child token sent to admin. The percentage applies to the initial supply of child token
     * @param networkParticipationPercentage Percentage of child token sent to pool token reputation of Network. The percentage applies to child tokens received by the admin at the time of mint.
     * @param adminLegacyFeePercentage Percentage of child1 token sent to pool token reputation of Network. The percentage applies to each reputation token mined by the Network's child token.
     * @param adminRevokeFeePercentage Percentage of token retained by admin when child token admin wishes to revoke participation
     * @param governancePercentageToTokensPercentage Percentage of governance tokens to be distributed to sponsors
     * @param sponsorTokenRequirement Number of tokens required to be locked in the Network to access sponsor functionality
     */
    struct AdminRules {
        bool customRules;
        uint256 initialSupply;
        uint256 maxSupply;
        uint256 sponsorTokenRequirement; // Nombre de tokens engagé du Network dans un autre Network pour que celui ci accéde à l'interface ERC721
        uint8 adminRetainedTokensPercentage; // 100% Echange 1 token Network vs 1 token Child1n
        uint8 networkParticipationPercentage; // 100% Engage tout les token Child1n dans le Network au moment du mint // ! Recommandé max 90%
        uint8 networkToChildAllocationPercentage;
        uint8 adminLegacyFeePercentage; // 100% Récupère tout les tokens ChildN de Child1n récupéré au moment du mint  // ! Recommandé max 49%
        uint8 adminRevokeFeePercentage;
        uint8 governancePercentageToTokensPercentage; // Nombre de tokens a redistribué de la gouvernance vers les sponsor
    }

    struct TokenInfo {
        address admin;
        address networkToken;
        string name;
        string symbol;
        uint256 legacy;
        uint256 totalSupply;
        AdminRules rules;
    }
}
