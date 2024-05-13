// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import {MintLogic} from "./libraries/logic/MintLogic.sol";
import {Errors} from "./libraries/helpers/Errors.sol";
import {ProtocolConfiguration} from "./libraries/configuration/ProtocolConfiguration.sol";
import "./TokenReputation.sol";
import "./interfaces/ITokenReputation.sol";

contract TokenReputationFactory is Ownable {
    uint256 public tokensLength;
    address public genesisToken;
    string public constant GENESIS_NAME = "ZeroDay";
    string public constant GENESIS_SYMBOL = "0DAY";

    DataTypes.AdminRules public standardRules =
        DataTypes.AdminRules({
            customRules: false,
            initialSupply: ProtocolConfiguration.INITIAL_SUPPLY,
            maxSupply: ProtocolConfiguration.MAX_SUPPLY,
            adminRetainedTokensPercentage: ProtocolConfiguration
                .ADMIN_RETAINED_TOKENS_PERCENTAGE,
            networkParticipationPercentage: ProtocolConfiguration
                .NETWORK_PARTICIPATION_PERCENTAGE,
            networkToChildAllocationPercentage: ProtocolConfiguration
                .NETWORK_TO_CHILD_ALLOCATION_PERCENTAGE,
            adminLegacyFeePercentage: ProtocolConfiguration
                .ADMIN_LEGACY_FEE_PERCENTAGE,
            adminRevokeFeePercentage: ProtocolConfiguration
                .ADMIN_REVOKE_FEE_PERCENTAGE,
            governancePercentageToTokensPercentage: ProtocolConfiguration
                .GOVERNANCE_PERCENTAGE_TO_TOKENS_PERCENTAGE,
            sponsorTokenRequirement: ProtocolConfiguration
                .SPONSOR_TOKEN_REQUIREMENT
        });

    mapping(uint256 => address) public tokens;
    /**
     * @notice Consiste à savoir quel network a créé ce token
     */
    mapping(address => address) public childTokenToNetworkTokens;
    mapping(address => address) public adminOf;
    mapping(address => address) public tokenOf;
    mapping(address => mapping(address => DataTypes.AdminRules))
        public particularRules;

    modifier onlyExist(address _token) {
        require(
            childTokenToNetworkTokens[_token] != address(0),
            Errors.CALLER_NOT_TOKEN
        );
        _;
    }

    constructor() Ownable(msg.sender) {
        TokenReputation iGenesisToken = _mint(
            msg.sender,
            GENESIS_NAME,
            GENESIS_SYMBOL,
            standardRules
        );
        genesisToken = address(iGenesisToken);
        iGenesisToken.transfer(
            msg.sender,
            iGenesisToken.balanceOf(address(this))
        );
    }

    /**
     * @notice recover rules of a token or an address for a network
     * @param _network  is the token where another token wishes to interact
     * @param _for is the token or address that wishes to interact with the network
     */

    function rulesOf(
        address _network,
        address _for
    )
        public
        view
        onlyExist(_network)
        returns (DataTypes.AdminRules memory rules)
    {
        rules = particularRules[_network][_for];

        if (_for == _network || rules.customRules) {
            return rules;
        } else {
            return standardRules;
        }
    }

    function mint(
        address _sponsored,
        string memory _name,
        string memory _symbol
    ) public onlyExist(msg.sender) returns (address) {
        DataTypes.AdminRules memory childRules = rulesOf(
            msg.sender,
            _sponsored
        );

        DataTypes.AdminRules memory networkRules = particularRules[msg.sender][
            msg.sender
        ];

        ITokenReputation networkToken = ITokenReputation(msg.sender);
        MintLogic.checkMintNetworkCapacity(childRules, networkToken);
        TokenReputation childToken = _mint(
            _sponsored,
            _name,
            _symbol,
            childRules
        );
        uint256 tokensRetainedByAdmin = childToken.balanceOf(address(this));

        uint256 networkAllocationToChild = (childRules.initialSupply *
            networkRules.networkToChildAllocationPercentage) / 100;
        // Network mine ses tokens et l'envoie à l'enfant pour engager sa réputation
        networkToken.mint(networkAllocationToChild);

        if (tokensRetainedByAdmin > 0) {
            uint256 networkParticipation = (tokensRetainedByAdmin *
                networkRules.networkParticipationPercentage) / 100;

            // Token really owned by owner
            childToken.transfer(
                adminOf[msg.sender],
                tokensRetainedByAdmin - networkParticipation
            );
            // TODO override addReserveSponsorFromFactory
            // Token locked on protocol. Only Network Admin and Token Admin can access
            // require(
            //     networkToken.transferFrom(
            //         address(this),
            //         address(childToken),
            //         networkParticipation
            //     ),
            //     "TokenReputationFactory: Transfer failed"
            // );

            childToken.approve(address(networkToken), networkParticipation);
            networkToken.addReserveSponsorFromFactory(
                address(networkToken),
                address(childToken),
                networkParticipation
            );

            networkToken.approve(address(childToken), networkAllocationToChild);
            childToken.addReserveSponsorFromFactory(
                address(childToken),
                address(networkToken),
                networkAllocationToChild
            );
        }
        return address(childToken);
    }

    function _mint(
        address _owner,
        string memory _name,
        string memory _symbol,
        DataTypes.AdminRules memory _rules
    ) internal returns (TokenReputation) {
        require(
            tokenOf[_owner] == address(0),
            Errors.ADDRESS_ALREADY_OWN_TOKEN
        );
        TokenReputation newToken = new TokenReputation(
            _owner,
            _name,
            _symbol,
            _rules
        );
        address tokenAddress = address(newToken);
        address networkAddress;

        childTokenToNetworkTokens[tokenAddress] = tokensLength == 0
            ? address(this)
            : msg.sender;
        // newToken.approve(address(this), type(uint256).max);
        tokens[tokensLength] = tokenAddress;
        adminOf[tokenAddress] = _owner;
        tokenOf[_owner] = tokenAddress;

        _rules.customRules = true;
        // Rules are indexed in own address
        particularRules[tokenAddress][tokenAddress] = _rules;
        tokensLength += 1; // TODO check if need openzeppelin counter with latest sol version
        emit DataTypes.NewTokenOnboarded(
            tokenAddress,
            msg.sender,
            _rules.initialSupply
        );
        return newToken;
    }

    function transferTokenToAnotherPool(
        address _currentPoolNetwork,
        address _newPoolNetwork,
        uint _amount
    ) external onlyExist(_currentPoolNetwork) onlyExist(_newPoolNetwork) {
        address tokenReputation = tokenOf[msg.sender];
        require(tokenReputation != address(0), Errors.CALLER_NOT_OWN_TOKEN);
        ITokenReputation(_currentPoolNetwork).withdrawReputationFromFactory(
            tokenReputation,
            _newPoolNetwork,
            _amount
        );
    }

    function setRules(
        DataTypes.AdminRules memory _rules,
        address _sponsored
    ) public {
        // TODO Permettre de modifier ses rules qui n'ont pas à être immuable
        require(
            _sponsored != msg.sender && tokenOf[msg.sender] != _sponsored,
            Errors.CALLER_USE_INVALID_ARGUMENT
        );
        MintLogic.checkRules(_rules);
        address forToken;
        if (msg.sender == owner()) {
            forToken = genesisToken;
        } else {
            forToken = tokenOf[msg.sender];
            require(forToken != address(0), Errors.CALLER_NOT_OWN_TOKEN);
        }
        _rules.customRules = true;
        particularRules[forToken][_sponsored] = _rules;
    }
}
