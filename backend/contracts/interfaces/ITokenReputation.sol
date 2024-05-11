// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {DataTypes} from "../libraries/DataTypes.sol";
import "../interfaces/IOwnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITokenReputation is IERC20, IOwnable {
    function addReserveSponsor(address _erc20, uint256 _amount) external;

    function symbol() external view returns (string memory);

    function dataURI() external view returns (string calldata _uri);

    function baseTokenURI() external view returns (string calldata _uri);

    function legacyLength() external view returns (uint);

    // function source() external view returns (address);

    // function owner() external view returns (address);

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

    function addReserveSponsorFromFactory(
        address _for,
        address _erc20,
        uint256 _amount
    ) external;

    function commitTokenReputation(uint256 _amount, address _token) external;
    function mint(uint _amount) external;

    function findRules(
        address _sponsored
    ) external view returns (DataTypes.AdminRules memory);

    function revokeParticipation(uint256 _amount, address _token) external;

    function setDataURI(string memory _dataURI) external;

    function setTokenURI(string memory _tokenURI) external;

    function tokenURI(uint256 id) external view returns (string memory);

    function rules() external view returns (DataTypes.AdminRules memory);
}
