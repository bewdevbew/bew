import { ethers } from "ethers";

export const DEW_STANDARD = {
  explorer: {
    adminRetainedTokensPercentage: 10,
    networkParticipationPercentage: 20,
    networkToChildAllocationPercentage: 10,
  },
  centralized: {
    adminRetainedTokensPercentage: 35,
    networkParticipationPercentage: 50,
    networkToChildAllocationPercentage: 10,
  },
  ward: {
    adminRetainedTokensPercentage: 49,
    networkParticipationPercentage: 100,
    networkToChildAllocationPercentage: 100,
  },
  dictator: {
    adminRetainedTokensPercentage: 48,
    networkParticipationPercentage: 1,
    networkToChildAllocationPercentage: 0,
  },
};
