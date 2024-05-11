// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import {DataTypes} from "../libraries/DataTypes.sol";

interface ITokenReputationFactory {
    function adminOf(address _token) external view returns (address);
    function tokenOf(address _admin) external view returns (address);
    function mint(
        address _sponsored,
        string memory _name,
        uint256 _initialSupply,
        DataTypes.AdminRules memory _rules
    ) external returns (address);
    function childTokenToNetworkTokens(
        address _childToken
    ) external view returns (address);
    function rulesOf(
        address _network,
        address _for
    ) external view returns (DataTypes.AdminRules memory rules);
}
