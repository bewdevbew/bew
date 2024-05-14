/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  ITokenReputationFactory,
  ITokenReputationFactoryInterface,
} from "../../../contracts/interfaces/ITokenReputationFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "adminOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_childToken",
        type: "address",
      },
    ],
    name: "childTokenToNetworkTokens",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sponsored",
        type: "address",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_network",
        type: "address",
      },
      {
        internalType: "address",
        name: "_for",
        type: "address",
      },
    ],
    name: "rulesOf",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "customRules",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "initialSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "sponsorTokenRequirement",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "adminRetainedTokensPercentage",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "networkParticipationPercentage",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "networkToChildAllocationPercentage",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "adminLegacyFeePercentage",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "adminRevokeFeePercentage",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "governancePercentageToTokensPercentage",
            type: "uint8",
          },
        ],
        internalType: "struct DataTypes.AdminRules",
        name: "rules",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "customRules",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "initialSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "sponsorTokenRequirement",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "adminRetainedTokensPercentage",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "networkParticipationPercentage",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "networkToChildAllocationPercentage",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "adminLegacyFeePercentage",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "adminRevokeFeePercentage",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "governancePercentageToTokensPercentage",
            type: "uint8",
          },
        ],
        internalType: "struct DataTypes.AdminRules",
        name: "_rules",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_sponsored",
        type: "address",
      },
    ],
    name: "setRules",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "tokenOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class ITokenReputationFactory__factory {
  static readonly abi = _abi;
  static createInterface(): ITokenReputationFactoryInterface {
    return new Interface(_abi) as ITokenReputationFactoryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ITokenReputationFactory {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as ITokenReputationFactory;
  }
}
