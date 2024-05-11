import { Signer } from "ethers";
import { TokenReputation, TokenReputationFactory } from "../typechain-types";
import { ethers } from "hardhat";
import { MOOCKS } from "./moock";
import { DataTypes } from "../typechain-types/contracts/TokenReputation";
import { token } from "../typechain-types/factories/@openzeppelin/contracts";

export const onboardParticipant = async ({
  childSupply = "100",
  participant,
  token,
  factory,
  name = "ADMIN SECRET",
  caller,
}: {
  name?: string;
  caller?: Signer;
  token: TokenReputation;
  factory: TokenReputationFactory;
  childSupply?: `${number}`;
  participant: `0x${string}`;
}) => {
  let tx = await token
    .connect(caller)
    .onboardParticipant(
      await factory.getAddress(),
      ethers.parseEther(childSupply),
      participant,
      name
    );

  return;
  const receipt = await tx.wait();
  const filter = token.filters.NewTokenOnboarded();
  const events = await token.queryFilter(
    filter,
    receipt?.blockNumber,
    receipt?.blockNumber
  );

  return {
    to: events[0].args?.to,
    child: events[0].args?.token,
    amount: events[0].args?.value,
  } as {
    to: `0x${string}`;
    child: `0x${string}`;
    amount: BigInt;
  };
};

const { erc20, rules: _rules } = MOOCKS;

export const deployContract = async ({}) => {
  const Factory = await ethers.getContractFactory("TokenReputationFactory");
  const factory = await Factory.deploy();

  await factory.waitForDeployment();
  const Token = await ethers.getContractFactory("TokenReputation");
  const token = (await Token.attach(
    await factory.genesisToken()
  )) as TokenReputation;

  return { token, factory };
};
