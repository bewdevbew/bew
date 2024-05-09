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

const PROTOCOL_NAME = "ZERODAY";
const PROTOCOL_SYMBOL = "0DAY";

const TOTAL_SUPPLY = ethers.parseEther("200000000");
const RULES = {
  mint: 5,
  legacy: 1,
  revoke: 10,
  governanceToSponsor: 99,
  tokenRequirement: ethers.parseEther("200"),
};

const deployContract = async () => {
  const Factory = await ethers.getContractFactory("TokenReputationFactory");
  const factory = await Factory.deploy();
  const Token = await ethers.getContractFactory("TokenReputation");
  const token = await Token.deploy(
    PROTOCOL_NAME,
    PROTOCOL_SYMBOL,
    TOTAL_SUPPLY,
    RULES.mint,
    RULES.legacy,
    RULES.revoke,
    RULES.governanceToSponsor,
    RULES.tokenRequirement
  );
  await factory.waitForDeployment();
  await token.waitForDeployment();
  return { token, factory };
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

  describe("Deployment", function () {
    it("Should set rules fees", async function () {
      let rules = await token.rules();

      expect(rules.adminLegacyFeePercentage).to.be.equal(RULES.legacy);
      expect(rules.adminMintFeePercentage).to.be.equal(RULES.mint);
      expect(rules.adminRevokeFeePercentage).to.be.equal(RULES.revoke);
      expect(rules.sponsorTokenRequirement).to.be.equal(RULES.tokenRequirement);
    });

    it("Should mint initial supply token", async function () {
      let totalSupply = await token.totalSupply();
      expect(totalSupply).to.be.equal(TOTAL_SUPPLY);
    });
    it("Owner should own initial supply", async function () {
      let balance = await token.balanceOf(await token.owner());
      expect(balance).to.be.equal(TOTAL_SUPPLY);
    });
    it("Should mint supply token to owner", async function () {
      let balance = await token.balanceOf(await token.owner());
      expect(balance).to.be.equal(TOTAL_SUPPLY);
    });
    it("Should set the source owner", async function () {
      expect(await token.source()).to.be.equal(await owner.getAddress());
    });
  });
  describe("Onboard participant", function () {
    let onboardParticipant = async ({
      childSupply = "100",
      participant = addr1,
    }: {
      childSupply?: `${number}`;
      participant?: Signer;
    }) => {
      let tx = await token.onboardParticipant(
        await factory.getAddress(),
        ethers.parseEther(childSupply),
        await participant.getAddress(),
        "ADMIN SECRET"
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

    let childSupply = ethers.parseEther("100");

    it("Should have 0 legacy", async function () {
      expect(await token.legacyLength()).to.be.equal(0);
    });

    it("Should create new token", async function () {
      const tx = await onboardParticipant({});
      expect(await addr1.getAddress()).to.be.equal(tx.to);
      expect(tx.amount == childSupply).to.be.equal(true);
    });
    it("Should send GENESIS TOKEN to new participant", async function () {
      await onboardParticipant({});
      let balance = await token.balanceOf(await addr1.getAddress());
      expect(balance).to.be.equal((childSupply * BigInt(RULES.legacy)) / 100n);
    });
    it("Should send NEW TOKEN to new participant", async function () {
      const { child } = await onboardParticipant({});
      const childToken = await getChildToken(child);
      let balance = await childToken.balanceOf(await addr1.getAddress());

      expect(balance).to.be.equal(
        childSupply - (childSupply * BigInt(RULES.mint)) / 100n
      );
    });
    it("Should send NEW TOKEN to ADMIN GENESIS TOKEN", async function () {
      const { child } = await onboardParticipant({});
      const childToken = await getChildToken(child);
      let balance = await childToken.balanceOf(await owner.getAddress());

      expect(balance).to.be.equal((childSupply * BigInt(RULES.mint)) / 100n);
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
    it("Should engage my token reputation to NETWORK");

    describe("NOT WORKS", function () {
      it("Should revert if token caller wasnt whitelisted");
    });
  });
});
