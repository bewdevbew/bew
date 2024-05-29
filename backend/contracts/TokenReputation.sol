// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./interfaces/ITokenReputation.sol";
import "./interfaces/ITokenReputationFactory.sol";
import {DataTypes} from "./libraries/DataTypes.sol";
import {Events} from "./libraries/Events.sol";
import {Errors} from "./libraries/helpers/Errors.sol";
//? TODO corriger l'énorme faille de sécurité du _owner dans le constructeur.
// TODO corriger l'énorme faille de sécurité du sponsor if TokenNetwork est dans la pool token reputation du smart contract

contract TokenReputation is ERC20, Ownable {
    event NewTokenOnboarded(
        address indexed token,
        address indexed to,
        uint256 value
    );

    string public dataURI;
    string public baseTokenURI;
    /**
     * @notice Représente le nombre de token réputation créé par ce network
     * Ce chiffre est uniquement incrémental et peut être déterminant pour
     * l'attribution de certaines récompenses ou avantages dans certains Network
     */
    uint256 public legacyLength;

    /**
     * @notice Représente la factory qui a déployé ce smart contract
     * Le protocole ZeroDay ne reconnait que l'address de sa propre factory
     * mais certains protocoles peuvent accepter des factorys tierces
     */
    address public factory;
    ITokenReputationFactory immutable iFactory;

    /**
     * @notice Représente le nombre maximum de token réputation que ce network peut miné
     * Dès lors que la MAX_SUPPLY est atteinte, le network ne peut plus onboardé de nouveau token de réputation
     */
    uint256 public immutable MAX_SUPPLY;

    /**
     * @notice Représente le délai minimum entre chaque claim d'Airdrop
     * Ce délai est mis en place pour éviter les abus de claim d'Airdrop
     * Chaque address remplissant les conditions peut claim un airdrop pour
     * un token ERC20 ou ETH mais doit attendre 30 jours avant de pouvoir
     * en reclamer un autre pour ce même token.
     *
     * Une address peut donc claim plusieurs token le même jour mais jamais
     * le même token plus d'une fois par mois
     *
     * @dev Ce délai est fixe et ne peut être modifié
     *
     */
    uint256 public constant AIRDROP_DELAY = 30 days;

    /**
     * @notice Représente le nombre de token réputation que ce network a en réserve
     * pour récompenser les address de son network
     *
     * Les tokens en réserve peuvent être utilisé pour les airdrops mais sont
     * également à disposition de l'ADMIN du réseau pour n'importe quel usage
     * comme participer à un autre réseau
     *
     * L'intérêt de déposer des tokens dans cette pool est uniquement de participer
     * au développement du réseau, de signaler à l'ADMIN que vous souhaiter intégrer
     * ce NETWORK, voir de pouvoir profiter des AIRDROP arbitraire organisé par l'ADMIN.
     *
     * L'ADMIN du réseau a également la possibilité d'ouvrir le réseau pour tout ceux qui
     * ont déposé un montant minimum d'ETH dans cette pool.
     *
     * @dev Contrairement aux autres pools, les tokens en réserve ne sont pas
     * accessible par ceux qui les ont déposé.
     *
     * poolTokensForGovernance[address] Adresse du token ERC20 ou 0x0 pour ETH
     * uint256 Montant de token déposé
     */
    mapping(address => uint256) public poolTokensForGovernance;

    /**
     * @notice Représente la balance de TokenReputation que chaque address a dans ce NETWORK
     * Cette pool est accessible uniquement pour les tokens que l'ADMIN autorise à l'intégrer
     * Chaque ADMIN des TokenReputation en réserve peuvent à tout moment retirer leur token
     * de cette pool pour les envoyer sur un autre réseau ou simplement les rappatrier vers leurs wallet.
     *
     * En revanche, chaque révocation peut entraîner des frais de révocation envoyer vers l'ADMIN du NETWORK
     *
     * @dev Le caller peut déposer uniquement ses tokenOf(caller) dans cette pool
     *
     * poolTokensReputation[address] Adresse du TokenReputation. Seul les tokens reconnu par la factory peuvent y être déposé
     * uint256 Montant de TokenReputation déposé
     */
    mapping(address => uint256) public poolTokensReputation;

    /**
    * @notice Représente la balance de token ERC20 que chaque address a dans ce NETWORK
    * Comme pour la pool de reputation, seul les tokens autorisé dans ce NETWORK peuvent être déposé
    * dans cette pool.
    * 
    * Contraiement à la pool de reputation, les tokens déposé dans cette pool sont accessible par
    * l'ADMIN (caller) du TokenReputation & l'ADMIN(owner) du NETWORK mais également par l'ADMIN du TokenReputation 
    * déposé. Ces 3 addresses y ont accès à tout moment & là aussi des frais seront transféré à l'ADMIN du NETWORK
    * en cas de révocation.
    *
    * Si le caller a accès à cette pool alors il peut déposer n'importe quel token ERC20
    * 
    * @dev poolTokensForSponsor[address]:Adresse du TokenReputation. Seul les tokens reconnu par la factory peuvent y accéder
    // TODO à vérifier
    // TODO 0x0 pour ETH
    * @dev poolTokensForSponsor[address][address]: Address du token ERC20. Tout les tokens peuvent y être déposé
    *
     */
    mapping(address => mapping(address => uint256)) public poolTokensForSponsor;

    /**
     * @notice Représente la liste des address bannis de ce NETWORK
     * Les address bannis ne peuvent plus intéragir avec ce NETWORK si ce n'est avec les fonctions de
     * l'interface ERC20 ou le dépot de token dans la gouvernance.
     *
     * L'ADMIN du NETWORK peut à tout moment révoquer le ban d'une address
     *
     * L'ADMIN du NETWORK peut à tout moment bannir une address qui participe déjà à ce NETWORK
     * Le banissement d'un participant l'empêcheras d'accéder au AIRDROP de la pool de gouvernance,
     * de déposer des tokens dans la pool de reputation ou de sponsor, mais pourras malgré tout retirer
     * ses tokens des pools auxquels il aura participer.
     *
     *
     * @dev isBanned[address]: Adresse du bannis. Peut représenter un wallet mais également un Token
     */
    mapping(address => bool) public isBanned;

    /**
     * @notice Représente le dernier claim d'Airdrop de token pour chaque address
     * Chaque address peut claim un airdrop pour un token ERC20 ou ETH mais doit attendre 30 jours
     * avant de pouvoir en reclamer un autre pour ce même token.
     *
     *
     * Une address peut donc claim plusieurs token le même jour mais jamais le même token plus d'une fois par mois
     *
     * @dev lastAirdropClaimed[address]: Adresse de l'address qui a claim l'airdrop
     * @dev lastAirdropClaimed[address][address]: Adresse du token ERC20 ou 0x0 pour ETH
     * @dev uint256: Timestamp du dernier claim
     */
    mapping(address => mapping(address => uint256)) public lastAirdropClaimed;

    modifier onlyFactory() {
        require(msg.sender == factory, Errors.CALLER_NOT_FACTORY);
        _;
    }

    // TODO Permettre l'acces au réseau à tout les tokens où le réseau est lui même intégré à ses tokens
    modifier onlyAllowed(address _network, address _token) {
        require(
            poolTokensReputation[_network] > 0 ||
                poolTokensForSponsor[_network][_token] > 0 ||
                poolTokensForSponsor[address(this)][_network] > 0,
            Errors.NETWORK_NOT_ALLOWED
        );
        _;
    }

    modifier onlyAdminOf(address _token) {
        // TODO Faire une fonction dans la factory pour révoquer l'admin si balanceOf(caller) a > totalSupply/2
        require(_adminOf(_token) == msg.sender, Errors.CALLER_NOT_ADMIN);
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

    /**
     * @notice Le TokenReputation est créé depuis la factory. C'est elle qui renseigne les informations
     * Le METANETWORK peut récupérer des frais de création de token en fonction des règles qu'il aura 
     * lui même établis et qui s'applique sur l'initialSupply.
     * Le reste de l'initialSupply est conservé par le contrat dans la pool de réputation de l'admin
     * L'ADMIN pourras accéder à ses tokens à tout moment afin de les retirer et d'en profiter comme bon lui semble
     *
     * @dev Le TokenReputation supporte l'interface ERC20, Ownable & TokenReputation
     * * ERC20:
     *    * - name & symbol: Nom et symbole du token ERC20
     *    * - initialSupplu: Total de token ERC20 préminé
     *    * - maxSupply: Total de token ERC20 maximum que le NETWORK peut miné
     // TODO Retirer Ownable si pas besoin
     * * Ownable:
     *    * - owner: Adresse du propriétaire du smart contract. Le Owner représente le déployer original
     * * TokenReputation:
     *    * - factory: Adresse de la factory qui a déployé ce smart contract
     *    * - rules: Règles établis par le METANETWORK pour ce TokenReputation
     */
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

        if (mintedFees > 0) {
            _mint(msg.sender, mintedFees); // Factory send the total supply to the owner after deployment
        }
        _mint(address(this), _rules.initialSupply - mintedFees);
        poolTokensReputation[address(this)] +=
            _rules.initialSupply -
            mintedFees;

        MAX_SUPPLY = _rules.maxSupply;
        emit NewTokenOnboarded(address(this), _owner, _rules.initialSupply);
    }

    /**
     * @notice Fonction pour récupérer les informations onchain relatif au TokenReputation
     */

    function getInfo() external view returns (DataTypes.TokenInfo memory) {
        address admin = _adminOf(address(this));
        return
            DataTypes.TokenInfo({
                admin: admin,
                networkToken: iFactory.childTokenToNetworkTokens(address(this)),
                name: name(),
                balanceAdmin: balanceOf(admin),
                balanceNetwork: poolTokensReputation[address(this)],
                symbol: symbol(),
                legacy: legacyLength,
                totalSupply: totalSupply(),
                rules: rules()
            });
    }

    /**
     * @notice Fonction pour récupérer les informations onchain relatif à l'interaction
     * d'un TokenReputation avec un autre TokenReputation
     *
     * Prenons l'exemple avec :
     * - Token Alice (A) correspond à this token
     * - Token Bob (B) correspond à _token
     */

    function getInfoInteraction(
        address _token
    )
        external
        view
        returns (
            // DataTypes.TokenInteraction memory thisTokenFromTarget,
            DataTypes.TokenInteraction memory
        )
    {
        address adminOfTarget = _adminOf(_token);
        ITokenReputation iToken = ITokenReputation(_token);

        // thisTokenFromTarget = DataTypes.TokenInteraction({
        //     balanceToken: balanceOf(_token),
        //     balanceSponsor: iToken.poolTokensForSponsor(_token, address(this)),
        //     balanceGovernance: iToken.poolTokensForGovernance(address(this)),
        //     balanceReputation: iToken.poolTokensReputation(address(this)),
        //     balanceAdmin: balanceOf(adminOfTarget)
        // });

        return
            DataTypes.TokenInteraction({
                // Retourne la balance de Token Alice dans le contrat de Bob
                balanceToken: balanceOf(_token),
                // Retourne la balance d'Alice des tokens de Bob dans la pool sponsor du contrat d'Alice
                balanceSponsorByAdmin: poolTokensForSponsor[address(this)][
                    _token
                ],
                // Retourne la balance de tokens Alice dans la pool de Bob au sein du contrat d'Alice
                balanceSponsorByToken: poolTokensForSponsor[_token][
                    address(this)
                ],
                // Retourne la balance de tokens Bob dans la gouvernance du contrat d'Alice
                balanceGovernance: poolTokensForGovernance[_token],
                // Retourne la balance de tokens Bob dans la pool de réputation du contrat d'Alice
                balanceReputation: poolTokensReputation[_token],
                balanceAdmin: balanceOf(adminOfTarget)
            });
    }

    // function isContract(address _addr) private view returns (bool) {
    //     uint32 size;
    //     assembly {
    //         size := extcodesize(_addr)
    //     }
    //     return (size > 0);
    // }

    function _adminOf(address _token) internal view returns (address) {
        return iFactory.adminOf(_token);
    }

    /**
     * @notice Fonction pour récupérer les règles établis par le METANETWORK pour ce TokenReputation
     * @return DataTypes.AdminRules Règles prévu au sein de la factory pour ce TokenReputation
     */
    function rules() public view returns (DataTypes.AdminRules memory) {
        return iFactory.rulesOf(address(this), address(this));
    }

    /**
     * @notice Function to mint a new token reputation for a participant
     * and integrate it into the network
     *
     * @dev This function is call factory to mint a new token reputation
     * Cette fonction ne peut être utilisé que par l'ADMIN du NETWORK
     *
     * @param _for The address of the participant to mint the token for
     * @param _name The name of the new token reputation
     * @param _symbol The symbol of the new token reputation
     *
     * @return The address of the new token reputation
     */

    // TODO mint de la supply également pour l'ADMIN au taux de 1 pour 1
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

    function onboardParticipant(
        address _for,
        string calldata _name,
        string calldata _symbol
    ) public onlyAdminOf(address(this)) returns (address) {
        return _onboardParticipant(_for, _name, _symbol);
    }

    /**
     * @notice Cette fonction permet d'onboarder un participant avec des règles
     * de mint personnalisé
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

    /**
     * @notice Fonction pour miner des tokens et augmenter la supply du TokenReputation
     * @dev Cette fonction ne peut être utilisé que par la factory.
     * Elle est appelé par FactoryTokenReputation.mint à la suite d'un onboardParticipant
     */

    // TODO tester le mint pour admin
    function mint(uint _amount) public onlyFactory {
        require(
            MAX_SUPPLY >= totalSupply() + (_amount * 2),
            Errors.OVERFLOW_MAX_SUPPLY
        );
        _mint(factory, _amount);
        _mint(address(this), _amount);
        poolTokensReputation[address(this)] += _amount;
    }

    /**
     * @notice Fonction pour retirer des tokens ERC20 de la pool sponsor
     * @dev Cette fonction peut être utilisé par : 
     //TODO remplacer sponsor par token
     //TODO autoriser l'ADMIN du NETWORK a accéder au token
     //TODO permettre le retrait d'ETH en passant par 0x0
     *  * - Le sponsor
     *  * - L'ADMIN du token ERC20 si celui-ci est un token de réputation reconnu par la factory
     *  * - L'ADMIN du sponsor si celui-ci est un token de réputation reconnu par la factory
    
     * @param _sponsor Peut être un token reputation ou une address
     * @param _erc20 Adresse du token ERC20. Peut également être un token de réputation
     * @param _amount Montant de token à retirer
     */

    function withdrawSponsorshipToken(
        address _sponsor,
        address _erc20,
        uint _amount
    ) external {
        require(
            msg.sender == _sponsor ||
                _adminOf(_erc20) == msg.sender ||
                _adminOf(_sponsor) == msg.sender,
            Errors.CALLER_CANT_USE_FUNCTION
        );
        require(
            poolTokensForSponsor[_sponsor][_erc20] >= _amount,
            Errors.INSUFFICIENT_BALANCE
        );
        poolTokensForSponsor[_sponsor][_erc20] -= _amount;
        ERC20(_erc20).transfer(msg.sender, _amount);
        emit Events.WithdrawSponsorship(_erc20, msg.sender, _amount);
    }

    /**
     * @notice Fonction pour retirer des tokens ERC20 de la pool sponsor
     //TODO remplacer sponsor par token
     //TODO autoriser l'ADMIN du NETWORK a accéder au token
     //TODO permettre le retrait d'ETH en passant par 0x0
     * @dev Cette fonction peut être utilisé par : 
     *  * - Le sponsor
     *  * - L'ADMIN du token ERC20 si celui-ci est un token de réputation reconnu par la factory
     *  * - L'ADMIN du sponsor si celui-ci est un token de réputation reconnu par la factory
     *
     * @param _for Peut être un token reputation ou une address
     * @param _erc20 Adresse du token ERC20. Peut également être un token de réputation
     * @param _amount Montant de token à retirer
     */

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
        emit Events.DepositSponsorship(_erc20, _for, _amount);
    }

    /**
     * @notice Permet de déposer des tokens ERC20 afin de récompenser la gouvernance
     * Cette fonction n'a pas d'autre utilité que de permettre à signaler à l'ADMIN
     * que vous souhaitez intégrer ce NETWORK.
     *
     * En revance des tokens peuvent construire des règles autour afin de permettre un intérêt
     *
     *
     * @dev La fonction est accessible par n'importe quel address Ethereum
     *
     * @param _erc20 Adresse du token ERC20
     * @param _amount Montant de token déposé
     */

    function depositOnGovernance(address _erc20, uint _amount) external {
        require(ERC20(_erc20).transferFrom(msg.sender, address(this), _amount));
        poolTokensForGovernance[_erc20] += _amount;
        emit Events.DepositOnGovernance(msg.sender, _erc20, _amount);
    }

    /**
     * @notice Permet de déposer des ETH afin de récompenser la gouvernance
     * L'ADMIN peu choisir d'ouvrir le réseau à tout ceux qui ont déposé un montant minimum
     * qu'il aura lui même défini
     *
     * @dev La balance ETH est stocké dans la pool de gouvernance à l'adresse 0x0
     *
     // TODO Ouvrir la pool réputation si msg.value > x
     */
    function depositETHOnGovernance() external payable {
        require(msg.value > 0, Errors.AMOUNT_CANT_BE_ZERO);
        poolTokensForGovernance[address(0)] += msg.value;
        emit Events.DepositOnGovernance(msg.sender, address(0), msg.value);
    }

    /**
     * @notice Permet de réclamer des tokens de la pool de gouvernance
     *
     * @dev Cette fonction est accessible par toutes les TokenReputation
     * ayant accès au NETWORK
     *
     */

    function claimAirdrop(address _erc20) external {
        require(poolTokensReputation[_erc20] > 0, Errors.INSUFFICIENT_BALANCE);
        require(
            lastAirdropClaimed[msg.sender][_erc20] + AIRDROP_DELAY <
                block.timestamp,
            Errors.CALLER_CANT_USE_FUNCTION
        );
        lastAirdropClaimed[msg.sender][_erc20] = block.timestamp;
        // TODO Faire en fonction du token price
        uint256 amount = poolTokensReputation[_erc20] / 100;
        poolTokensReputation[_erc20] -= amount;
        if (_erc20 == address(0)) {
            payable(msg.sender).transfer(amount);
        } else {
            ERC20(_erc20).transfer(msg.sender, amount);
        }
    }

    /**
     * @dev Function to deposit reputation tokens to the contract
     * @notice This function is only callable by token reputation contract. It's called from withdrawReputationFromFactory
     * @param _amount can be smaller than withdrawReputationFromFactory in case of admin fee
     */
    function depositReputation(uint256 _amount) public returns (bool) {
        return _depositReputation(msg.sender, _amount);
    }

    function depositReputationFromWallet(uint _amount) public returns (bool) {
        return _depositReputation(iFactory.tokenOf(msg.sender), _amount);
    }

    function transferReputation(
        address _from,
        uint256 _amount
    ) public returns (bool) {
        require(_adminOf(msg.sender) != address(0), Errors.CALLER_NOT_TOKEN);
        _transfer(_from, msg.sender, _amount);
        return true;
    }

    function _depositReputation(
        address _from,
        uint256 _amount
    ) public returns (bool) {
        require(!isBanned[_from], Errors.CALLER_IS_BANNED);
        require(_adminOf(_from) != address(0), Errors.CALLER_NOT_TOKEN);
        require(_amount > 0, Errors.AMOUNT_CANT_BE_ZERO);
        require(
            ITokenReputation(_from).transferReputation(msg.sender, _amount)
        );

        poolTokensReputation[_from] += _amount;
        emit Events.DepositReputation(_from, _amount);
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
    )
        public
        onlyFactory
        onlyAllowed(_toNewNetwork, _token)
        returns (uint256 netAmount)
    {
        require(
            _toNewNetwork != address(this),
            Errors.CALLER_USE_INVALID_ARGUMENT
        );
        require(
            poolTokensReputation[_token] >= _amount,
            Errors.INSUFFICIENT_BALANCE
        );

        address admin = _adminOf(_token);
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

        if (feeAmount > 0) iToken.transfer(_adminOf(address(this)), feeAmount);
    }

    /**
     * @notice Permet de transférer des TokenReputation vers son wallet
     */
    function withdrawReputation(uint256 _amount) public {
        address token = iFactory.tokenOf(msg.sender);
        require(token != address(0), Errors.CALLER_NOT_OWN_TOKEN);
        require(
            poolTokensReputation[token] >= _amount,
            Errors.INSUFFICIENT_BALANCE
        );
        DataTypes.AdminRules memory _rules = iFactory.rulesOf(
            address(this),
            token
        );
        uint256 feeAmount = (_amount * _rules.adminRevokeFeePercentage) / 100;
        uint256 netAmount = _amount - feeAmount;
        poolTokensReputation[token] -= _amount;
        if (token != address(this)) {
            netAmount = _amount;
            feeAmount = 0;
        }
        ITokenReputation iToken = ITokenReputation(token);
        iToken.transfer(msg.sender, netAmount);
        if (feeAmount > 0) iToken.transfer(_adminOf(address(this)), feeAmount);
    }

    /**
     * @notice Permet de transférer des tokens de réputation d'un NETWORK à un autre
     *
     * @dev Cette fonction est accessible uniquement par les TokenReputation étant
     * autorisé à accéder au NETWORK
     *
     * @param _toToken Adresse du TokenReputation de destination
     * @param _amount Montant de token à transférer
     */
    // TODO géré l'acces au réseau
    function transferOnPoolReputation(
        address _toToken,
        uint256 _amount
    ) public returns (bool) {
        ITokenReputation iToken = ITokenReputation(_toToken);
        require(balanceOf(msg.sender) >= _amount, Errors.INSUFFICIENT_BALANCE);
        require(!iToken.isBanned(address(this)), Errors.CALLER_IS_BANNED);
        _approve(msg.sender, _toToken, _amount);
        iToken.depositReputationFromWallet(msg.sender, _amount);
    }

    // ? Est ce que je dois permettre un transfer by admin pour la pool token reputation
    // ? Peut être faire une règle pour plus de flexibilité et de protection
    function transferReputationByAdmin(
        address _token,
        address _to,
        uint256 _amount
    ) public onlyAdminOf(address(this)) {
        require(
            poolTokensReputation[_token] >= _amount,
            Errors.INSUFFICIENT_BALANCE
        );
        poolTokensReputation[_token] -= _amount;
        // ? Est ce que je dois permettre un revoke fee to adminOf(_token)
        ITokenReputation(_token).transfer(_to, _amount);
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
