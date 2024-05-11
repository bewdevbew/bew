import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { TokenReputation, TokenReputationFactory } from "../typechain-types";
import { Signer } from "ethers";
import {
  tokensNetworkAllocationToChild,
  tokensRetainedByAdmin,
} from "../utils/unit";
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
      caller,
    });
  };

  describe("Deployment", function () {
    let rules: DataTypes.AdminRulesStruct;
    this.beforeEach(async () => {
      rules = await token.rules();
    });

    describe("TOKEN REPUTATION", () => {
      it("Should allowed factory");
      it("Should length equal 1", async () => {
        expect(await factory.tokensLength()).to.be.equal(1);
      });
      it("Should set ownership to caller", async function () {
        expect(await token.owner()).to.be.equal(await owner.getAddress());
      });

      it("Should have caller has admin", async function () {
        expect(await factory.adminOf(await token.getAddress())).to.be.equal(
          await owner.getAddress()
        );
      });

      it("Should have factory has Network", async () => {
        expect(
          await factory.childTokenToNetworkTokens(await token.getAddress())
        ).to.be.equal(await factory.getAddress());
      });

      it("Should have token has token of admin", async function () {
        expect(await factory.tokenOf(await owner.getAddress())).to.be.equal(
          await token.getAddress()
        );
      });

      it("Should set factory", async function () {
        expect(await token.factory()).to.be.equal(await factory.getAddress());
      });

      it("Should have initial supply - admin retained tokens lock in contract", async () => {
        let reputation = await token.poolTokensReputation(
          await token.getAddress()
        );
        expect(reputation).to.be.equal(
          RULES.initialSupply -
            (RULES.initialSupply *
              BigInt(RULES.adminRetainedTokensPercentage)) /
              100n
        );
      });

      it("Should have 0 legacy", async function () {
        expect(await token.legacyLength()).to.be.equal(0);
      });
    });

    describe("ERC20", () => {
      it("Should mint initial supply", async function () {
        let totalSupply = await token.totalSupply();
        expect(rules.initialSupply).to.be.equal(totalSupply);
        expect(totalSupply).to.be.equal(RULES.initialSupply);
      });

      it("Should set max supply", async function () {
        let maxSupply = await token.MAX_SUPPLY();
        expect(maxSupply).to.be.equal(RULES.maxSupply);
      });
      it("Should contract owned initial supply - admin retained tokens", async () => {
        let balance = await token.balanceOf(await token.getAddress());
        expect(balance).to.be.equal(
          RULES.initialSupply -
            (RULES.initialSupply *
              BigInt(RULES.adminRetainedTokensPercentage)) /
              100n
        );
      });

      it("Should admin owned retained tokens ", async () => {
        let balance = await token.balanceOf(await owner.getAddress());
        expect(balance).to.be.equal(
          (RULES.initialSupply * BigInt(RULES.adminRetainedTokensPercentage)) /
            100n
        );
      });

      it("Should set name", async function () {
        expect(await token.name()).to.be.equal(ERC20.name);
      });

      it("Should set symbol", async function () {
        expect(await token.symbol()).to.be.equal(ERC20.symbol);
      });
    });

    describe("RULES", () => {
      it("Should set the genesis token", async () => {
        expect(await factory.genesisToken()).to.be.equal(
          await token.getAddress()
        );
        expect(await token.getAddress()).to.be.not.equal(ethers.ZeroAddress);
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
    });
  });

  describe("Onboard participant", function () {
    let childToken: TokenReputation;
    let childAdmin: `0x${string}`;
    let childSupply: any;
    this.beforeEach(async () => {
      expect(await factory.tokenOf(await addr1.getAddress())).to.be.equal(
        ethers.ZeroAddress
      );
      const { child, to, amount } = await onboardParticipant({});
      childToken = await getChildToken(child);
      childAdmin = to;
      childSupply = amount;
    });

    it("Should have an address for child token", async function () {
      expect(await childToken.getAddress()).to.not.be.equal(ethers.ZeroAddress);
    });

    it("Should have sponsored has admin", async function () {
      expect(await factory.adminOf(await childToken.getAddress())).to.be.equal(
        childAdmin
      );
    });

    it("Should token have sponsored has admin", async function () {
      expect(await factory.tokenOf(childAdmin)).to.be.equal(
        await childToken.getAddress()
      );
    });

    it("Should have token Network has Network", async function () {
      expect(
        await factory.childTokenToNetworkTokens(await childToken.getAddress())
      ).to.be.equal(await token.getAddress());
    });

    it("Should create CHILD TOKEN", async function () {
      expect(await addr1.getAddress()).to.be.equal(childAdmin);
      expect(childSupply).to.be.equal(await childToken.totalSupply());
    });

    it("Should send NETWORK TOKEN to POOL SPONSOR of CHILD TOKEN", async function () {
      let balanceReputation = await childToken.poolTokensForSponsor(
        await childToken.getAddress(),
        await token.getAddress()
      );
      expect(balanceReputation).to.be.equal(
        tokensNetworkAllocationToChild(childSupply, await token.rules())
      );
    });

    it("Should send CHILD TOKEN to POOL SPONSOR of NETWORK TOKEN", async function () {
      let tokenRetained = tokensRetainedByAdmin(
        childSupply,
        await childToken.rules()
      );
      expect(
        await token.poolTokensForSponsor(
          await token.getAddress(),
          await childToken.getAddress()
        )
      ).to.be.equal(
        (tokenRetained * (await token.rules()).networkParticipationPercentage) /
          100n
      );
    });

    it("Shoud transfer some CHILD TOKEN to ADMIN of NETWORK TOKEN", async function () {
      let tokenRetained = tokensRetainedByAdmin(
        childSupply,
        await childToken.rules()
      );
      expect(
        await childToken.balanceOf(
          await factory.adminOf(await token.getAddress())
        )
      ).to.be.equal(
        tokenRetained -
          (tokenRetained *
            (await token.rules()).networkParticipationPercentage) /
            100n
      );
    });

    it("Should ADMIN of CHILD TOKEN have 0 balance of token", async function () {
      let balance = await childToken.balanceOf(await addr1.getAddress());
      expect(balance).to.be.equal(0);
    });

    it("Should CHILD TOKEN has locked on POOL REPUTATION", async function () {
      let balancePool = await childToken.poolTokensReputation(
        await childToken.getAddress()
      );
      expect(balancePool).to.be.equal(
        childSupply -
          (childSupply * BigInt(RULES.adminRetainedTokensPercentage)) / 100n
      );
    });

    it("Should transfer ownership to new participant", async function () {
      expect(await childToken.owner()).to.be.equal(await addr1.getAddress());
    });

    it("Should increment legacyLength OF NETWORK TOKEN", async function () {
      expect(await token.legacyLength()).to.be.equal(1);
    });

    it("Should work even if admin isn't owner");

    it("Should updated NETWORK TOKEN balance of CHILD TOKEN", async () => {
      let balance = await token.balanceOf(await childToken.getAddress());
      expect(balance).to.be.equal(
        tokensNetworkAllocationToChild(childSupply, await token.rules())
      );
    });

    it("Should updated NETWORK TOKEN balance of NETWORK TOKEN");

    it("Should updated CHILD TOKEN balance of NETWORK TOKEN", async () => {
      let tokenRetained = tokensRetainedByAdmin(
        childSupply,
        await childToken.rules()
      );
      expect(await childToken.balanceOf(await token.getAddress())).to.be.equal(
        (tokenRetained * (await token.rules()).networkParticipationPercentage) /
          100n
      );
    });
    // describe("NOT WORKS", function () {
    //   it("Should revert if caller is not the owner", async function () {
    //     await expect(
    //       token
    //         .connect(randomAddr)
    //         .onboardParticipant(
    //           await factory.getAddress(),
    //           uint256(100),
    //           await addr1.getAddress(),
    //           "ADMIN SECRET"
    //         )
    //     ).to.be.revertedWith(ERRORS.onlyAdmin);
    //   });
    //   it("Should revert if caller is not the admin", async function () {
    //     let balanceAdmin = await token.balanceOf(await owner.getAddress());
    //     await token.transfer(await addr1.getAddress(), balanceAdmin / 2n + 1n);

    //     expect(await token.balanceOf(await owner.getAddress())).to.be.equal(
    //       balanceAdmin / 2n - 1n
    //     );

    //     await expect(
    //       token.onboardParticipant(
    //         await factory.getAddress(),
    //         uint256(100),
    //         await addr1.getAddress(),
    //         "ADMIN SECRET"
    //       )
    //     ).to.be.revertedWith(ERRORS.onlyAdmin);
    //   });
    // });
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
