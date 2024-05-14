import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { TokenReputation, TokenReputationFactory } from "../typechain-types";
import { BigNumberish, Signer } from "ethers";
import {
  tokensNetworkAfterRevokeFee,
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
  return Token.attach(address) as unknown as TokenReputation;
};

describe("TokenReputation", function () {
  let token: TokenReputation;
  let factory: TokenReputationFactory;
  let owner: Signer;
  let addr1: Signer;
  let randomAddr: Signer;
  let randomAddr1: Signer;
  this.beforeEach(async () => {
    [owner, addr1, randomAddr, randomAddr1] = await hre.ethers.getSigners(); // owner == accounts[0] | addr1 == accounts[1] | addr2 == accounts[2]

    let contracts = await deployContract();
    token = contracts.token;
    factory = contracts.factory as any;
  });

  let onboardParticipant = async ({
    participant = addr1,
    caller = owner,
  }: {
    childSupply?: `${number}`;
    participant?: Signer;
    caller?: Signer;
  }) => {
    return await ctrl.onboardParticipant({
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

  describe("Withdraw sponsorship token", function () {
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
      expect(
        await token.poolTokensForSponsor(
          await token.getAddress(),
          await childToken.getAddress()
        )
      ).to.be.gt(0);
    });

    it("Should withdraw sponsorship token by ADMIN TOKEN NETWORK from NETWORK TOKEN", async function () {
      let balanceAdminBefore = await childToken.balanceOf(
        await owner.getAddress()
      );
      let balancePool = await token.poolTokensForSponsor(
        await token.getAddress(),
        await childToken.getAddress()
      );
      await token.withdrawSponsorshipToken(
        await token.getAddress(),
        await childToken.getAddress(),
        balancePool
      );
      let balanceAdminAfter = await childToken.balanceOf(
        await owner.getAddress()
      );
      expect(balanceAdminBefore + balancePool).to.be.equal(balanceAdminAfter);
      expect(balanceAdminBefore).to.be.lt(balanceAdminAfter);
    });

    it("Should update balance of NETWORK contract", async () => {
      let balanceBeforeOfNetwork = await childToken.balanceOf(
        await token.getAddress()
      );
      let balancePool = await token.poolTokensForSponsor(
        await token.getAddress(),
        await childToken.getAddress()
      );
      await token.withdrawSponsorshipToken(
        await token.getAddress(),
        await childToken.getAddress(),
        balancePool
      );

      let balanceAfterOfNetwork = await childToken.balanceOf(
        await token.getAddress()
      );
      expect(balanceBeforeOfNetwork - balancePool).to.be.equal(
        balanceAfterOfNetwork
      );
    });

    it("Should withdraw CHILD TOKEN from NETWORK by ADMIN CHILD TOKEN", async function () {
      let balanceChildAdminBefore = await token.balanceOf(
        await addr1.getAddress()
      );
      let balancePool = await token.poolTokensForSponsor(
        await childToken.getAddress(),
        await token.getAddress()
      );
      await token.withdrawSponsorshipToken(
        await token.getAddress(),
        await childToken.getAddress(),
        balancePool
      );
      let balanceChildAdminAfter = await token.balanceOf(
        await addr1.getAddress()
      );
      expect(balanceChildAdminBefore + balancePool).to.be.equal(
        balanceChildAdminAfter
      );
    });

    describe("NOT WORKS", function () {
      it("Should revert if caller is not the ADMIN of NETWORK or ADMIN of TOKEN", async function () {
        await expect(
          token
            .connect(randomAddr)
            .withdrawSponsorshipToken(
              await token.getAddress(),
              await childToken.getAddress(),
              100
            )
        ).to.be.revertedWith(ERRORS.CALLER_CANT_USE_FUNCTION);
      });

      it("Should revert if token balance is less than amount", async function () {
        let balancePool = await token.poolTokensForSponsor(
          await token.getAddress(),
          await childToken.getAddress()
        );
        await expect(
          token.withdrawSponsorshipToken(
            await token.getAddress(),
            await childToken.getAddress(),
            balancePool + 1n
          )
        ).to.be.revertedWith(ERRORS.INSUFFICIENT_BALANCE);
      });

      it("Should revert if token  wasn't on pool", async () => {
        await expect(
          token.withdrawSponsorshipToken(
            await token.getAddress(),
            "0xD13c7342e1ef687C5ad21b27c2b65D772cAb5C8c",
            100
          )
        ).to.be.revertedWith(ERRORS.INSUFFICIENT_BALANCE);
      });
    });
  });

  describe("Deposit token reputation", function () {
    let childToken: TokenReputation;
    let childAdmin: `0x${string}`;
    let childSupply: any;
    let amount: BigNumberish;

    this.beforeEach(async () => {
      expect(await factory.tokenOf(await addr1.getAddress())).to.be.equal(
        ethers.ZeroAddress
      );
      const { child, to, amount: supply } = await onboardParticipant({});
      childToken = await getChildToken(child);
      childAdmin = to;
      childSupply = supply;
      amount = await childToken.poolTokensReputation(
        await childToken.getAddress()
      );
      expect(await addr1.getAddress()).to.be.equal(
        await factory.adminOf(child)
      );
    });

    it("Should balance of contract token reputation must be greater or equal than amount", async function () {
      expect(
        await childToken.balanceOf(
          await factory.tokenOf(await addr1.getAddress())
        )
      ).to.be.gte(amount);
    });

    it("Should not transfer fees because the caller is the admin of the native token", async function () {
      let balanceOfAdminBefore = await childToken.balanceOf(
        await addr1.getAddress()
      );
      await factory
        .connect(addr1)
        .transferTokenToAnotherPool(
          await factory.tokenOf(await addr1.getAddress()),
          await token.getAddress(),
          amount
        );

      expect(await childToken.balanceOf(await addr1.getAddress())).to.be.equal(
        balanceOfAdminBefore
      );
    });
    // TODO les tokens sont pour l'instant bloqué dans la pool sponsor
    it(
      "Should transfer fees because the caller is not the admin of the native token"
      // async function () {
      //   let balanceOfAdminBefore = await token.balanceOf(
      //     await addr1.getAddress()
      //   );
      //   let rules = await token.rules();
      //   await factory.transferTokenToAnotherPool(
      //     await factory.tokenOf(await addr1.getAddress()),
      //     await token.getAddress(),
      //     amount
      //   );

      //   expect(
      //     balanceOfAdminBefore +
      //       (BigInt(amount) * BigInt(rules.adminRevokeFeePercentage)) / 100n
      //   ).to.be.equal(await token.balanceOf(await addr1.getAddress()));
      // }
    );

    it("Should reduced balance of ORIGIN NETWORK", async () => {
      let balanceBefore = await childToken.balanceOf(
        await childToken.getAddress()
      );
      await factory
        .connect(addr1)
        .transferTokenToAnotherPool(
          await factory.tokenOf(await addr1.getAddress()),
          await token.getAddress(),
          amount
        );
      let balanceAfter = await childToken.balanceOf(
        await childToken.getAddress()
      );
      expect(balanceBefore - BigInt(amount)).to.be.equal(balanceAfter);
    });

    it("Should deposit TOKEN reputation by ADMIN ORIGIN TOKEN on NETWORK TOKEN", async function () {
      let balanceTokenBefore = await childToken.balanceOf(
        await token.getAddress()
      );
      await factory
        .connect(addr1)
        .transferTokenToAnotherPool(
          await factory.tokenOf(await addr1.getAddress()),
          await token.getAddress(),
          amount
        );
      let balanceTokenAfter = await childToken.balanceOf(
        await token.getAddress()
      );

      expect(balanceTokenBefore + BigInt(amount)).to.be.equal(
        balanceTokenAfter
      );
    });

    it("Should increase NEW POOL REPUTATION of NETWORK TOKEN", async () => {
      let balanceReputationBefore = await token.poolTokensReputation(
        await childToken.getAddress()
      );
      await factory
        .connect(addr1)
        .transferTokenToAnotherPool(
          await factory.tokenOf(await addr1.getAddress()),
          await token.getAddress(),
          amount
        );
      let balanceReputationAfter = await token.poolTokensReputation(
        await childToken.getAddress()
      );
      expect(balanceReputationBefore + BigInt(amount)).to.be.equal(
        balanceReputationAfter
      );
    });

    it("Should reduced ORIGIN POOL REPUTATION of NETWORK TOKEN", async () => {
      let balanceReputationBefore = await childToken.poolTokensReputation(
        await childToken.getAddress()
      );
      await factory
        .connect(addr1)
        .transferTokenToAnotherPool(
          await factory.tokenOf(await addr1.getAddress()),
          await token.getAddress(),
          amount
        );
      let balanceReputationAfter = await childToken.poolTokensReputation(
        await childToken.getAddress()
      );
      expect(balanceReputationBefore - BigInt(amount)).to.be.equal(
        balanceReputationAfter
      );
    });

    describe("NOT WORKS", function () {
      it("Should revert if caller havn't token", async function () {
        await expect(
          factory
            .connect(randomAddr)
            .transferTokenToAnotherPool(
              await factory.tokenOf(await addr1.getAddress()),
              await token.getAddress(),
              1
            )
        ).to.be.revertedWith(ERRORS.CALLER_NOT_OWN_TOKEN);
      });

      it("Should revert if pool balance is less than amount", async function () {
        await expect(
          factory
            .connect(addr1)
            .transferTokenToAnotherPool(
              await factory.tokenOf(await addr1.getAddress()),
              await token.getAddress(),
              BigInt(amount) + 1n
            )
        ).to.be.revertedWith(ERRORS.INSUFFICIENT_BALANCE);
      });

      it("Should revert if token  wasn't on pool", async () => {
        await expect(
          factory
            .connect(addr1)
            .transferTokenToAnotherPool(
              "0xD13c7342e1ef687C5ad21b27c2b65D772cAb5C8c",
              await token.getAddress(),
              amount
            )
        ).to.be.revertedWith(ERRORS.CALLER_NOT_TOKEN);
      });
    });
  });

  describe("Set Rules", function () {
    let newRules: DataTypes.AdminRulesStruct;
    let MAX_SUPPLY = 20999999n * 10n ** 18n;
    this.beforeEach(async () => {
      newRules = {
        customRules: false,
        initialSupply: MAX_SUPPLY / 2n - 1n,
        maxSupply: MAX_SUPPLY,

        sponsorTokenRequirement: 100000n * 10n ** 18n,
        adminRetainedTokensPercentage: 1,
        networkParticipationPercentage: 1,
        networkToChildAllocationPercentage: 1,
        adminLegacyFeePercentage: 1,
        adminRevokeFeePercentage: 1,
        governancePercentageToTokensPercentage: 1,
      };
    });

    it("Should set custom rules to true", async () => {
      await factory.setRules(newRules, await randomAddr.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr.getAddress()
          )
        ).customRules
      ).to.be.equal(true);
    });

    it("Should modify the initial supply", async () => {
      await factory.setRules(newRules, await randomAddr.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr.getAddress()
          )
        ).initialSupply
      ).to.be.equal(newRules.initialSupply);
      (newRules = { ...newRules, initialSupply: 1n }),
        await factory.setRules(newRules, await randomAddr1.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr1.getAddress()
          )
        ).initialSupply
      ).to.be.equal(newRules.initialSupply);
    });
    it("Should modify the max supply", async () => {
      await factory.setRules(newRules, await randomAddr.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr.getAddress()
          )
        ).maxSupply
      ).to.be.equal(newRules.maxSupply);

      newRules = {
        ...newRules,
        initialSupply: 1n * 10n ** 18n,
        maxSupply: 2n * 10n ** 18n,
      };
      await factory.setRules(newRules, await randomAddr1.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr1.getAddress()
          )
        ).initialSupply
      ).to.be.equal(newRules.initialSupply);
    });

    it("Should modify the max supply", async () => {
      await factory.setRules(newRules, await randomAddr.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr.getAddress()
          )
        ).maxSupply
      ).to.be.equal(newRules.maxSupply);

      newRules = {
        ...newRules,
        initialSupply: 1n * 10n ** 18n,
        maxSupply: 2n * 10n ** 18n,
      };
      await factory.setRules(newRules, await randomAddr1.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr1.getAddress()
          )
        ).initialSupply
      ).to.be.equal(newRules.initialSupply);
    });

    it("Should modify the sponsor token requirement", async () => {
      await factory.setRules(newRules, await randomAddr.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr.getAddress()
          )
        ).sponsorTokenRequirement
      ).to.be.equal(newRules.sponsorTokenRequirement);

      newRules = {
        ...newRules,
        sponsorTokenRequirement: 1n * 10n ** 18n,
      };
      await factory.setRules(newRules, await randomAddr1.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr1.getAddress()
          )
        ).sponsorTokenRequirement
      ).to.be.equal(newRules.sponsorTokenRequirement);
    });
    it("Should modify the admin retained tokens percentage", async () => {
      await factory.setRules(newRules, await randomAddr.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr.getAddress()
          )
        ).adminRetainedTokensPercentage
      ).to.be.equal(newRules.adminRetainedTokensPercentage);

      newRules = {
        ...newRules,
        adminRetainedTokensPercentage: 49,
      };
      await factory.setRules(newRules, await randomAddr1.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr1.getAddress()
          )
        ).adminRetainedTokensPercentage
      ).to.be.equal(newRules.adminRetainedTokensPercentage);
    });

    it("Should modify the network participation percentage", async () => {
      await factory.setRules(newRules, await randomAddr.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr.getAddress()
          )
        ).networkParticipationPercentage
      ).to.be.equal(newRules.networkParticipationPercentage);

      newRules = {
        ...newRules,
        networkParticipationPercentage: 100,
      };
      await factory.setRules(newRules, await randomAddr1.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr1.getAddress()
          )
        ).networkParticipationPercentage
      ).to.be.equal(newRules.networkParticipationPercentage);
    });

    it("Should modify the network to child allocation percentage", async () => {
      await factory.setRules(newRules, await randomAddr.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr.getAddress()
          )
        ).networkToChildAllocationPercentage
      ).to.be.equal(newRules.networkToChildAllocationPercentage);

      newRules = {
        ...newRules,
        networkToChildAllocationPercentage: 100,
      };
      await factory.setRules(newRules, await randomAddr1.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr1.getAddress()
          )
        ).networkToChildAllocationPercentage
      ).to.be.equal(newRules.networkToChildAllocationPercentage);
    });

    it("Should modify the admin legacy fee percentage", async () => {
      await factory.setRules(newRules, await randomAddr.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr.getAddress()
          )
        ).adminLegacyFeePercentage
      ).to.be.equal(newRules.adminLegacyFeePercentage);

      newRules = {
        ...newRules,
        adminLegacyFeePercentage: 49,
      };
      await factory.setRules(newRules, await randomAddr1.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr1.getAddress()
          )
        ).adminLegacyFeePercentage
      ).to.be.equal(newRules.adminLegacyFeePercentage);
    });

    it("Should modify the admin revoke fee percentage", async () => {
      await factory.setRules(newRules, await randomAddr.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr.getAddress()
          )
        ).adminRevokeFeePercentage
      ).to.be.equal(newRules.adminRevokeFeePercentage);

      newRules = {
        ...newRules,
        adminRevokeFeePercentage: 100,
      };
      await factory.setRules(newRules, await randomAddr1.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr1.getAddress()
          )
        ).adminRevokeFeePercentage
      ).to.be.equal(newRules.adminRevokeFeePercentage);
    });

    it("Should modify the governance percentage to tokens percentage", async () => {
      await factory.setRules(newRules, await randomAddr.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr.getAddress()
          )
        ).governancePercentageToTokensPercentage
      ).to.be.equal(newRules.governancePercentageToTokensPercentage);

      newRules = {
        ...newRules,
        governancePercentageToTokensPercentage: 100,
      };
      await factory.setRules(newRules, await randomAddr1.getAddress());
      expect(
        (
          await factory.rulesOf(
            await token.getAddress(),
            await randomAddr1.getAddress()
          )
        ).governancePercentageToTokensPercentage
      ).to.be.equal(newRules.governancePercentageToTokensPercentage);
    });

    describe("NOT WORKS", function () {
      it("Should revert if caller havn't token", async function () {
        await expect(
          factory
            .connect(randomAddr)
            .setRules(newRules, await token.getAddress())
        ).to.be.revertedWith(ERRORS.CALLER_NOT_OWN_TOKEN);
      });

      it("Should revert if initial supply is greater than max supply / 2", async () => {
        newRules = { ...newRules, initialSupply: MAX_SUPPLY / 2n + 1n };
        await expect(
          factory.setRules(newRules, await randomAddr.getAddress())
        ).to.be.revertedWith(ERRORS.INVALID_SUPPLY);
        newRules = { ...newRules, initialSupply: 2, maxSupply: 3 };
        await expect(
          factory.setRules(newRules, await randomAddr.getAddress())
        ).to.be.revertedWith(ERRORS.INVALID_SUPPLY);
      });

      it("Should revert if max supply is lower than initialSupply", async () => {
        newRules = {
          ...newRules,
          maxSupply: BigInt(newRules.initialSupply) - 1n,
        };
        await expect(
          factory.setRules(newRules, await randomAddr.getAddress())
        ).to.be.revertedWith(ERRORS.INVALID_SUPPLY);
      });

      it("Should revert if max supply is greater than MAX_SUPPLY", async () => {
        newRules = {
          ...newRules,
          maxSupply: 21000000n * 10n ** 18n + 1n,
        };
        await expect(
          factory.setRules(newRules, await randomAddr.getAddress())
        ).to.be.revertedWith(ERRORS.INVALID_SUPPLY);
      });

      it("Should revert if admin retained tokens % is greater than MAX_ADMIN_RETAINED_TOKENS_PERCENTAGE", async () => {
        newRules = {
          ...newRules,
          adminRetainedTokensPercentage: 50,
        };
        await expect(
          factory.setRules(newRules, await randomAddr.getAddress())
        ).to.be.revertedWith(ERRORS.INVALID_RETAINED_PERCENTAGE);
      });

      it("Should revert if network participation % is greater than MAX_NETWORK_PARTICIPATION_PERCENTAGE", async () => {
        newRules = {
          ...newRules,
          networkParticipationPercentage: 101,
        };
        await expect(
          factory.setRules(newRules, await randomAddr.getAddress())
        ).to.be.revertedWith(ERRORS.INVALID_NETWORK_PARTICIPATION_PERCENTAGE);
      });

      it("Should revert if admin legacy fee % is greater than MAX_ADMIN_LEGACY_FEE_PERCENTAGE", async () => {
        newRules = {
          ...newRules,
          adminLegacyFeePercentage: 50,
        };
        await expect(
          factory.setRules(newRules, await randomAddr.getAddress())
        ).to.be.revertedWith(ERRORS.INVALID_LEGACY_FEE_PERCENTAGE);
      });

      it("Should revert if admin revoke fee % is greater than MAX_ADMIN_REVOKE_FEE_PERCENTAGE", async () => {
        newRules = {
          ...newRules,
          adminRevokeFeePercentage: 101,
        };
        await expect(
          factory.setRules(newRules, await randomAddr.getAddress())
        ).to.be.revertedWith(ERRORS.INVALID_REVOKE_FEE_PERCENTAGE);
      });
    });
  });

  describe("withdrawReputation", function () {
    it("Should update pool after withdraw", async () => {
      let balancePool = await token.poolTokensReputation(
        await token.getAddress()
      );
      await token.withdrawReputation(balancePool);
      expect(
        await token.poolTokensReputation(await token.getAddress())
      ).to.be.equal(0);
    });

    it("Should admin receive token", async () => {
      let balance = await token.balanceOf(await owner.getAddress());
      let balancePool = await token.poolTokensReputation(
        await token.getAddress()
      );
      await token.withdrawReputation(balancePool);
      expect(await token.balanceOf(await owner.getAddress())).to.be.equal(
        balance + balancePool
      );
    });

    it("Should reduce balance of contract", async () => {
      let balance = await token.balanceOf(await token.getAddress());
      let balancePool = await token.poolTokensReputation(
        await token.getAddress()
      );
      await token.withdrawReputation(balancePool);
      expect(await token.balanceOf(await token.getAddress())).to.be.equal(
        balance - balancePool
      );
    });

    it("Should admin receive fee token if token != address(this)", async () => {
      let { child } = await onboardParticipant({});
      let childToken = await getChildToken(child);
      let balance = await childToken.balanceOf(await owner.getAddress());
      let balancePool = await token.poolTokensReputation(
        await childToken.getAddress()
      );
      await token.connect(addr1).withdrawReputation(balancePool);
      let rules = await factory.rulesOf(
        await token.getAddress(),
        await childToken.getAddress()
      );
      expect(await childToken.balanceOf(await owner.getAddress())).to.be.equal(
        balance + (balancePool * rules.adminRevokeFeePercentage) / 100n
      );
    });

    describe("NOT WORKS", function () {
      it("Should revert if caller is not the admin of the token", async () => {
        await expect(
          token.connect(randomAddr).withdrawReputation(100)
        ).to.be.revertedWith(ERRORS.CALLER_NOT_OWN_TOKEN);
      });

      it("Should revert if pool balance is less than amount", async () => {
        let { child } = await onboardParticipant({});
        let balancePool = await token.poolTokensReputation(child);
        await expect(
          token.connect(addr1).withdrawReputation(balancePool + 1n)
        ).to.be.revertedWith(ERRORS.INSUFFICIENT_BALANCE);
      });
    });
  });

  // TODO je dois faire un transfer reputation
  describe.only("transferReputationByAdmin", function () {
    let childToken: TokenReputation;

    this.beforeEach(async () => {
      expect(await factory.tokenOf(await addr1.getAddress())).to.be.equal(
        ethers.ZeroAddress
      );
      const { child, to, amount } = await onboardParticipant({});
      childToken = await getChildToken(child);
      let balancePool = await childToken.poolTokensReputation(
        await childToken.getAddress()
      );
      await factory
        .connect(addr1)
        .transferTokenToAnotherPool(
          await childToken.getAddress(),
          await token.getAddress(),
          balancePool
        );
      expect(await token.poolTokensReputation(child)).to.be.gte(balancePool);
    });

    it("Should send reputation to any address", async () => {
      let balanceBefore = await childToken.balanceOf(
        await randomAddr.getAddress()
      );
      let balancePool = await token.poolTokensReputation(
        await childToken.getAddress()
      );

      await token.transferReputationByAdmin(
        await childToken.getAddress(),
        await randomAddr.getAddress(),
        balancePool
      );

      expect(
        await childToken.balanceOf(await randomAddr.getAddress())
      ).to.be.equal(balanceBefore + balancePool);
    });

    it("Should reduce reputation pool", async () => {
      let balancePool = await token.poolTokensReputation(
        await childToken.getAddress()
      );
      await token.transferReputationByAdmin(
        await childToken.getAddress(),
        await randomAddr.getAddress(),
        balancePool
      );
      expect(
        await token.poolTokensReputation(await childToken.getAddress())
      ).to.be.equal(0);
    });

    it("Should reduce balance of contract", async () => {
      let amount = 10n;
      let balance = await childToken.balanceOf(await token.getAddress());

      await token.transferReputationByAdmin(
        await childToken.getAddress(),
        await randomAddr.getAddress(),
        amount
      );

      expect(await childToken.balanceOf(await token.getAddress())).to.be.equal(
        balance - amount
      );
    });

    describe("NOT WORKS", function () {
      it("Should revert if caller isn't admin of contract", async () => {
        await expect(
          token
            .connect(addr1)
            .transferReputationByAdmin(
              await childToken.getAddress(),
              await randomAddr.getAddress(),
              1
            )
        ).to.be.revertedWith(ERRORS.CALLER_NOT_ADMIN);
      });

      it("Should revert if pool tokens reputation is lower than amount", async () => {
        let balancePool = await token.poolTokensReputation(
          await childToken.getAddress()
        );
        await expect(
          token.transferReputationByAdmin(
            await childToken.getAddress(),
            await randomAddr.getAddress(),
            balancePool + 1n
          )
        ).to.be.revertedWith(ERRORS.INSUFFICIENT_BALANCE);
      });
    });
  });

  describe("transferOnPoolReputation", function () {
    let childToken: TokenReputation;

    this.beforeEach(async () => {
      const { child, to, amount } = await onboardParticipant({});
      childToken = await getChildToken(child);
      let balancePool = await childToken.poolTokensReputation(
        await childToken.getAddress()
      );

      expect(balancePool).to.be.lte(
        await childToken.balanceOf(await childToken.getAddress())
      );

      expect(balancePool).to.be.gt(0);
      await childToken.connect(addr1).withdrawReputation(balancePool);

      expect(await childToken.balanceOf(await addr1.getAddress())).to.be.gte(
        balancePool
      );
    });

    it("Should send reputation to POOL REPUTATION", async () => {
      let balancePool = await token.poolTokensReputation(
        await childToken.getAddress()
      );

      let balance = await childToken.balanceOf(await addr1.getAddress());
      await childToken
        .connect(addr1)
        .transferOnPoolReputation(await token.getAddress(), balance);
      expect(
        await token.poolTokensReputation(await childToken.getAddress())
      ).to.be.equal(balancePool + balance);
    });

    it("Should increase balance of contract", async () => {
      let balanceContract = await childToken.balanceOf(
        await token.getAddress()
      );

      let balance = await childToken.balanceOf(await addr1.getAddress());
      await childToken
        .connect(addr1)
        .transferOnPoolReputation(await token.getAddress(), balance);
      expect(await childToken.balanceOf(await token.getAddress())).to.be.equal(
        balanceContract + balance
      );
    });

    describe("NOT WORKS", function () {
      it("Should revert if caller haven't token", async () => {
        await expect(
          childToken
            .connect(randomAddr)
            .transferOnPoolReputation(await token.getAddress(), 1)
        ).to.be.reverted;
      });

      it("Should revert if balance of caller is less than amount", async () => {
        let balance = await childToken.balanceOf(await addr1.getAddress());
        await expect(
          childToken
            .connect(addr1)
            .transferOnPoolReputation(await token.getAddress(), balance + 1n)
        ).to.be.revertedWith(ERRORS.INSUFFICIENT_BALANCE);
      });

      it("Should revert if token haven't access of NETWORK");
    });
  });

  describe("Engage reputation", function () {
    let childToken: TokenReputation;

    this.beforeEach(async () => {
      expect(await factory.tokenOf(await addr1.getAddress())).to.be.equal(
        ethers.ZeroAddress
      );
      const { child, to, amount } = await onboardParticipant({});
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
