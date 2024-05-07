// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Importing the ERC404 contract as the base and OpenZeppelin's Strings library for string operations
// import "./ERC404.sol";
// import "./ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interfaces/ITokenReputation.sol";
import "./interfaces/ITokenReputationFactory.sol";
import {DataTypes} from "./libraries/DataTypes.sol";
// My404 contract inherits ERC404 to create a custom token with both ERC-20 and ERC-721 features
contract TokenReputation is ERC20, Ownable {
    // Public variables to store URIs for token metadata
    string public dataURI;
    string public baseTokenURI;
    uint256 public tokensLegacy;
    address public source;
    using Strings for uint256;

    DataTypes.AdminRules rules;

    mapping(address => uint256) public poolTokensForGovernance;
    mapping(address => uint256) public poolTokensForSponsor;
    mapping(address => DataTypes.AdminRules) public particularRules;
    mapping(address => bool) public isBanned;

    modifier onlyAdminOf(address _token) {
        uint256 balance;
        uint256 supply;
        if (_token == address(this)) {
            balance = balanceOf(msg.sender);
            supply = totalSupply();
        } else {
            ERC20 token = ERC20(_token);
            balance = token.balanceOf(msg.sender);
            supply = token.totalSupply();
        }
        require(
            balance >= supply / 2,
            "You must own at least 50% of the token supply to be able to call this function"
        );
        _;
    }

    modifier onlySponsorFor(address _token, uint256 _value) {
        ITokenReputation token = ITokenReputation(_token);
        uint256 balance;
        if (_token == address(this)) {
            balance = balanceOf(msg.sender);
        } else {
            balance = poolTokensForSponsor[msg.sender];
        }
        require(balance > _value, "Not enough tokens to access this function");
        _;
    }

    function isContract(address _addr) private view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(_addr)
        }
        return (size > 0);
    }

    // Constructor to initialize the contract with token details and owner's initial balance
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimal,
        uint256 _totalSupply,
        uint8 _mintFeePercentage,
        uint8 _legacyFeePercentage,
        uint8 _governancePercentageToSponsorPercentage,
        uint256 _tokenRequirement
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        _mint(msg.sender, _totalSupply * 10 ** _decimal); // Setting the initial balance of tokens for the owner

        DataTypes.AdminRules memory newRules;
        newRules.adminLegacyFeePercentage = _legacyFeePercentage;
        newRules.adminMintFeePercentage = _mintFeePercentage;
        newRules.sponsorTokenRequirement = _tokenRequirement;
        rules = newRules;
        source = msg.sender;
    }

    function onboardParticipantToken(
        address _factory,
        uint256 _amount,
        address _sponsored,
        string calldata _name
    ) public onlyAdminOf(address(this)) {
        DataTypes.AdminRules memory _rules;
        if (particularRules[_sponsored].customRules) {
            _rules = particularRules[_sponsored];
        } else {
            _rules = rules;
        }
        uint participationRateTokens = (_amount *
            _rules.adminLegacyFeePercentage) / 100;
        transfer(_sponsored, participationRateTokens);

        address newToken = ITokenReputationFactory(_factory).mint(
            _sponsored,
            _name,
            decimals(),
            _amount,
            _rules
        );

        // TODO Participer au nouveau token
        if (isBanned[_sponsored]) {
            isBanned[_sponsored] = false;
        }
        tokensLegacy += 1;
    }

    function engageReputation(uint256 _amount, address _token) public {
        ITokenReputation token = ITokenReputation(_token);

        if (!isBanned[_token] || token.poolTokensForSponsor(msg.sender) > 0) {
            _engageReputation(_amount, msg.sender, token);
        }
    }

    function findRules(
        address _sponsored
    ) public view returns (DataTypes.AdminRules memory) {
        if (particularRules[_sponsored].customRules) {
            return particularRules[_sponsored];
        } else {
            return rules;
        }
    }

    function _engageReputation(
        uint256 _amount,
        address _sponsored,
        ITokenReputation iToken
    ) internal onlySponsorFor(address(iToken), _amount) {
        bool isAllowed;

        DataTypes.AdminRules memory _rules = findRules(address(iToken));

        uint256 participationReciprocalRate = iToken.poolTokensForSponsor(
            source
        );
        uint256 checkSponsoredBalance = iToken.balanceOf(_sponsored);
        require(
            _rules.sponsorTokenRequirement < checkSponsoredBalance,
            "Not enough tokens to access this function"
        );
        if (checkSponsoredBalance > 0) {
            iToken.revokeParticipation(checkSponsoredBalance, address(this));

            if (
                checkSponsoredBalance == iToken.balanceOf(_sponsored) - _amount
            ) {
                iToken.engageReputation(checkSponsoredBalance, address(iToken));
            }
            isAllowed = true;
        }

        poolTokensForSponsor[_sponsored] += _amount;
        transfer(_sponsored, _amount);
    }

    function revokeParticipation(
        uint256 _amount,
        address _token
    ) public onlyAdminOf(_token) {
        DataTypes.AdminRules memory _rules;
        require(
            poolTokensForSponsor[_token] >= _amount,
            "Not enough tokens to access this function"
        );

        if (particularRules[msg.sender].customRules) {
            _rules = particularRules[msg.sender];
        } else {
            _rules = rules;
        }
        uint256 feeAmount = (_amount * _rules.adminRevokeFeePercentage) / 100;
        uint256 netAmount = _amount - feeAmount;
        poolTokensForSponsor[_token] -= _amount;
        transfer(msg.sender, netAmount);
    }

    // Function to set the data URI, which can be used for additional metadata (change as needed)
    function setDataURI(string memory _dataURI) public onlyOwner {
        dataURI = _dataURI;
    }

    // Function to set the base URI for token metadata; this can be an IPFS link (changeable by the owner)
    function setTokenURI(string memory _tokenURI) public onlyOwner {
        baseTokenURI = _tokenURI;
    }
}
