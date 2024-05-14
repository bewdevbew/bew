import { Signer } from "ethers";
import { deployContract } from "../utils/controllers";

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const abi_f_t = require("../artifacts/contracts/FactoryTokenReputation.sol/TokenReputationFactory.json");
const abi_t = require("../artifacts/contracts/TokenReputation.sol/TokenReputation.json");

const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

async function main() {
  let owner: Signer;

  [owner] = await hre.ethers.getSigners();

  const contracts = await deployContract({});

  const factory = contracts.factory;
  const token = contracts.token;

  const jsonContent = {
    token: token.target,
    factory: await factory.getAddress(),
  };

  const abis = {
    token: abi_t.abi,
    factory: abi_f_t.abi,
  };
  console.log("ADDRESS content", jsonContent);
  let filePath = path.join(
    __dirname,
    "../../frontend/contract/local/addresses.json"
  );
  fs.writeFile(
    filePath,
    JSON.stringify(jsonContent, null, 2),
    "utf8",
    function (err: any) {
      if (err) {
        console.log(
          "Une erreur s'est produite lors de l'écriture du fichier JSON.",
          err
        );
      } else {
        console.log(
          "Fichier address.json créé avec succès dans le dossier frontend."
        );
      }
    }
  );
  filePath = path.join(__dirname, "../../frontend/contract/local/abis.json"); // TESTNET :  "../../frontend/abistestnet.json";
  fs.writeFile(
    filePath,
    JSON.stringify(abis, null, 2),
    "utf8",
    function (err: any) {
      if (err) {
        console.log(
          "Une erreur s'est produite lors de l'écriture du fichier JSON.",
          err
        );
      } else {
        console.log(
          "Fichier abis.json créé avec succès dans le dossier frontend."
        );
      }
    }
  );
  const jsonString = JSON.stringify(jsonContent, null, 2);
  await writeFileAsync("addresses.json", jsonString);
  console.log("JSON file created: addresses.json");

  return contracts;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// module.exports = { main };
