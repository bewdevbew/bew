// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./interfaces/ITokenReputation.sol";
import "./interfaces/ITokenReputationFactory.sol";
import {DataTypes} from "./libraries/DataTypes.sol";
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
        require(
            msg.sender == factory,
            "TokenReputation: Caller must be factory"
        );
        _;
    }

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
            balance = poolTokensReputation[msg.sender];
        }
        require(balance > _value, "Not enough tokens to access this function");
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
        approve(msg.sender, type(uint256).max);

        _mint(msg.sender, mintedFees); // Factory send the total supply to the owner after deployment
        _mint(address(this), _rules.initialSupply - mintedFees);
        poolTokensForSponsor[_owner][address(this)] +=
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
     * @param _factory The address of the token factory
     * @param _amount The initial supply of the new token reputation
     * @param _for The address of the participant to mint the token for
     * @param _name The name of the new token reputation
     * @return The address of the new token reputation
     */

    function onboardParticipant(
        address _factory,
        uint256 _amount,
        address _for,
        string calldata _name
    ) public onlyAdminOf(address(this)) returns (address) {
        /**
         * @dev First we check if the participant has custom rules
         * @notice Rules are set by the admin
         */

        DataTypes.AdminRules memory _rules = _findRules(_for);

        /**
         * @dev Mint the new token reputation with his rules.
         */

        // TODO enlever l'argument rules et le trouver dans la factory
        address newToken = ITokenReputationFactory(_factory).mint(
            _for,
            _name,
            _amount,
            _rules
        );

        /**
         * @notice Functionality explained on top of _reciprocalExchange function
         */
        // _reciprocalExchange(_for, _amount, _rules, ITokenReputation(newToken));

        /**
         * @dev Calculate the allocation of the child token to the Network
         * @notice The Network receive a percentage of the child token from factory mint function
         * and allocate a part of his balance to his pool
         */
        // uint256 allocationChildToken = (((_amount *
        //     _rules.adminRetainedTokensPercentage) / 100) *
        //     _rules.networkParticipationPercentage) / 100;

        // if (allocationChildToken > 0) {
        //     iToken.addReserveSponsor(address(iToken), _amount);
        //     _commitTokenReputation(allocationChildToken, msg.sender, newToken);
        // }
        // TODO Participer au nouveau token
        if (isBanned[_for]) {
            isBanned[_for] = false;
        }
        legacyLength += 1;
        emit NewTokenOnboarded(address(newToken), _for, _amount);
        return newToken;
    }

    // function commitTokenReputationFromFactory(
    //     uint256 _amount,
    //     address _token
    // ) public onlyFactory returns (bool) {
    //     return _commitTokenReputation(_amount, msg.sender, _token);
    // }
    // // function commitTokenReputation(
    // //     uint256 _amount,
    // //     address _token
    // // ) public onlySponsorFor(_token, _amount) returns (bool) {
    // //     return _commitTokenReputation(_amount, msg.sender, _token);
    // // }

    function _findRules(
        address _for
    ) internal view returns (DataTypes.AdminRules memory) {
        return iFactory.rulesOf(address(this), _for);
    }

    /**
    * @notice The protocol implements a reciprocity mechanism which implies 
        that as soon as a NETWORK deploys a new CHILD TOKEN, 
        it retains x CHILD TOKEN and sends y NETWORK TOKEN. 
    */
    function _reciprocalExchange(
        address _for,
        uint256 _amount,
        DataTypes.AdminRules memory _rules,
        ITokenReputation iToken
    ) internal returns (bool) {
        /**
         * @dev First we calculate the retained CHILD TOKEN by the NETWORK
         * @notice Some retained tokens are sent to the ADMIN wallet (adminRetainedTokens - networkParticipation)
         * and the rest is sent to the pool of the NETWORK (networkParticipation)
         * it's depend of the rules : adminRetainedTokensPercentage & networkParticipationPercentage
         */
        uint256 retainedTokens = (_amount *
            _rules.adminRetainedTokensPercentage) / 100;
        if (retainedTokens > 0) {
            uint256 networkParticipation = (retainedTokens *
                _rules.networkParticipationPercentage) / 100;
            iToken.transfer(owner(), retainedTokens - networkParticipation);
            poolTokensForSponsor[owner()][
                address(iToken)
            ] += networkParticipation;
        }
        iToken.transfer(_for, _amount - retainedTokens);
        iToken.transferOwnership(_for);
        /**
         * @dev Token Network send to the new participant are minted and it's the only way to mint token
         * @notice Protocol need reciprocal exchange of tokens
         * between Network and Child Token. Each token minted by the Network
         * received a token Network allocated directly to his pool
         */
        _mint(
            _for,
            (_amount * _rules.networkToChildAllocationPercentage) / 100
        );
        return true;
    }

    function mint(uint _amount) public onlyFactory {
        require(
            MAX_SUPPLY <= totalSupply() + _amount,
            "TokenReputation: can't overflow MAX_SUPPLY"
        );
        _mint(factory, _amount);
    }

    // ! CHECK
    // function _commitTokenReputation(
    //     uint256 _amount,
    //     address _token
    // ) internal returns (bool isAllowed) {
    //     ITokenReputation iToken = ITokenReputation(_token);
    //     require(
    //         !isBanned[_token] || iToken.poolTokensReputation(_for) > 0,
    //         "Not right to access this function"
    //     );
    //     DataTypes.AdminRules memory _rules = findRules(address(iToken));

    //     uint256 participationReciprocalRate = iToken.poolTokensReputation(
    //         source
    //     );
    //     uint256 checkSponsoredBalance = iToken.balanceOf(_token);
    //     require(
    //         _rules.sponsorTokenRequirement < checkSponsoredBalance &&
    //             _for != source,
    //         "Not enough tokens to access this function"
    //     );

    //     // TODO: Send commit fee to poolReputation

    //     poolTokensReputation[_for] += _amount;
    //     transfer(_for, _amount);
    //     if (isAllowed) {}
    // }

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
        require(ERC20(_erc20).transferFrom(msg.sender, address(this), _amount));
        poolTokensForSponsor[_for][_erc20] += _amount;
    }

    // function _approveAdministrationToken(address _token, address _forTokenReputation, uint256 _amount)
    //     public
    //     onlyAdminOf(_token)
    // {
    //     ERC20(_token).approve(_forTokenReputation, _amount);
    //     ITokenReputation iToken = ITokenReputation(_token);

    // }

    function allocateToSponsorPool(uint256 _amount, address _token) public {
        require(
            poolTokensReputation[_token] >= _amount,
            "Not enough tokens to access this function"
        );
        // DataTypes.AdminRules memory _rules = iFactory.rulesOf(
        //     address(this),
        //     msg.sender
        // );

        poolTokensForSponsor[msg.sender][_token] += _amount;
        poolTokensReputation[_token] -= _amount;
    }

    function revokeParticipation(
        uint256 _amount,
        address _token
    ) public onlyAdminOf(_token) {
        require(
            poolTokensReputation[_token] >= _amount,
            "Not enough tokens to access this function"
        );
        DataTypes.AdminRules memory _rules = _findRules(msg.sender);
        uint256 feeAmount = (_amount * _rules.adminRevokeFeePercentage) / 100;
        uint256 netAmount = _amount - feeAmount;
        poolTokensReputation[_token] -= _amount;
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
