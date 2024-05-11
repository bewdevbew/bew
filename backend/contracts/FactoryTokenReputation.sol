// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import {MintLogic} from "./libraries/logic/MintLogic.sol";
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
            "TokenReputationFactory: Only token can call this function"
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

    function rulesOf(
        address _network,
        address _for
    )
        public
        view
        onlyExist(_network)
        returns (DataTypes.AdminRules memory rules)
    {
        if (_for == _network) {
            return particularRules[_network][_for];
        } else if (particularRules[_network][_for].customRules) {
            return particularRules[_network][_for];
        } else {
            return standardRules;
        }
    }

    // TODO je m'emboube entre network rules et child rules dans les différents contrat. Bien vérifier si la logique appliqué est la bonne
    function mint(
        address _sponsored,
        string memory _name,
        string memory _symbol
    ) public returns (address) {
        require(
            msg.sender == genesisToken ||
                childTokenToNetworkTokens[msg.sender] != address(0),
            "TokenReputationFactory: Only genesis token or child token can mint new token"
        );

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

        // Network mine ses tokens et l'envoie à l'enfant pour engager sa réputation
        networkToken.mint(
            (childRules.initialSupply *
                networkRules.networkToChildAllocationPercentage) / 100
        );

        if (tokensRetainedByAdmin > 0) {
            uint256 networkParticipation = (tokensRetainedByAdmin *
                networkRules.networkParticipationPercentage) / 100;
            // Token really owned by owner
            childToken.transfer(
                owner(),
                tokensRetainedByAdmin - networkParticipation
            );
            // TODO override addReserveSponsorFromFactory
            // Token locked on protocol. Only Network Admin and Token Admin can access
            networkToken.addReserveSponsorFromFactory(
                adminOf[msg.sender],
                address(childToken),
                networkParticipation
            );
            childToken.addReserveSponsorFromFactory(
                adminOf[address(networkToken)],
                address(networkToken),
                childRules.initialSupply - tokensRetainedByAdmin
            );
        }
    }

    function addParticularRules(
        address _sponsored,
        DataTypes.AdminRules memory _rules
    ) public {
        // TODO Permettre de modifier ses rules qui n'ont pas à être immuable
        require(
            _sponsored != msg.sender,
            "TokenReputationFactory: Own rules can't be set"
        );
        MintLogic.checkRules(_rules);
        address forToken;
        if (msg.sender == owner()) {
            forToken = genesisToken;
        } else {
            forToken = tokenOf[msg.sender];
        }
        require(
            forToken != address(0),
            "TokenReputationFactory: Rules can be set only by admin of token"
        );
        particularRules[forToken][_sponsored] = _rules;
    }

    function _mint(
        address _owner,
        string memory _name,
        string memory _symbol,
        DataTypes.AdminRules memory _rules
    ) internal returns (TokenReputation) {
        require(
            tokenOf[_owner] == address(0),
            "TokenReputationFactory: Address already have his token"
        );
        TokenReputation newToken = new TokenReputation(
            _owner,
            _name,
            _symbol,
            _rules
        );
        address tokenAddress = address(newToken);
        childTokenToNetworkTokens[tokenAddress] = tokensLength == 0
            ? address(this)
            : msg.sender;
        // newToken.approve(address(this), type(uint256).max);
        tokens[tokensLength] = tokenAddress;
        adminOf[tokenAddress] = _owner;
        tokenOf[_owner] = tokenAddress;

        childTokenToNetworkTokens[tokenAddress] = _owner;
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
}
