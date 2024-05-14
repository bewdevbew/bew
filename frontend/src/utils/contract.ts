import { CONFIG } from "@/config";
import { ethers } from "ethers";

export const getContract = (
  contractName: "factory" | "token",
  _address?: `0x${string}`
) => {
  const abi = CONFIG.abis[contractName];
  const address =
    contractName === "token" && _address
      ? _address
      : CONFIG.addresses[contractName];
  return new ethers.Contract(address, abi);
};
