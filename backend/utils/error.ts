export type ErrorType =
  | "CALLER_NOT_OWN_TOKEN"
  | "ADDRESS_ALREADY_OWN_TOKEN"
  | "CALLER_USE_INVALID_ARGUMENT"
  | "CALLER_NOT_TOKEN"
  | "CALLER_NOT_FACTORY"
  | "CALLER_NOT_ADMIN"
  | "INSUFFICIENT_BALANCE"
  | "OVERFLOW_MAX_SUPPLY"
  | "CALLER_CANT_USE_FUNCTION"
  | "AMOUNT_CANT_BE_ZERO"
  | "CALLER_IS_BANNED"
  | "NETWORK_NOT_ALLOWED"
  | "INVALID_SUPPLY"
  | "INVALID_RETAINED_PERCENTAGE"
  | "INVALID_NETWORK_PARTICIPATION_PERCENTAGE"
  | "INVALID_LEGACY_FEE_PERCENTAGE"
  | "INVALID_REVOKE_FEE_PERCENTAGE";

const CALLER_NOT_OWN_TOKEN = "The caller of the function haven't token";
const ADDRESS_ALREADY_OWN_TOKEN =
  "The caller of the function already own his token";
const CALLER_USE_INVALID_ARGUMENT =
  "The caller of the function haven't the right to call this function with this argument";
const CALLER_NOT_TOKEN = "The caller of the function must be a token";
const CALLER_NOT_FACTORY = "The caller of the function must be a factory";
const CALLER_NOT_ADMIN = "The caller of the function must be admin of token";
const INSUFFICIENT_BALANCE =
  "The caller of the function must have enough balance";
const OVERFLOW_MAX_SUPPLY = "The max supply is overflow";
const CALLER_CANT_USE_FUNCTION =
  "The caller of the function haven't access to this function";
const AMOUNT_CANT_BE_ZERO = "The amount can't be zero";
const CALLER_IS_BANNED = "The caller of the function is banned";
const NETWORK_NOT_ALLOWED = "The network is not allowed";
const INVALID_SUPPLY =
  "The initial supply must be lower than 50% of max supply and max supply must be lower than MAX_SUPPLY";
const INVALID_RETAINED_PERCENTAGE =
  "The admin retained tokens percentage must be less than MAX_ADMIN_RETAINED_TOKENS_PERCENTAGE";
const INVALID_NETWORK_PARTICIPATION_PERCENTAGE =
  "The network participation percentage must be less than MAX_NETWORK_PARTICIPATION_PERCENTAGE";
const INVALID_LEGACY_FEE_PERCENTAGE =
  " Admin legacy fee percentage must be less than MAX_ADMIN_LEGACY_FEE_PERCENTAGE";
const INVALID_REVOKE_FEE_PERCENTAGE =
  " Admin revoke fee percentage must be less than MAX_ADMIN_REVOKE_FEE_PERCENTAGE";
export const Errors_Index = {
  "0": "",
  "1": "CALLER_NOT_OWN_TOKEN",
  "2": "ADDRESS_ALREADY_OWN_TOKEN",
  "3": "CALLER_USE_INVALID_ARGUMENT",
  "4": "CALLER_NOT_TOKEN",
  "5": "CALLER_NOT_FACTORY",
  "6": "CALLER_NOT_ADMIN",
  "7": "INSUFFICIENT_BALANCE",
  "8": "OVERFLOW_MAX_SUPPLY",
  "9": "CALLER_CANT_USE_FUNCTION",
  "10": "AMOUNT_CANT_BE_ZERO",
  "11": "CALLER_IS_BANNED",
  "12": "NETWORK_NOT_ALLOWED",
  "13": "INVALID_SUPPLY",
  "14": "INVALID_RETAINED_PERCENTAGE",
  "15": "INVALID_NETWORK_PARTICIPATION_PERCENTAGE",
  "16": "INVALID_LEGACY_FEE_PERCENTAGE",
  "17": "INVALID_REVOKE_FEE_PERCENTAGE",
};

export const ERRORS: Record<ErrorType, string> = Object.fromEntries(
  Object.entries(Errors_Index).map(([key, value]) => [value, key])
) as Record<ErrorType, string>;

export const Errors_Def = [
  "",
  CALLER_NOT_OWN_TOKEN,
  ADDRESS_ALREADY_OWN_TOKEN,
  CALLER_USE_INVALID_ARGUMENT,
  CALLER_NOT_TOKEN,
  CALLER_NOT_FACTORY,
  CALLER_NOT_ADMIN,
  INSUFFICIENT_BALANCE,
  OVERFLOW_MAX_SUPPLY,
  CALLER_CANT_USE_FUNCTION,
  AMOUNT_CANT_BE_ZERO,
  CALLER_IS_BANNED,
  NETWORK_NOT_ALLOWED,
  INVALID_SUPPLY,
  INVALID_RETAINED_PERCENTAGE,
  INVALID_NETWORK_PARTICIPATION_PERCENTAGE,
  INVALID_LEGACY_FEE_PERCENTAGE,
  INVALID_REVOKE_FEE_PERCENTAGE,
];
