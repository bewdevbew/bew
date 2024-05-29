import { CONFIG } from "@/config";

import { TokenBalances, TokenReputationType } from "@/types/dew/contract";
import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import {
  TokenReputation,
  TokenReputationFactory,
} from "../../../../../contract/typechain";

export type ContractType = {
  token: TokenReputation;
  factory: TokenReputationFactory;
};
const getContract = <T extends keyof ContractType>(
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

const getBalances = async <K extends "current" | "guest">({
  type,
  addr1,
  addr2,
}: {
  type: K;
  addr1: `0x${string}`;
  addr2: `0x${string}`;
}): Promise<TokenBalances<K>> => {
  const iFactory = await getContract("factory");
  const guest = {
    guest: addr1,
    current: addr2,
  }[type];
  const current = {
    current: addr1,
    guest: addr2,
  }[type];
  const tokenGuest = (await iFactory.tokenOf(
    { guest, current }[type]
  )) as `0x${string}`;
  const tokenCurrent = (await iFactory.tokenOf(
    { guest, current }[type === "guest" ? "current" : "guest"]
  )) as `0x${string}`;

  if (
    !ethers.isAddress(tokenCurrent) ||
    !ethers.isAddress(tokenGuest) ||
    [tokenCurrent, tokenGuest].includes(ethers.ZeroAddress as any)
  ) {
    throw new Error("Invalid format address. Required to be an EVM address");
  }
  const iGuestToken = await getContract("token", tokenGuest);
  const iToken = await getContract("token", tokenCurrent);
  return {
    type: type,
    address: {
      tokenGuest,
      tokenCurrent,
      current,
      guest,
    },
    sponsor: {
      [type]: {
        personal: ethers.formatEther(
          await iGuestToken.poolTokensForSponsor(tokenGuest, tokenGuest)
        ),
        temporary: ethers.formatEther(
          await iGuestToken.poolTokensForSponsor(tokenCurrent, tokenGuest)
        ),
      },
      [type === "current" ? "guest" : "current"]: {
        personal: ethers.formatEther(
          await iToken.poolTokensForSponsor(tokenGuest, tokenGuest)
        ),
        temporary: ethers.formatEther(
          await iToken.poolTokensForSponsor(tokenCurrent, tokenGuest)
        ),
      },
    },
    wallet: {
      personal: ethers.formatEther(await iGuestToken.balanceOf(guest)),
      temporary: ethers.formatEther(await iGuestToken.balanceOf(current)),
    },
    reputation: {
      personal: ethers.formatEther(
        await iGuestToken.poolTokensReputation(tokenGuest)
      ),
      temporary: ethers.formatEther(
        await iToken.poolTokensReputation(tokenGuest)
      ),
    },
    governance: {
      personal: ethers.formatEther(
        await iGuestToken.poolTokensForGovernance(tokenGuest)
      ),
      temporary: ethers.formatEther(
        await iToken.poolTokensForGovernance(tokenGuest)
      ),
    },
    global: {
      personal: ethers.formatEther(await iGuestToken.balanceOf(tokenGuest)),
      temporary: ethers.formatEther(await iGuestToken.balanceOf(tokenCurrent)),
    },
  } as any;
};

export async function GET(request: NextRequest) {
  const guest = request.nextUrl.searchParams.get("guest") as `0x${string}`;
  const current = request.nextUrl.searchParams.get("current") as `0x${string}`;

  try {
    if (guest === current) {
      throw new Error(`Same address '${guest}'`);
    }
    const balances = {
      guest: await getBalances({ type: "guest", addr1: guest, addr2: current }),
      current: await getBalances({
        type: "current",
        addr1: current,
        addr2: guest,
      }),
    };

    return NextResponse.json(
      {
        message: "OK",
        result: {
          ...balances,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error GET token/visitor", error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
