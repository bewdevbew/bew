/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export declare namespace DataTypes {
  export type AdminRulesStruct = {
    customRules: boolean;
    initialSupply: BigNumberish;
    maxSupply: BigNumberish;
    sponsorTokenRequirement: BigNumberish;
    adminRetainedTokensPercentage: BigNumberish;
    networkParticipationPercentage: BigNumberish;
    networkToChildAllocationPercentage: BigNumberish;
    adminLegacyFeePercentage: BigNumberish;
    adminRevokeFeePercentage: BigNumberish;
    governancePercentageToTokensPercentage: BigNumberish;
  };

  export type AdminRulesStructOutput = [
    customRules: boolean,
    initialSupply: bigint,
    maxSupply: bigint,
    sponsorTokenRequirement: bigint,
    adminRetainedTokensPercentage: bigint,
    networkParticipationPercentage: bigint,
    networkToChildAllocationPercentage: bigint,
    adminLegacyFeePercentage: bigint,
    adminRevokeFeePercentage: bigint,
    governancePercentageToTokensPercentage: bigint
  ] & {
    customRules: boolean;
    initialSupply: bigint;
    maxSupply: bigint;
    sponsorTokenRequirement: bigint;
    adminRetainedTokensPercentage: bigint;
    networkParticipationPercentage: bigint;
    networkToChildAllocationPercentage: bigint;
    adminLegacyFeePercentage: bigint;
    adminRevokeFeePercentage: bigint;
    governancePercentageToTokensPercentage: bigint;
  };
}

export interface TokenReputationFactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "GENESIS_NAME"
      | "GENESIS_SYMBOL"
      | "adminOf"
      | "childTokenToNetworkTokens"
      | "genesisToken"
      | "mint"
      | "owner"
      | "particularRules"
      | "renounceOwnership"
      | "rulesOf"
      | "setRules"
      | "standardRules"
      | "tokenOf"
      | "tokens"
      | "tokensLength"
      | "transferOwnership"
      | "transferTokenToAnotherPool"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "NewTokenOnboarded" | "OwnershipTransferred"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "GENESIS_NAME",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "GENESIS_SYMBOL",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "adminOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "childTokenToNetworkTokens",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "genesisToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [AddressLike, string, string]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "particularRules",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rulesOf",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setRules",
    values: [DataTypes.AdminRulesStruct, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "standardRules",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tokenOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "tokens",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokensLength",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferTokenToAnotherPool",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "GENESIS_NAME",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "GENESIS_SYMBOL",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "adminOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "childTokenToNetworkTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "genesisToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "particularRules",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rulesOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setRules", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "standardRules",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokens", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokensLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferTokenToAnotherPool",
    data: BytesLike
  ): Result;
}

export namespace NewTokenOnboardedEvent {
  export type InputTuple = [
    token: AddressLike,
    to: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [token: string, to: string, value: bigint];
  export interface OutputObject {
    token: string;
    to: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface TokenReputationFactory extends BaseContract {
  connect(runner?: ContractRunner | null): TokenReputationFactory;
  waitForDeployment(): Promise<this>;

  interface: TokenReputationFactoryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  GENESIS_NAME: TypedContractMethod<[], [string], "view">;

  GENESIS_SYMBOL: TypedContractMethod<[], [string], "view">;

  adminOf: TypedContractMethod<[arg0: AddressLike], [string], "view">;

  childTokenToNetworkTokens: TypedContractMethod<
    [arg0: AddressLike],
    [string],
    "view"
  >;

  genesisToken: TypedContractMethod<[], [string], "view">;

  mint: TypedContractMethod<
    [_sponsored: AddressLike, _name: string, _symbol: string],
    [string],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  particularRules: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [
      [
        boolean,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint
      ] & {
        customRules: boolean;
        initialSupply: bigint;
        maxSupply: bigint;
        sponsorTokenRequirement: bigint;
        adminRetainedTokensPercentage: bigint;
        networkParticipationPercentage: bigint;
        networkToChildAllocationPercentage: bigint;
        adminLegacyFeePercentage: bigint;
        adminRevokeFeePercentage: bigint;
        governancePercentageToTokensPercentage: bigint;
      }
    ],
    "view"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  rulesOf: TypedContractMethod<
    [_network: AddressLike, _for: AddressLike],
    [DataTypes.AdminRulesStructOutput],
    "view"
  >;

  setRules: TypedContractMethod<
    [_rules: DataTypes.AdminRulesStruct, _sponsored: AddressLike],
    [void],
    "nonpayable"
  >;

  standardRules: TypedContractMethod<
    [],
    [
      [
        boolean,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint
      ] & {
        customRules: boolean;
        initialSupply: bigint;
        maxSupply: bigint;
        sponsorTokenRequirement: bigint;
        adminRetainedTokensPercentage: bigint;
        networkParticipationPercentage: bigint;
        networkToChildAllocationPercentage: bigint;
        adminLegacyFeePercentage: bigint;
        adminRevokeFeePercentage: bigint;
        governancePercentageToTokensPercentage: bigint;
      }
    ],
    "view"
  >;

  tokenOf: TypedContractMethod<[arg0: AddressLike], [string], "view">;

  tokens: TypedContractMethod<[arg0: BigNumberish], [string], "view">;

  tokensLength: TypedContractMethod<[], [bigint], "view">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  transferTokenToAnotherPool: TypedContractMethod<
    [
      _currentPoolNetwork: AddressLike,
      _newPoolNetwork: AddressLike,
      _amount: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "GENESIS_NAME"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "GENESIS_SYMBOL"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "adminOf"
  ): TypedContractMethod<[arg0: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "childTokenToNetworkTokens"
  ): TypedContractMethod<[arg0: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "genesisToken"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "mint"
  ): TypedContractMethod<
    [_sponsored: AddressLike, _name: string, _symbol: string],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "particularRules"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [
      [
        boolean,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint
      ] & {
        customRules: boolean;
        initialSupply: bigint;
        maxSupply: bigint;
        sponsorTokenRequirement: bigint;
        adminRetainedTokensPercentage: bigint;
        networkParticipationPercentage: bigint;
        networkToChildAllocationPercentage: bigint;
        adminLegacyFeePercentage: bigint;
        adminRevokeFeePercentage: bigint;
        governancePercentageToTokensPercentage: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "rulesOf"
  ): TypedContractMethod<
    [_network: AddressLike, _for: AddressLike],
    [DataTypes.AdminRulesStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "setRules"
  ): TypedContractMethod<
    [_rules: DataTypes.AdminRulesStruct, _sponsored: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "standardRules"
  ): TypedContractMethod<
    [],
    [
      [
        boolean,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint
      ] & {
        customRules: boolean;
        initialSupply: bigint;
        maxSupply: bigint;
        sponsorTokenRequirement: bigint;
        adminRetainedTokensPercentage: bigint;
        networkParticipationPercentage: bigint;
        networkToChildAllocationPercentage: bigint;
        adminLegacyFeePercentage: bigint;
        adminRevokeFeePercentage: bigint;
        governancePercentageToTokensPercentage: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "tokenOf"
  ): TypedContractMethod<[arg0: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "tokens"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "tokensLength"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferTokenToAnotherPool"
  ): TypedContractMethod<
    [
      _currentPoolNetwork: AddressLike,
      _newPoolNetwork: AddressLike,
      _amount: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "NewTokenOnboarded"
  ): TypedContractEvent<
    NewTokenOnboardedEvent.InputTuple,
    NewTokenOnboardedEvent.OutputTuple,
    NewTokenOnboardedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;

  filters: {
    "NewTokenOnboarded(address,address,uint256)": TypedContractEvent<
      NewTokenOnboardedEvent.InputTuple,
      NewTokenOnboardedEvent.OutputTuple,
      NewTokenOnboardedEvent.OutputObject
    >;
    NewTokenOnboarded: TypedContractEvent<
      NewTokenOnboardedEvent.InputTuple,
      NewTokenOnboardedEvent.OutputTuple,
      NewTokenOnboardedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
  };
}
