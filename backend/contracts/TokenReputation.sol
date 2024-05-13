// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./interfaces/ITokenReputation.sol";
import "./interfaces/ITokenReputationFactory.sol";
import {DataTypes} from "./libraries/DataTypes.sol";
import {Errors} from "./libraries/helpers/Errors.sol";
// TODO corriger l'énorme faille de sécurité du _owner dans le constructeur.
// TODO corriger l'énorme faille de sécurité du sponsor if TokenNetwork est dans la pool token reputation du smart contract
//! Inscrire la preuve dans la factory
//! Si le token est dans la pool j'accepte le sponsor mais comme je n'ai pas le controle sur les regles de ce smart contract, tout ceux ayant des tokens dans ma pool sont considéré comme sponsorisé

contract TokenReputation is ERC20, Ownable {
    event NewTokenOnboarded(
        address indexed token,
        address indexed to,
        uint256 value
    );
    string public dataURI;
    string public baseTokenURI;
    uint256 public legacyLength;
    address public factory;
    ITokenReputationFactory immutable iFactory;
    uint256 public immutable MAX_SUPPLY;

    // ! rules now is store on factory
    // DataTypes.AdminRules public rules;

    mapping(address => uint256) public poolTokensForGovernance;
    mapping(address => uint256) public poolTokensReputation;
    mapping(address => mapping(address => uint256)) public poolTokensForSponsor;
    mapping(address => DataTypes.AdminRules) public particularRules;
    mapping(address => bool) public isBanned;

    modifier onlyFactory() {
        require(msg.sender == factory, Errors.CALLER_NOT_FACTORY);
        _;
    }

    modifier onlyAdminOf(address _token) {
        // TODO Faire une fonction dans la factory pour révoquer l'admin si balanceOf(caller) a > totalSupply/2
        require(
            iFactory.adminOf(_token) == msg.sender,
            Errors.CALLER_NOT_ADMIN
        );
        _;
    }

    modifier onlySponsorFor(address _token, uint256 _value) {
        ITokenReputation token = ITokenReputation(_token);
        uint256 balance;
        if (_token == address(this)) {
            balance = balanceOf(msg.sender);
        } else {
            balance = poolTokensReputation[msg.sender];
        }
        require(balance > _value, Errors.INSUFFICIENT_BALANCE);
        _;
    }

    // Constructor to initialize the contract with token details and owner's initial balance
    constructor(
        address _owner,
        string memory _name,
        string memory _symbol,
        DataTypes.AdminRules memory _rules
    ) ERC20(_name, _symbol) Ownable(_owner) {
        factory = msg.sender;
        iFactory = ITokenReputationFactory(msg.sender);

        uint256 mintedFees = (_rules.initialSupply *
            _rules.adminRetainedTokensPercentage) / 100;
        approve(msg.sender, _rules.maxSupply);
        // approve(address(this), _rules.maxSupply);

        _mint(msg.sender, mintedFees); // Factory send the total supply to the owner after deployment
        _mint(address(this), _rules.initialSupply - mintedFees);
        poolTokensReputation[address(this)] +=
            _rules.initialSupply -
            mintedFees;

        MAX_SUPPLY = _rules.maxSupply;
        emit NewTokenOnboarded(address(this), _owner, _rules.initialSupply);
    }

    function isContract(address _addr) private view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(_addr)
        }
        return (size > 0);
    }

    function rules() public view returns (DataTypes.AdminRules memory) {
        return iFactory.rulesOf(address(this), address(this));
    }

    /**
     * @dev Function to mint a new token reputation for a participant
     * @param _for The address of the participant to mint the token for
     * @param _name The name of the new token reputation
     * @param _symbol The symbol of the new token reputation
     * @return The address of the new token reputation
     */

    function onboardParticipant(
        address _for,
        string calldata _name,
        string calldata _symbol
    ) public onlyAdminOf(address(this)) returns (address) {
        return _onboardParticipant(_for, _name, _symbol);
    }

    /**
     * @dev Function to mint a new token reputation for a participant
     * @param _for The address of the participant to mint the token for
     * @param _name The name of the new token reputation
     * @param _symbol The symbol of the new token reputation
     * @return The address of the new token reputation
     */

    function onboardCustomParticipant(
        address _for,
        uint256 _initialSupply,
        uint256 _maxSupply,
        string calldata _name,
        string calldata _symbol
    ) public onlyAdminOf(address(this)) returns (address) {
        DataTypes.AdminRules memory _rules = iFactory.rulesOf(
            address(this),
            _for
        );

        _rules.initialSupply = _initialSupply;
        _rules.maxSupply = _maxSupply;

        iFactory.setRules(_rules, _for);
        return _onboardParticipant(_for, _name, _symbol);
    }

    function _onboardParticipant(
        address _for,
        string calldata _name,
        string calldata _symbol
    ) internal returns (address) {
        address newToken = iFactory.mint(_for, _name, _symbol);
        isBanned[_for] = false;
        legacyLength += 1;
        emit NewTokenOnboarded(
            address(newToken),
            _for,
            iFactory.rulesOf(address(this), _for).initialSupply
        );
        return newToken;
    }

    function _findRules(
        address _for
    ) internal view returns (DataTypes.AdminRules memory) {
        return iFactory.rulesOf(address(this), _for);
    }

    function mint(uint _amount) public onlyFactory {
        require(
            MAX_SUPPLY >= totalSupply() + _amount,
            Errors.OVERFLOW_MAX_SUPPLY
        );
        _mint(factory, _amount);
    }

    function withdrawSponsorshipToken(
        address _sponsor,
        address _erc20,
        uint _amount
    ) external {
        require(
            msg.sender == _sponsor ||
                iFactory.adminOf(_erc20) == msg.sender ||
                iFactory.adminOf(_sponsor) == msg.sender,
            Errors.CALLER_CANT_USE_FUNCTION
        );
        require(
            poolTokensForSponsor[_sponsor][_erc20] >= _amount,
            Errors.INSUFFICIENT_BALANCE
        );
        poolTokensForSponsor[_sponsor][_erc20] -= _amount;
        ERC20(_erc20).transfer(msg.sender, _amount);
    }

    function addReserveSponsorFromFactory(
        address _for,
        address _erc20,
        uint256 _amount
    ) public onlyFactory {
        _addReserveSponsor(_for, _erc20, _amount);
    }

    function addReserveSponsor(address _erc20, uint256 _amount) public {
        _addReserveSponsor(msg.sender, _erc20, _amount);
    }

    function _addReserveSponsor(
        address _for,
        address _erc20,
        uint256 _amount
    ) internal {
        require(_amount > 0, Errors.AMOUNT_CANT_BE_ZERO);
        require(ERC20(_erc20).transferFrom(factory, address(this), _amount));
        poolTokensForSponsor[_for][_erc20] += _amount;
    }

    /**
     * @dev Function to deposit reputation tokens to the contract
     * @notice This function is only callable by token reputation contract. It's called from withdrawReputationFromFactory
     * @param _amount can be smaller than withdrawReputationFromFactory in case of admin fee
     */
    function depositReputation(uint256 _amount) public returns (bool) {
        require(!isBanned[msg.sender], Errors.CALLER_IS_BANNED);
        require(
            iFactory.adminOf(msg.sender) != address(0),
            Errors.CALLER_NOT_TOKEN
        );
        require(_amount > 0, Errors.AMOUNT_CANT_BE_ZERO);
        require(
            ERC20(msg.sender).transferFrom(msg.sender, address(this), _amount)
        );
        poolTokensReputation[msg.sender] += _amount;
        return true;
    }

    /**
     * @dev Function to transfer reputation tokens to an external pool of another Token reputation
     * @notice This function is only callable by the factory and factory allowed only admin of token
     * Factory will send fee to the ADMIN if ADMIN have rules revoke fees
     */
    function withdrawReputationFromFactory(
        address _token,
        address _toNewNetwork,
        uint256 _amount
    ) public onlyFactory returns (uint256 netAmount) {
        require(
            _toNewNetwork != address(this),
            Errors.CALLER_USE_INVALID_ARGUMENT
        );
        require(
            poolTokensReputation[_token] >= _amount,
            Errors.INSUFFICIENT_BALANCE
        );
        require(
            poolTokensReputation[_toNewNetwork] > 0 ||
                poolTokensForSponsor[_toNewNetwork][_token] > 0 ||
                poolTokensForSponsor[address(this)][_toNewNetwork] > 0,
            Errors.NETWORK_NOT_ALLOWED
        );

        address admin = iFactory.adminOf(_token);
        uint256 feeAmount;
        if (_token != address(this)) {
            feeAmount =
                (_amount *
                    iFactory
                        .rulesOf(address(this), _token)
                        .adminRevokeFeePercentage) /
                100;
            netAmount = _amount - feeAmount;
        } else {
            netAmount = _amount;
        }
        poolTokensReputation[_token] -= _amount;

        ITokenReputation iToken = ITokenReputation(_token);
        iToken.approve(_toNewNetwork, netAmount);
        ITokenReputation(_toNewNetwork).depositReputation(netAmount);

        if (feeAmount > 0)
            iToken.transfer(iFactory.adminOf(address(this)), feeAmount);
    }

    function revokeParticipation(
        uint256 _amount,
        address _token
    ) public onlyAdminOf(_token) {
        require(
            poolTokensReputation[_token] >= _amount,
            Errors.INSUFFICIENT_BALANCE
        );
        DataTypes.AdminRules memory _rules = iFactory.rulesOf(
            address(this),
            _token
        );
        uint256 feeAmount = (_amount * _rules.adminRevokeFeePercentage) / 100;
        uint256 netAmount = _amount - feeAmount;
        poolTokensReputation[_token] -= _amount;
        transfer(msg.sender, netAmount);
        if (feeAmount > 0) transfer(iFactory.adminOf(address(this)), feeAmount);
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
