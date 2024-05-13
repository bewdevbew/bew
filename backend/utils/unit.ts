import { DataTypes } from "../typechain-types/contracts/TokenReputation";
import { MOOCKS } from "./moock";

export const uint256 = (value: number) => BigInt(value * 10 ** 18);

export const tokensRetainedByAdmin = (
  totalSupply: bigint,
  rules?: DataTypes.AdminRulesStruct
) => {
  if (!rules) rules = MOOCKS.rules;
  return (totalSupply * BigInt(rules.adminRetainedTokensPercentage)) / 100n;
};

export const tokensNetworkAllocationToChild = (
  totalSupply: bigint,
  rules?: DataTypes.AdminRulesStruct
) => {
  if (!rules) rules = MOOCKS.rules;
  return (
    (totalSupply * BigInt(rules.networkToChildAllocationPercentage)) / 100n
  );
};

export const tokensNetworkAfterRevokeFee = (
  amount: bigint,
  rules?: DataTypes.AdminRulesStruct
) => {
  if (!rules) rules = MOOCKS.rules;
  return amount - (amount * BigInt(rules.adminRevokeFeePercentage)) / 100n;
};
