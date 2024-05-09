// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {DataTypes} from "../libraries/DataTypes.sol";

interface ITokenReputation {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    function symbol() external view virtual returns (string memory);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
    function dataURI() external view returns (string calldata _uri);
    function baseTokenURI() external view returns (string calldata _uri);
    function legacyLength() external view returns (uint);
    function source() external view returns (address);
    function owner() external view returns (address);
    function poolTokensForGovernance(
        address _addr
    ) external view returns (uint256);
    function poolTokensReputation(
        address _addr
    ) external view returns (uint256);
    function particularRules(
        address _addr
    ) external view returns (DataTypes.AdminRules memory);
    function isBanned(address _addr) external view returns (bool);

    function onboardParticipantToken(
        uint256 _amount,
        address _sponsored,
        string calldata _name
    ) external;

    function engageReputation(uint256 _amount, address _token) external;

    function findRules(
        address _sponsored
    ) external view returns (DataTypes.AdminRules memory);

    function revokeParticipation(uint256 _amount, address _token) external;

    function setDataURI(string memory _dataURI) external;

    function setTokenURI(string memory _tokenURI) external;
    function tokenURI(uint256 id) external view returns (string memory);
}
