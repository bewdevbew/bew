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
  name = "ADMIN SECRET",
  caller,
  symbol = "A0DAY",
}: {
  name?: string;
  caller?: Signer;
  token: TokenReputation;
  symbol?: string;
  childSupply?: `${number}`;
  participant: `0x${string}`;
}) => {
  let tx = await token
    .connect(caller)
    .onboardParticipant(
      ethers.parseEther(childSupply),
      participant,
      name,
      symbol
    );

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
