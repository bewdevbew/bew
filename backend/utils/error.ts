export const ERRORS = {
  onlyAdmin: "TokenReputation: Caller must admin a token",
  onlyAdminFactory: "TokenReputationFactory: Caller must admin a token",
  withdrawAuth: "TokenReputation: Caller must be sponsor or admin of the token",
  insufficientBalance:
    "TokenReputation: Not enough tokens to access this function",
  notToken: "TokenReputationFactory: Only token can call this function",
};
