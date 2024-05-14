import LocalABIs from "../../contract/local/abis.json";
import LocalAddresses from "../../contract/local/addresses.json";

const CONFIGS = {
  development: {
    abis: LocalABIs,
    addresses: LocalAddresses,
  },
  test: {
    abis: LocalABIs,
    addresses: LocalAddresses,
  },
  production: {
    abis: LocalABIs,
    addresses: LocalAddresses,
  },
};

export const CONFIG = CONFIGS[process.env.NODE_ENV || "development"];
