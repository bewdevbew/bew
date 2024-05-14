// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library ProtocolConfiguration {
    uint256 public constant INITIAL_SUPPLY =                            1000000 * 10 ** 18; // prettier-ignore
    uint256 public constant INITIAL_CHILD_SUPPLY =                      1000 * 10 ** 18; // prettier-ignore
    uint256 public constant SPONSOR_TOKEN_REQUIREMENT =                 200 * 10 ** 18; // prettier-ignore
    uint8 public constant ADMIN_RETAINED_TOKENS_PERCENTAGE =            5; // prettier-ignore
    uint8 public constant NETWORK_PARTICIPATION_PERCENTAGE =            30; // prettier-ignore
    uint8 public constant NETWORK_TO_CHILD_ALLOCATION_PERCENTAGE =      50; // prettier-ignore
    uint8 public constant ADMIN_LEGACY_FEE_PERCENTAGE =                 1; // prettier-ignore
    uint8 public constant ADMIN_REVOKE_FEE_PERCENTAGE =                 10; // prettier-ignore
    uint8 public constant GOVERNANCE_PERCENTAGE_TO_TOKENS_PERCENTAGE =  99; // prettier-ignore
    uint256 public constant MAX_SUPPLY =                                21000000 * 10 ** 18; // prettier-ignore

    /**
     * @notice Rules can be modified by token admin for particular address on his network
     */
    uint256 public constant MAX_INITIAL_SUPPLY =                        10500000 * 10 ** 18; // prettier-ignore
    uint8 public constant MAX_ADMIN_RETAINED_TOKENS_PERCENTAGE =        49; // prettier-ignore
    uint8 public constant MAX_NETWORK_PARTICIPATION_PERCENTAGE =        100; // prettier-ignore
    uint8 public constant MAX_ADMIN_LEGACY_FEE_PERCENTAGE=              49; // prettier-ignore
    uint8 public constant MAX_ADMIN_REVOKE_FEE_PERCENTAGE =             100; // prettier-ignore
}
