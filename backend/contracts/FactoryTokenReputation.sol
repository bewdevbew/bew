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
            initialChildSupply: ProtocolConfiguration.INITIAL_CHILD_SUPPLY,
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

    function mint(
        address _sponsored,
        uint256 _amount,
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
        if (
            _amount != childRules.initialSupply &&
            _amount <= childRules.maxSupply
        ) {
            childRules.initialSupply = _amount;
        }

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
            "TokenReputationFactory: Address already have his token"
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
        require(
            tokenReputation != address(0),
            "TokenReputationFactory: Caller must admin a token"
        );
        ITokenReputation(_currentPoolNetwork).withdrawReputationFromFactory(
            tokenReputation,
            _newPoolNetwork,
            _amount
        );
    }

    function setRules(
        address _sponsored,
        DataTypes.AdminRules memory _rules
    ) public {
        // TODO Permettre de modifier ses rules qui n'ont pas à être immuable
        require(
            _sponsored != msg.sender || tokenOf[msg.sender] != _sponsored,
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
}
