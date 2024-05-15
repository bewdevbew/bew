import { ethers } from "hardhat";

export const MOOCKS = {
  erc20: {
    name: "ZeroDay",
    symbol: "0DAY",
  },

  rules: {
    customRules: false,
    initialSupply: 1000000n * 10n ** 18n,
    maxSupply: 21000000n * 10n ** 18n,
    adminRetainedTokensPercentage: 5,
    networkParticipationPercentage: 30,
    networkToChildAllocationPercentage: 50,
    adminLegacyFeePercentage: 1,
    adminRevokeFeePercentage: 10,
    governancePercentageToTokensPercentage: 99,
    sponsorTokenRequirement: 200n * 10n ** 18n,
  },
};
