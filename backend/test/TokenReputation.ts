import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { TokenReputation, TokenReputationFactory } from "../typechain-types";
import { Signer } from "ethers";
import { uint256 } from "../utils/unit";
import { ERRORS } from "../utils/error";
import * as ctrl from "../utils/controllers";
import { MOOCKS } from "../utils/moock";
import { DataTypes } from "../typechain-types/contracts/TokenReputation";

const { erc20: ERC20, rules: RULES } = MOOCKS;

const deployContract = async () => {
  return await ctrl.deployContract({});
};

const getChildToken = async (address: `0x${string}`) => {
  const Token = await hre.ethers.getContractFactory("TokenReputation");
  return Token.attach(address) as TokenReputation;
};

describe("TokenReputation", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  let token: TokenReputation;
  let factory: TokenReputationFactory;
  let owner: Signer;
  let addr1: Signer;
  let randomAddr: Signer;
  this.beforeEach(async () => {
    [owner, addr1, randomAddr] = await hre.ethers.getSigners(); // owner == accounts[0] | addr1 == accounts[1] | addr2 == accounts[2]

    let contracts = await deployContract();
    token = contracts.token;
    factory = contracts.factory;
  });

  let onboardParticipant = async ({
    childSupply = "100",
    participant = addr1,
    caller = owner,
  }: {
    childSupply?: `${number}`;
    participant?: Signer;
    caller?: Signer;
  }) => {
    return await ctrl.onboardParticipant({
      childSupply,
      participant: (await participant.getAddress()) as `0x${string}`,
      token,
      factory,
      caller,
    });
  };

  describe.only("Deployment", function () {
    let rules: DataTypes.AdminRulesStruct;
    this.beforeEach(async () => {
      rules = await token.rules();
    });

    it("Should set the genesis token", async () => {
      expect(await factory.genesisToken()).to.be.equal(
        await token.getAddress()
      );
      expect(await token.getAddress()).to.be.not.equal(ethers.ZeroAddress);
    });

    it("Should mint initial supply", async function () {
      let totalSupply = await token.totalSupply();
      expect(rules.initialSupply).to.be.equal(totalSupply);
      expect(totalSupply).to.be.equal(RULES.initialSupply);
    });

    it("Should set max supply", async function () {
      let maxSupply = await token.MAX_SUPPLY();
      expect(maxSupply).to.be.equal(RULES.maxSupply);
    });

    it("Should set admin retained tokens %", async () => {
      let rules = await token.rules();

      expect(rules.adminRetainedTokensPercentage).to.be.equal(
        RULES.adminRetainedTokensPercentage
      );
    });

    it("Should set network participation %", async () => {
      let rules = await token.rules();
      expect(rules.networkParticipationPercentage).to.be.equal(
        RULES.networkParticipationPercentage
      );
    });

    it("Should set network to child allocation %", async () => {
      let rules = await token.rules();
      expect(rules.networkToChildAllocationPercentage).to.be.equal(
        RULES.networkToChildAllocationPercentage
      );
    });

    it("Should set admin legacy fee %", async () => {
      let rules = await token.rules();
      expect(rules.adminLegacyFeePercentage).to.be.equal(
        RULES.adminLegacyFeePercentage
      );
    });

    it("Should set admin revoke fee %", async () => {
      let rules = await token.rules();
      expect(rules.adminRevokeFeePercentage).to.be.equal(
        RULES.adminRevokeFeePercentage
      );
    });

    it("Should set governance to tokens  %", async () => {
      let rules = await token.rules();
      expect(rules.governancePercentageToTokensPercentage).to.be.equal(
        RULES.governancePercentageToTokensPercentage
      );
    });

    it("Should set sponsor token requirement", async () => {
      let rules = await token.rules();
      expect(rules.sponsorTokenRequirement).to.be.equal(
        RULES.sponsorTokenRequirement
      );
    });

    // it("Owner should own initial supply", async function () {
    //   let balance = await token.balanceOf(await token.owner());
    //   expect(balance).to.be.equal(ERC20.totalSupply);
    // });
    // it("Should mint supply token to owner", async function () {
    //   let balance = await token.balanceOf(await token.owner());
    //   expect(balance).to.be.equal(ERC20.totalSupply);
    // });
    it("Should set ownership to caller", async function () {
      expect(await token.owner()).to.be.equal(await owner.getAddress());
    });
  });

  describe("Onboard participant", function () {
    let childSupply = ethers.parseEther("100");

    it("Should have 0 legacy", async function () {
      expect(await token.legacyLength()).to.be.equal(0);
    });

    it("Owner should have total initial supply", async function () {
      let balance = await token.balanceOf(await owner.getAddress());
      expect(balance).to.be.equal(await token.totalSupply());
    });

    it("Should create new token", async function () {
      const tx = await onboardParticipant({});
      expect(await addr1.getAddress()).to.be.equal(tx.to);
      expect(tx.amount == childSupply).to.be.equal(true);
    });
    it("Should send GENESIS TOKEN to new participant", async function () {
      await onboardParticipant({});
      let balance = await token.balanceOf(await addr1.getAddress());
      expect(balance).to.be.equal(
        (childSupply * BigInt(RULES.adminLegacyFeePercentage)) / 100n
      );
    });
    it("Should commit child reputation token to pool tokens reputation", async function () {
      let { child } = await onboardParticipant({});
      let childToken = await getChildToken(child);
      let balancePool = await token.poolTokensReputation(child);
      expect(balancePool).to.be.gt(0);
    });
    it("Should send NEW TOKEN to new participant", async function () {
      const { child } = await onboardParticipant({});
      const childToken = await getChildToken(child);
      let balance = await childToken.balanceOf(await addr1.getAddress());

      expect(balance).to.be.equal(
        childSupply -
          (childSupply * BigInt(RULES.adminRetainedTokensPercentage)) / 100n
      );
    });
    it("Should send NEW TOKEN to ADMIN GENESIS TOKEN", async function () {
      const { child } = await onboardParticipant({});
      const childToken = await getChildToken(child);
      let balance = await childToken.balanceOf(await owner.getAddress());

      expect(balance).to.be.equal(
        (childSupply * BigInt(RULES.adminRetainedTokensPercentage)) / 100n
      );
    });

    it("Should transfer ownership to new participant", async function () {
      const { child } = await onboardParticipant({});
      const childToken = await getChildToken(child);
      expect(await childToken.owner()).to.be.equal(await addr1.getAddress());
    });
    it("Should increment legacyLength", async function () {
      await onboardParticipant({});
      expect(await token.legacyLength()).to.be.equal(1);
    });

    it("Should work even if admin isn't owner", async function () {
      let balanceAdmin = await token.balanceOf(await owner.getAddress());
      await token.transfer(await addr1.getAddress(), balanceAdmin / 2n + 1n);

      expect(await token.balanceOf(await addr1.getAddress())).to.be.equal(
        balanceAdmin / 2n + 1n
      );
      await token
        .connect(addr1)
        .onboardParticipant(
          await factory.getAddress(),
          uint256(100),
          await addr1.getAddress(),
          "ADMIN SECRET"
        );
    });

    describe("NOT WORKS", function () {
      it("Should revert if caller is not the owner", async function () {
        await expect(
          token
            .connect(randomAddr)
            .onboardParticipant(
              await factory.getAddress(),
              uint256(100),
              await addr1.getAddress(),
              "ADMIN SECRET"
            )
        ).to.be.revertedWith(ERRORS.onlyAdmin);
      });
      it("Should revert if caller is not the admin", async function () {
        let balanceAdmin = await token.balanceOf(await owner.getAddress());
        await token.transfer(await addr1.getAddress(), balanceAdmin / 2n + 1n);

        expect(await token.balanceOf(await owner.getAddress())).to.be.equal(
          balanceAdmin / 2n - 1n
        );

        await expect(
          token.onboardParticipant(
            await factory.getAddress(),
            uint256(100),
            await addr1.getAddress(),
            "ADMIN SECRET"
          )
        ).to.be.revertedWith(ERRORS.onlyAdmin);
      });
    });
  });
  describe("Engage reputation", function () {
    let childToken: TokenReputation;

    this.beforeEach(async () => {
      await onboardParticipant({});
      const { child } = await onboardParticipant({});
      childToken = await getChildToken(child);
    });

    it("Should engage CHILD TOKEN to NETWORK TOKEN", async function () {
      let poolToken;
    });

    describe("NOT WORKS", function () {
      it("Should revert if token caller wasnt whitelisted");
    });
  });
});
