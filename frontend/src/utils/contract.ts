import { CONFIG } from "@/config";
import { ethers } from "ethers";
import {
  TokenReputation,
  TokenReputationFactory,
} from "../../contract/typechain";

export type ContractType = {
  token: TokenReputation;
  factory: TokenReputationFactory;
};

export const getContract = <T extends keyof ContractType>(
  contractName: T,
  _address?: `0x${string}`
): ContractType[T] => {
  const provider = new ethers.JsonRpcProvider(CONFIG.provider);
  const abi = CONFIG.abis[contractName];
  const address =
    contractName === "token" && _address
      ? _address
      : CONFIG.addresses[contractName];
  const contract = new ethers.Contract(address, abi, provider);
  return contract as unknown as ContractType[T];
};
