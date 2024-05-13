// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Errors {
    string public constant CALLER_NOT_OWN_TOKEN = "1"; // "The caller of the function haven't token"
    string public constant ADDRESS_ALREADY_OWN_TOKEN = "2"; // "The caller of the function already own his token"
    string public constant CALLER_USE_INVALID_ARGUMENT = "3"; // "The caller of the function haven't the right to call this function with this argument"
    string public constant CALLER_NOT_TOKEN = "4"; // "The caller of the function must be a token"
    string public constant CALLER_NOT_FACTORY = "5"; //"The caller of the function must be a factory"
    string public constant CALLER_NOT_ADMIN = "6"; //"The caller of the function must be admin of token"
    string public constant INSUFFICIENT_BALANCE = "7"; //"The caller of the function must have enough balance"
    string public constant OVERFLOW_MAX_SUPPLY = "8"; //"The max supply is overflow"
    string public constant CALLER_CANT_USE_FUNCTION = "9"; //"The caller of the function haven't access to this function"
    string public constant AMOUNT_CANT_BE_ZERO = "10"; //"The amount can't be zero"
    string public constant CALLER_IS_BANNED = "11"; //"The caller of the function is banned"
    string public constant NETWORK_NOT_ALLOWED = "12"; //"The network is not allowed"
    string public constant INVALID_SUPPLY = "13"; //"The initial supply must be lower than 50% of max supply and max supply must be lower than MAX_SUPPLY"
    string public constant INVALID_RETAINED_PERCENTAGE = "14"; //"The admin retained tokens percentage must be less than MAX_ADMIN_RETAINED_TOKENS_PERCENTAGE"
    string public constant INVALID_NETWORK_PARTICIPATION_PERCENTAGE = "15"; //"The network participation percentage must be less than MAX_NETWORK_PARTICIPATION_PERCENTAGE"
    string public constant INVALID_LEGACY_FEE_PERCENTAGE = "16"; //" Admin legacy fee percentage must be less than MAX_ADMIN_LEGACY_FEE_PERCENTAGE"
    string public constant INVALID_REVOKE_FEE_PERCENTAGE = "17"; //" Admin revoke fee percentage must be less than MAX_ADMIN_REVOKE_FEE_PERCENTAGE"
}
