import { CONFIG } from "@/config";

import { TokenReputationType } from "@/types/dew/contract";
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

export async function GET(request: NextRequest) {
  const adminAddress = request.nextUrl.searchParams.get("adminAddress");
  const peerAdminAddress = request.nextUrl.searchParams.get("peerAdminAddress");

  try {
    if (!adminAddress || !ethers.isAddress(adminAddress)) {
      throw new Error("Invalid format address. Required to be an EVM address");
    }

    const iFactory = await getContract("factory");
    const tokenAddress = await iFactory.tokenOf(adminAddress as `0x${string}`);
    if (tokenAddress === ethers.ZeroAddress) {
      throw new Error("Token not found.");
    }

    const iToken = await getContract("token", tokenAddress as `0x${string}`);
    const balance = await iToken.balanceOf(tokenAddress);
    const info = await iToken.getInfo();
    const events = await iToken.queryFilter(iToken.filters.NewTokenOnboarded());

    let interaction: TokenReputationType["interaction"] | undefined;

    if (
      ethers.isAddress(peerAdminAddress) &&
      ethers.ZeroAddress !== peerAdminAddress &&
      info.admin !== peerAdminAddress
    ) {
      const peerAddress = await iFactory.tokenOf(peerAdminAddress);
      let iPeerToken = getContract("token", peerAddress as `0x${string}`);

      let peerInteraction = await iPeerToken.getInfoInteraction(tokenAddress);
      let currentInteraction = await iToken.getInfoInteraction(peerAddress);
      interaction = {
        peer: {
          balanceToken: `${ethers.formatEther(peerInteraction.balanceToken)}`,
          balanceSponsorByAdmin: `${ethers.formatEther(
            peerInteraction.balanceSponsorByAdmin
          )}`,
          balanceSponsorByToken: `${ethers.formatEther(
            peerInteraction.balanceSponsorByToken
          )}`,
          balanceGovernance: `${ethers.formatEther(
            peerInteraction.balanceGovernance
          )}`,
          balanceAdmin: `${ethers.formatEther(peerInteraction.balanceAdmin)}`,
          balanceReputation: `${ethers.formatEther(
            peerInteraction.balanceReputation
          )}`,
        } as any,
        current: {
          balanceToken: `${ethers.formatEther(
            currentInteraction.balanceToken
          )}`,
          balanceSponsorByAdmin: `${ethers.formatEther(
            currentInteraction.balanceSponsorByAdmin
          )}`,
          balanceSponsorByToken: `${ethers.formatEther(
            currentInteraction.balanceSponsorByToken
          )}`,
          balanceGovernance: `${ethers.formatEther(
            currentInteraction.balanceGovernance
          )}`,
          balanceAdmin: `${ethers.formatEther(
            currentInteraction.balanceAdmin
          )}`,
          balanceReputation: `${ethers.formatEther(
            currentInteraction.balanceReputation
          )}`,
        } as any,
      };
    }

    const result: TokenReputationType = {
      name: info.name,
      symbol: info.symbol,
      admin: info.admin as `0x${string}`,
      legacy: Number(info.legacy),
      supply: ethers.formatEther(info.totalSupply) as any,
      network: info.networkToken as `0x${string}`,
      balance: ethers.formatEther(balance) as any,
      balanceNetwork: ethers.formatEther(info.balanceNetwork) as any,
      balanceAdmin: ethers.formatEther(info.balanceAdmin) as any,
      address: tokenAddress as `0x${string}`,
      interaction,
      rules: {
        customRules: info.rules.customRules,
        maxSupply: ethers.formatEther(info.rules.maxSupply),
        initialSupply: ethers.formatEther(info.rules.initialSupply),
        sponsorTokenRequirement: ethers.formatEther(
          info.rules.sponsorTokenRequirement
        ),
        adminRetainedTokensPercentage:
          info.rules.adminRetainedTokensPercentage.toString(),
        networkParticipationPercentage:
          info.rules.networkParticipationPercentage.toString(),
        networkToChildAllocationPercentage:
          info.rules.networkToChildAllocationPercentage.toString(),
        adminLegacyFeePercentage:
          info.rules.adminLegacyFeePercentage.toString(),
        adminRevokeFeePercentage:
          info.rules.adminRevokeFeePercentage.toString(),
        governancePercentageToTokensPercentage:
          info.rules.governancePercentageToTokensPercentage.toString(),
      } as any,
      events: {
        newTokenOnboarded: events
          .filter((el, i) => i < 10)
          .map(
            (el) =>
              ({
                to: el.args.to,
                token: el.args.token,
                value: ethers.formatEther(el.args.value),
              } as any)
          ),
      },
    };

    return NextResponse.json(
      {
        message: "OK",
        result: {
          ...result,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error GET token/data", error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
