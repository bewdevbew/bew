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

type Params = {
  adminRetainedTokensPercentage: number;
  networkParticipationPercentage: number;
  networkToChildAllocationPercentage: number;
};

const maxAdminRetainedTokensPercentage = 49;
const maxNetworkParticipationPercentage = 100;
const maxNetworkToChildAllocationPercentage = 100;

export function calculateRiskNetworkScore({
  adminRetainedTokensPercentage,
  networkParticipationPercentage,
  networkToChildAllocationPercentage,
}: Params): number {
  // Normaliser les valeurs pour être entre 0 et 1
  const normalizedAdminRetainedTokens =
    adminRetainedTokensPercentage / maxAdminRetainedTokensPercentage;
  const normalizedNetworkParticipation =
    networkParticipationPercentage / maxNetworkParticipationPercentage;
  const normalizedNetworkToChildAllocation =
    networkToChildAllocationPercentage / maxNetworkToChildAllocationPercentage;

  // Poids pour chaque paramètre
  const weights: Params = {
    adminRetainedTokensPercentage: -0.5,
    networkParticipationPercentage: 0.25,
    networkToChildAllocationPercentage: 1,
  };

  // Calculer le risque en utilisant les poids et les valeurs normalisées
  const risk =
    100 *
    (weights.adminRetainedTokensPercentage * normalizedAdminRetainedTokens +
      weights.networkParticipationPercentage * normalizedNetworkParticipation +
      weights.networkToChildAllocationPercentage *
        normalizedNetworkToChildAllocation);

  // Limiter la valeur de sortie entre 0 et 100
  return Number(Math.max(0, Math.min(100, risk)).toFixed(2));
}

export const calculateRiskChildScore = ({
  adminRetainedTokensPercentage,
  networkParticipationPercentage,
  networkToChildAllocationPercentage,
}: {
  adminRetainedTokensPercentage: number;
  networkParticipationPercentage: number;
  networkToChildAllocationPercentage: number;
}): number => {
  const normalizedAdminRetainedTokens =
    adminRetainedTokensPercentage / maxAdminRetainedTokensPercentage;
  const normalizedNetworkParticipation =
    networkParticipationPercentage / maxNetworkParticipationPercentage;
  const normalizedNetworkToChildAllocation =
    networkToChildAllocationPercentage / maxNetworkToChildAllocationPercentage;

  // Poids pour chaque paramètre
  const weights: Params = {
    adminRetainedTokensPercentage: 1,
    networkParticipationPercentage: -0.5,
    networkToChildAllocationPercentage: -1,
  };

  // Calculer le risque en utilisant les poids et les valeurs normalisées
  const risk =
    100 *
    (weights.adminRetainedTokensPercentage * normalizedAdminRetainedTokens +
      weights.networkParticipationPercentage * normalizedNetworkParticipation +
      weights.networkToChildAllocationPercentage *
        normalizedNetworkToChildAllocation);
  return Number(Math.max(0, Math.min(100, risk)).toFixed(2));
};

export const calculateDecentralizationScore = ({
  adminRetainedTokensPercentage,
  networkToChildAllocationPercentage,
  networkParticipationPercentage,
}: {
  networkParticipationPercentage: number;
  adminRetainedTokensPercentage: number;
  networkToChildAllocationPercentage: number;
}): number => {
  // Réduire la décentralisation avec les tokens retenus par l'admin et augmenter avec l'allocation du network

  const weights = {
    child: -0.7,
    network: 0.5,
  };

  const normalizedChild = calculateRiskChildScore({
    adminRetainedTokensPercentage,
    networkParticipationPercentage,
    networkToChildAllocationPercentage,
  });

  const normalizedNetwork = calculateRiskNetworkScore({
    adminRetainedTokensPercentage,
    networkParticipationPercentage,
    networkToChildAllocationPercentage,
  });

  const score =
    100 *
    (weights.child * normalizedChild + weights.network * normalizedNetwork);
  // Limiter entre 0 et 100
  return Number(Math.max(0, Math.min(100, score)).toFixed(2));
};

export const calculateOnboardToken = ({
  networkParticipationPercentage,
  networkToChildAllocationPercentage,
  adminRetainedTokensPercentage,
  childSupply,
  networkSupply,
  networkMaxSupply,
}: {
  networkParticipationPercentage: bigint;
  networkToChildAllocationPercentage: bigint;
  adminRetainedTokensPercentage: bigint;
  childSupply: bigint;
  networkSupply: `${number}`;
  networkMaxSupply: bigint;
}) => {
  // Le network mine x% en fonction de la supply du token qu'il crée
  let toNetwork = (childSupply * adminRetainedTokensPercentage) / 100n;
  const networkMintValue =
    (toNetwork * networkToChildAllocationPercentage) / 100n;
  const childToAdmin = (toNetwork * networkParticipationPercentage) / 100n;
  toNetwork -= childToAdmin;

  return {
    networkMint: ethers.formatEther(networkMintValue),
    restNetworkSupply: ethers.formatEther(
      networkMaxSupply - ethers.parseEther(networkSupply) - networkMintValue
    ),
    toNetwork: ethers.formatEther(toNetwork),
    toAdmin: ethers.formatEther(childToAdmin),
    toChildNetwork: ethers.formatEther(childSupply - toNetwork - childToAdmin),
  };
};
