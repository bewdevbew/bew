"use client";
import { useAccount, useWriteContract } from "wagmi";
import {
  TokenReputation,
  TokenReputationFactory,
} from "../../contract/typechain";
import { CONFIG } from "@/config";
import { wagmiConfig } from "@/sections/provider/Web3Provider";
import { Contract, ethers } from "ethers";
import { DataTypes } from "../../contract/typechain/contracts/TokenReputation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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

export const useContract = <C extends keyof ContractType>(contract: C) => {
  const { writeContract, data, error, isError, isPending, ...rest } =
    useWriteContract({
      config: wagmiConfig,
    });

  const abis = CONFIG.abis[contract] as any;
  const address = CONFIG.addresses[contract] as `0x${string}`;

  const post = async (fn: keyof ContractType[C], args: any[]) => {
    const result = await writeContract({
      abi: abis,
      address,
      functionName: fn as string,
      args,
    });

    return result;
  };

  const [isContract, setIsContract] = useState<ContractType[C]>(
    getContract(contract, address)
  );
  return {
    post,
    contract: {
      ...isContract,
      attach: (address: `0x${string}`) =>
        setIsContract(getContract(contract, address)),
    },
  };
};

type TokenInfo = { address: `0x${string}`; info: DataTypes.TokenInfoStruct };

export const getInfoProtocol = async (
  maxLength: number
): Promise<{ length: number; tokens: TokenInfo[] }> => {
  const factory = await getContract("factory");

  const tokensLength = await factory.tokensLength();

  const tokens: { address: `0x${string}`; info: DataTypes.TokenInfoStruct }[] =
    [];

  for (let i = 0; i < Math.min(Number(tokensLength), maxLength); i++) {
    const token = (await factory.tokens(i)) as `0x${string}`;
    const tokenContract = await getContract("token", token);
    const tokenInfo = await tokenContract.getInfo();

    tokens.push({ address: token, info: tokenInfo });
  }

  return { length: Number(tokensLength), tokens };
};

export const useProtocol = ({ maxLength = 10 }: { maxLength?: number }) => {
  return useQuery({
    enabled: true,
    queryKey: ["info-protocol"],
    queryFn: () => getInfoProtocol(maxLength).then((el) => el),
  });
};