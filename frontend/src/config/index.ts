import LocalABIs from "../../contract/local/abis.json";
import LocalAddresses from "../../contract/local/addresses.json";

const CONFIGS = {
  development: {
    abis: LocalABIs,
    addresses: LocalAddresses,
    provider: "http://127.0.0.1:8545/",
  },
  // TODO
  test: {
    abis: LocalABIs,
    addresses: LocalAddresses,
    provider: "infura",
  },
  // TODO
  production: {
    abis: LocalABIs,
    addresses: LocalAddresses,
    provider: "infura",
  },
};

export const CONFIG = CONFIGS[process.env.NODE_ENV || "development"];
