import {
  DataTypes,
  TokenReputation,
} from "../../../contract/typechain/contracts/TokenReputation";

export type ContractNameType = "TokenReputation" | "TokenReputationFactory";

type TokenInteractionType = {
  balanceToken: `${number}`;
  balanceSponsorByAdmin: `${number}`;
  balanceSponsorByToken: `${number}`;
  balanceGovernance: `${number}`;
  balanceAdmin: `${number}`;
  balanceReputation: `${number}`;
};

export type TokenReputationType = {
  name: string;
  symbol: string;
  legacy: number;
  admin: `0x${string}`;
  supply: `${number}`;
  balance: `${number}`;
  network: `0x${string}`;
  balanceNetwork: `${number}`;
  balanceAdmin: `${number}`;
  interaction?: {
    current: TokenInteractionType;
    peer: TokenInteractionType;
  };
  address: `0x${string}`;
  rules: {
    customRules: boolean;
    initialSupply: `${number}`;
    maxSupply: `${number}`;
    sponsorTokenRequirement: `${number}`;
    adminRetainedTokensPercentage: `${number}`;
    networkParticipationPercentage: `${number}`;
    networkToChildAllocationPercentage: `${number}`;
    adminLegacyFeePercentage: `${number}`;
    adminRevokeFeePercentage: `${number}`;
    governancePercentageToTokensPercentage: `${number}`;
  };
  events: {
    newTokenOnboarded: {
      to: `0x${string}`;
      value: bigint;
      token: `0x${string}`;
    }[];
  };
};
