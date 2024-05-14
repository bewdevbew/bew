/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  ProtocolConfiguration,
  ProtocolConfigurationInterface,
} from "../../../../contracts/libraries/configuration/ProtocolConfiguration";

const _abi = [
  {
    inputs: [],
    name: "ADMIN_LEGACY_FEE_PERCENTAGE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ADMIN_RETAINED_TOKENS_PERCENTAGE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ADMIN_REVOKE_FEE_PERCENTAGE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GOVERNANCE_PERCENTAGE_TO_TOKENS_PERCENTAGE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INITIAL_CHILD_SUPPLY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INITIAL_SUPPLY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_ADMIN_LEGACY_FEE_PERCENTAGE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_ADMIN_RETAINED_TOKENS_PERCENTAGE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_ADMIN_REVOKE_FEE_PERCENTAGE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_INITIAL_SUPPLY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_NETWORK_PARTICIPATION_PERCENTAGE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_SUPPLY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NETWORK_PARTICIPATION_PERCENTAGE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NETWORK_TO_CHILD_ALLOCATION_PERCENTAGE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SPONSOR_TOKEN_REQUIREMENT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6101f461003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100ff5760003560e01c80638954f758116100a1578063c50bf6e411610070578063c50bf6e41461019e578063cc519c09146101a6578063d853e651146101ae578063de8b9774146101b657600080fd5b80638954f7581461017e578063a892bf0b1461018e578063b3790bde14610196578063bc2edfa91461017657600080fd5b8063323fcf43116100dd578063323fcf431461014a57806332cb6b0c146101645780633727e88d1461014a578063670697401461017657600080fd5b806309e64e9a146101045780630c5f83f8146101295780632ff2e9dc14610139575b600080fd5b6101166a08af7623fb67bf1a80000081565b6040519081526020015b60405180910390f35b610116683635c9adc5dea0000081565b61011669d3c21bcecceda100000081565b610152606481565b60405160ff9091168152602001610120565b6101166a115eec47f6cf7e3500000081565b610152603181565b610116680ad78ebc5ac620000081565b610152600a81565b610152600581565b610152606381565b610152603281565b610152600181565b610152601e8156fea264697066735822122021db1bd7d80752219427e3f3e603837b45d8ad1cd988a9d1b1ef3132c88bf2d164736f6c63430008180033";

type ProtocolConfigurationConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ProtocolConfigurationConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ProtocolConfiguration__factory extends ContractFactory {
  constructor(...args: ProtocolConfigurationConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      ProtocolConfiguration & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): ProtocolConfiguration__factory {
    return super.connect(runner) as ProtocolConfiguration__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ProtocolConfigurationInterface {
    return new Interface(_abi) as ProtocolConfigurationInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ProtocolConfiguration {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as ProtocolConfiguration;
  }
}
