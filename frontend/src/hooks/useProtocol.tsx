"use client";
import { getContract } from "@/utils/contract";
import { DataTypes } from "../../contract/typechain/contracts/TokenReputation";
import { useQuery } from "@tanstack/react-query";

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
