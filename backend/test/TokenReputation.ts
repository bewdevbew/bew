import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
import { TokenReputation, TokenReputationFactory } from "../typechain-types";

const deployContract = async () => {
  const Token = await hre.ethers.getContractFactory("TokenReputation");
  const token = await Token.deploy(
    "ZeroDay",
    "0DAY",
    18,
    2000000,
    50,
    10,
    50,
    300
  );
  const Factory = await hre.ethers.getContractFactory("TokenReputationFactory");
  const factory = await Factory.deploy();
  return { token, factory };
};

describe("TokenReputation", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  let token: TokenReputation;
  let factory: TokenReputationFactory;

  this.beforeEach(async () => {
    const [owner, addr1] = await hre.ethers.getSigners();
    let contracts = await deployContract();
    token = contracts.token;
    factory = contracts.factory;
  });

  describe("Deployment", function () {
    it("Should set rules fees", async function () {
      console.log({ contract });
    });

    it("Should set the source owner");
    it("Should create supply token");
    it("Should mint supply token to source");
  });
  describe("Onboard participant", function () {
    it("Should create new token");
    it("Should send GENESIS TOKEN to new participant");
    it("Should send NEW TOKEN to new participant");
    it("Should keep txs fees to new participant");
    it("Should transfer NEW TOKEN ownership to new participant");
    it("Should increment tokensLegacy");

    describe("NOT WORKS", function () {
      it("Should revert if caller is not the owner");
      it("Should revert if caller is not the admin");
    });
  });
  describe("Engage reputation", function () {
    it("Should engage my token reputation to NETWORK");

    describe("NOT WORKS", function () {
      it("Should revert if token caller wasnt whitelisted");
    });
  });
});
