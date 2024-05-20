import { DataTypes } from "../../../contract/typechain/contracts/TokenReputation";

export type ContractNameType = "TokenReputation" | "TokenReputationFactory";

export type TokenReputationType = {
  name: string;
  symbol: string;
  legacy: number;
  supply: `${number}`;
  balance: `${number}`;
  network: `0x${string}`;
  address: `0x${string}`;
  rules: DataTypes.AdminRulesStructOutput;
  events: {
    newTokenOnboarded: {
      to: `0x${string}`;
      value: bigint;
      token: `0x${string}`;
    }[];
  };
};
