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
} from "../common";

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

  export type TokenInfoStruct = {
    admin: AddressLike;
    networkToken: AddressLike;
    name: string;
    symbol: string;
    balanceAdmin: BigNumberish;
    balanceNetwork: BigNumberish;
    legacy: BigNumberish;
    totalSupply: BigNumberish;
    rules: DataTypes.AdminRulesStruct;
  };

  export type TokenInfoStructOutput = [
    admin: string,
    networkToken: string,
    name: string,
    symbol: string,
    balanceAdmin: bigint,
    balanceNetwork: bigint,
    legacy: bigint,
    totalSupply: bigint,
    rules: DataTypes.AdminRulesStructOutput
  ] & {
    admin: string;
    networkToken: string;
    name: string;
    symbol: string;
    balanceAdmin: bigint;
    balanceNetwork: bigint;
    legacy: bigint;
    totalSupply: bigint;
    rules: DataTypes.AdminRulesStructOutput;
  };

  export type TokenInteractionStruct = {
    balanceToken: BigNumberish;
    balanceSponsorByAdmin: BigNumberish;
    balanceSponsorByToken: BigNumberish;
    balanceGovernance: BigNumberish;
    balanceAdmin: BigNumberish;
    balanceReputation: BigNumberish;
  };

  export type TokenInteractionStructOutput = [
    balanceToken: bigint,
    balanceSponsorByAdmin: bigint,
    balanceSponsorByToken: bigint,
    balanceGovernance: bigint,
    balanceAdmin: bigint,
    balanceReputation: bigint
  ] & {
    balanceToken: bigint;
    balanceSponsorByAdmin: bigint;
    balanceSponsorByToken: bigint;
    balanceGovernance: bigint;
    balanceAdmin: bigint;
    balanceReputation: bigint;
  };
}

export interface TokenReputationInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "AIRDROP_DELAY"
      | "MAX_SUPPLY"
      | "_depositReputation"
      | "addReserveSponsor"
      | "addReserveSponsorFromFactory"
      | "allowance"
      | "approve"
      | "balanceOf"
      | "baseTokenURI"
      | "claimAirdrop"
      | "dataURI"
      | "decimals"
      | "depositETHOnGovernance"
      | "depositOnGovernance"
      | "depositReputation"
      | "depositReputationFromWallet"
      | "factory"
      | "getInfo"
      | "getInfoInteraction"
      | "isBanned"
      | "lastAirdropClaimed"
      | "legacyLength"
      | "mint"
      | "name"
      | "onboardCustomParticipant"
      | "onboardParticipant"
      | "owner"
      | "poolTokensForGovernance"
      | "poolTokensForSponsor"
      | "poolTokensReputation"
      | "renounceOwnership"
      | "rules"
      | "setDataURI"
      | "setTokenURI"
      | "symbol"
      | "totalSupply"
      | "transfer"
      | "transferFrom"
      | "transferOnPoolReputation"
      | "transferOwnership"
      | "transferReputation"
      | "transferReputationByAdmin"
      | "withdrawReputation"
      | "withdrawReputationFromFactory"
      | "withdrawSponsorshipToken"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Approval"
      | "DepositOnGovernance"
      | "DepositReputation"
      | "DepositSponsorship"
      | "NewTokenOnboarded"
      | "OwnershipTransferred"
      | "Transfer"
      | "WithdrawSponsorship"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "AIRDROP_DELAY",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "MAX_SUPPLY",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "_depositReputation",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "addReserveSponsor",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "addReserveSponsorFromFactory",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "allowance",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "baseTokenURI",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "claimAirdrop",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "dataURI", values?: undefined): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "depositETHOnGovernance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "depositOnGovernance",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositReputation",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositReputationFromWallet",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(functionFragment: "getInfo", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getInfoInteraction",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isBanned",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "lastAirdropClaimed",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "legacyLength",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "mint", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "onboardCustomParticipant",
    values: [AddressLike, BigNumberish, BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "onboardParticipant",
    values: [AddressLike, string, string]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "poolTokensForGovernance",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "poolTokensForSponsor",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "poolTokensReputation",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "rules", values?: undefined): string;
  encodeFunctionData(functionFragment: "setDataURI", values: [string]): string;
  encodeFunctionData(functionFragment: "setTokenURI", values: [string]): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOnPoolReputation",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferReputation",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferReputationByAdmin",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawReputation",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawReputationFromFactory",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawSponsorshipToken",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "AIRDROP_DELAY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "MAX_SUPPLY", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "_depositReputation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addReserveSponsor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addReserveSponsorFromFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "baseTokenURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimAirdrop",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "dataURI", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositETHOnGovernance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositOnGovernance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositReputation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositReputationFromWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getInfo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getInfoInteraction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isBanned", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lastAirdropClaimed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "legacyLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onboardCustomParticipant",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onboardParticipant",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "poolTokensForGovernance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "poolTokensForSponsor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "poolTokensReputation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rules", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setDataURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTokenURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOnPoolReputation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferReputation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferReputationByAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawReputation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawReputationFromFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawSponsorshipToken",
    data: BytesLike
  ): Result;
}

export namespace ApprovalEvent {
  export type InputTuple = [
    owner: AddressLike,
    spender: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [owner: string, spender: string, value: bigint];
  export interface OutputObject {
    owner: string;
    spender: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DepositOnGovernanceEvent {
  export type InputTuple = [
    from: AddressLike,
    erc20: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [from: string, erc20: string, value: bigint];
  export interface OutputObject {
    from: string;
    erc20: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DepositReputationEvent {
  export type InputTuple = [token: AddressLike, value: BigNumberish];
  export type OutputTuple = [token: string, value: bigint];
  export interface OutputObject {
    token: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DepositSponsorshipEvent {
  export type InputTuple = [
    token: AddressLike,
    from: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [token: string, from: string, value: bigint];
  export interface OutputObject {
    token: string;
    from: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
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

export namespace TransferEvent {
  export type InputTuple = [
    from: AddressLike,
    to: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [from: string, to: string, value: bigint];
  export interface OutputObject {
    from: string;
    to: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawSponsorshipEvent {
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

export interface TokenReputation extends BaseContract {
  connect(runner?: ContractRunner | null): TokenReputation;
  waitForDeployment(): Promise<this>;

  interface: TokenReputationInterface;

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

  AIRDROP_DELAY: TypedContractMethod<[], [bigint], "view">;

  MAX_SUPPLY: TypedContractMethod<[], [bigint], "view">;

  _depositReputation: TypedContractMethod<
    [_from: AddressLike, _amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  addReserveSponsor: TypedContractMethod<
    [_erc20: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  addReserveSponsorFromFactory: TypedContractMethod<
    [_for: AddressLike, _erc20: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  allowance: TypedContractMethod<
    [owner: AddressLike, spender: AddressLike],
    [bigint],
    "view"
  >;

  approve: TypedContractMethod<
    [spender: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  balanceOf: TypedContractMethod<[account: AddressLike], [bigint], "view">;

  baseTokenURI: TypedContractMethod<[], [string], "view">;

  claimAirdrop: TypedContractMethod<
    [_erc20: AddressLike],
    [void],
    "nonpayable"
  >;

  dataURI: TypedContractMethod<[], [string], "view">;

  decimals: TypedContractMethod<[], [bigint], "view">;

  depositETHOnGovernance: TypedContractMethod<[], [void], "payable">;

  depositOnGovernance: TypedContractMethod<
    [_erc20: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  depositReputation: TypedContractMethod<
    [_amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  depositReputationFromWallet: TypedContractMethod<
    [_amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  factory: TypedContractMethod<[], [string], "view">;

  getInfo: TypedContractMethod<[], [DataTypes.TokenInfoStructOutput], "view">;

  getInfoInteraction: TypedContractMethod<
    [_token: AddressLike],
    [DataTypes.TokenInteractionStructOutput],
    "view"
  >;

  isBanned: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  lastAirdropClaimed: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [bigint],
    "view"
  >;

  legacyLength: TypedContractMethod<[], [bigint], "view">;

  mint: TypedContractMethod<[_amount: BigNumberish], [void], "nonpayable">;

  name: TypedContractMethod<[], [string], "view">;

  onboardCustomParticipant: TypedContractMethod<
    [
      _for: AddressLike,
      _initialSupply: BigNumberish,
      _maxSupply: BigNumberish,
      _name: string,
      _symbol: string
    ],
    [string],
    "nonpayable"
  >;

  onboardParticipant: TypedContractMethod<
    [_for: AddressLike, _name: string, _symbol: string],
    [string],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  poolTokensForGovernance: TypedContractMethod<
    [arg0: AddressLike],
    [bigint],
    "view"
  >;

  poolTokensForSponsor: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [bigint],
    "view"
  >;

  poolTokensReputation: TypedContractMethod<
    [arg0: AddressLike],
    [bigint],
    "view"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  rules: TypedContractMethod<[], [DataTypes.AdminRulesStructOutput], "view">;

  setDataURI: TypedContractMethod<[_dataURI: string], [void], "nonpayable">;

  setTokenURI: TypedContractMethod<[_tokenURI: string], [void], "nonpayable">;

  symbol: TypedContractMethod<[], [string], "view">;

  totalSupply: TypedContractMethod<[], [bigint], "view">;

  transfer: TypedContractMethod<
    [to: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  transferFrom: TypedContractMethod<
    [from: AddressLike, to: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  transferOnPoolReputation: TypedContractMethod<
    [_toToken: AddressLike, _amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  transferReputation: TypedContractMethod<
    [_from: AddressLike, _amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  transferReputationByAdmin: TypedContractMethod<
    [_token: AddressLike, _to: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  withdrawReputation: TypedContractMethod<
    [_amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  withdrawReputationFromFactory: TypedContractMethod<
    [_token: AddressLike, _toNewNetwork: AddressLike, _amount: BigNumberish],
    [bigint],
    "nonpayable"
  >;

  withdrawSponsorshipToken: TypedContractMethod<
    [_sponsor: AddressLike, _erc20: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "AIRDROP_DELAY"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "MAX_SUPPLY"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "_depositReputation"
  ): TypedContractMethod<
    [_from: AddressLike, _amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "addReserveSponsor"
  ): TypedContractMethod<
    [_erc20: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "addReserveSponsorFromFactory"
  ): TypedContractMethod<
    [_for: AddressLike, _erc20: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "allowance"
  ): TypedContractMethod<
    [owner: AddressLike, spender: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "approve"
  ): TypedContractMethod<
    [spender: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "balanceOf"
  ): TypedContractMethod<[account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "baseTokenURI"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "claimAirdrop"
  ): TypedContractMethod<[_erc20: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "dataURI"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "decimals"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "depositETHOnGovernance"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "depositOnGovernance"
  ): TypedContractMethod<
    [_erc20: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "depositReputation"
  ): TypedContractMethod<[_amount: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "depositReputationFromWallet"
  ): TypedContractMethod<[_amount: BigNumberish], [boolean], "nonpayable">;
  getFunction(
    nameOrSignature: "factory"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getInfo"
  ): TypedContractMethod<[], [DataTypes.TokenInfoStructOutput], "view">;
  getFunction(
    nameOrSignature: "getInfoInteraction"
  ): TypedContractMethod<
    [_token: AddressLike],
    [DataTypes.TokenInteractionStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "isBanned"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "lastAirdropClaimed"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "legacyLength"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "mint"
  ): TypedContractMethod<[_amount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "name"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "onboardCustomParticipant"
  ): TypedContractMethod<
    [
      _for: AddressLike,
      _initialSupply: BigNumberish,
      _maxSupply: BigNumberish,
      _name: string,
      _symbol: string
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "onboardParticipant"
  ): TypedContractMethod<
    [_for: AddressLike, _name: string, _symbol: string],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "poolTokensForGovernance"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "poolTokensForSponsor"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "poolTokensReputation"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "rules"
  ): TypedContractMethod<[], [DataTypes.AdminRulesStructOutput], "view">;
  getFunction(
    nameOrSignature: "setDataURI"
  ): TypedContractMethod<[_dataURI: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setTokenURI"
  ): TypedContractMethod<[_tokenURI: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "symbol"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "totalSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transfer"
  ): TypedContractMethod<
    [to: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferFrom"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOnPoolReputation"
  ): TypedContractMethod<
    [_toToken: AddressLike, _amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferReputation"
  ): TypedContractMethod<
    [_from: AddressLike, _amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferReputationByAdmin"
  ): TypedContractMethod<
    [_token: AddressLike, _to: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdrawReputation"
  ): TypedContractMethod<[_amount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawReputationFromFactory"
  ): TypedContractMethod<
    [_token: AddressLike, _toNewNetwork: AddressLike, _amount: BigNumberish],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdrawSponsorshipToken"
  ): TypedContractMethod<
    [_sponsor: AddressLike, _erc20: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "Approval"
  ): TypedContractEvent<
    ApprovalEvent.InputTuple,
    ApprovalEvent.OutputTuple,
    ApprovalEvent.OutputObject
  >;
  getEvent(
    key: "DepositOnGovernance"
  ): TypedContractEvent<
    DepositOnGovernanceEvent.InputTuple,
    DepositOnGovernanceEvent.OutputTuple,
    DepositOnGovernanceEvent.OutputObject
  >;
  getEvent(
    key: "DepositReputation"
  ): TypedContractEvent<
    DepositReputationEvent.InputTuple,
    DepositReputationEvent.OutputTuple,
    DepositReputationEvent.OutputObject
  >;
  getEvent(
    key: "DepositSponsorship"
  ): TypedContractEvent<
    DepositSponsorshipEvent.InputTuple,
    DepositSponsorshipEvent.OutputTuple,
    DepositSponsorshipEvent.OutputObject
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
  getEvent(
    key: "Transfer"
  ): TypedContractEvent<
    TransferEvent.InputTuple,
    TransferEvent.OutputTuple,
    TransferEvent.OutputObject
  >;
  getEvent(
    key: "WithdrawSponsorship"
  ): TypedContractEvent<
    WithdrawSponsorshipEvent.InputTuple,
    WithdrawSponsorshipEvent.OutputTuple,
    WithdrawSponsorshipEvent.OutputObject
  >;

  filters: {
    "Approval(address,address,uint256)": TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;
    Approval: TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;

    "DepositOnGovernance(address,address,uint256)": TypedContractEvent<
      DepositOnGovernanceEvent.InputTuple,
      DepositOnGovernanceEvent.OutputTuple,
      DepositOnGovernanceEvent.OutputObject
    >;
    DepositOnGovernance: TypedContractEvent<
      DepositOnGovernanceEvent.InputTuple,
      DepositOnGovernanceEvent.OutputTuple,
      DepositOnGovernanceEvent.OutputObject
    >;

    "DepositReputation(address,uint256)": TypedContractEvent<
      DepositReputationEvent.InputTuple,
      DepositReputationEvent.OutputTuple,
      DepositReputationEvent.OutputObject
    >;
    DepositReputation: TypedContractEvent<
      DepositReputationEvent.InputTuple,
      DepositReputationEvent.OutputTuple,
      DepositReputationEvent.OutputObject
    >;

    "DepositSponsorship(address,address,uint256)": TypedContractEvent<
      DepositSponsorshipEvent.InputTuple,
      DepositSponsorshipEvent.OutputTuple,
      DepositSponsorshipEvent.OutputObject
    >;
    DepositSponsorship: TypedContractEvent<
      DepositSponsorshipEvent.InputTuple,
      DepositSponsorshipEvent.OutputTuple,
      DepositSponsorshipEvent.OutputObject
    >;

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

    "Transfer(address,address,uint256)": TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
    Transfer: TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;

    "WithdrawSponsorship(address,address,uint256)": TypedContractEvent<
      WithdrawSponsorshipEvent.InputTuple,
      WithdrawSponsorshipEvent.OutputTuple,
      WithdrawSponsorshipEvent.OutputObject
    >;
    WithdrawSponsorship: TypedContractEvent<
      WithdrawSponsorshipEvent.InputTuple,
      WithdrawSponsorshipEvent.OutputTuple,
      WithdrawSponsorshipEvent.OutputObject
    >;
  };
}
