// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract BaseNFT1 is ERC721, Ownable {
    uint256 private _currentTokenId;

    struct Traits {
        uint8 strength;
        uint8 agility;
        string species;
    }

    mapping(uint256 => Traits) public tokenTraits;

    // Events
    event BaseNFT1Deployed(address indexed deployer, string name, string symbol);
    event BaseNFT1Minted(
        uint256 indexed tokenId,
        address indexed owner,
        uint8 strength,
        uint8 agility,
        string species
    );

    constructor() ERC721("BaseNFT1", "BN1") Ownable(msg.sender) {
        emit BaseNFT1Deployed(msg.sender, "BaseNFT1", "BN1");
    }

    function mint(uint8 _strength, uint8 _agility, string memory _species) public {
        _currentTokenId += 1;
        uint256 newTokenId = _currentTokenId;
        
        tokenTraits[newTokenId] = Traits(_strength, _agility, _species);
        _safeMint(msg.sender, newTokenId);

        emit BaseNFT1Minted(
            newTokenId,
            msg.sender,
            _strength,
            _agility,
            _species
        );
    }

    function getTraits(uint256 tokenId) public view returns (Traits memory) {
        return tokenTraits[tokenId];
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _currentTokenId;
    }
}

contract BaseNFT2 is ERC721, Ownable {
    uint256 private _currentTokenId;

    struct Traits {
        uint8 magic;
        uint8 intelligence;
        string element;
    }

    mapping(uint256 => Traits) public tokenTraits;

    // Events
    event BaseNFT2Deployed(address indexed deployer, string name, string symbol);
    event BaseNFT2Minted(
        uint256 indexed tokenId,
        address indexed owner,
        uint8 magic,
        uint8 intelligence,
        string element
    );

    constructor() ERC721("BaseNFT2", "BN2") Ownable(msg.sender) {
        emit BaseNFT2Deployed(msg.sender, "BaseNFT2", "BN2");
    }

    function mint(uint8 _magic, uint8 _intelligence, string memory _element) public {
        _currentTokenId += 1;
        uint256 newTokenId = _currentTokenId;
        
        tokenTraits[newTokenId] = Traits(_magic, _intelligence, _element);
        _safeMint(msg.sender, newTokenId);

        emit BaseNFT2Minted(
            newTokenId,
            msg.sender,
            _magic,
            _intelligence,
            _element
        );
    }

    function getTraits(uint256 tokenId) public view returns (Traits memory) {
        return tokenTraits[tokenId];
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _currentTokenId;
    }
}

contract MutantNFT is ERC721, Ownable {
    uint256 private _currentTokenId;

    BaseNFT1 public baseNFT1;
    BaseNFT2 public baseNFT2;

    struct MutantTraits {
        uint8 strength;
        uint8 agility;
        uint8 magic;
        uint8 intelligence;
        string species;
        string element;
    }

    mapping(uint256 => MutantTraits) public mutantTraits;
    mapping(uint256 => bool) public hasBeenMerged;

    // Events
    event MutantNFTDeployed(
        address indexed deployer,
        address indexed baseNFT1Address,
        address indexed baseNFT2Address
    );
    
    event MutantCreated(
        uint256 indexed newTokenId,
        uint256 indexed baseToken1Id,
        uint256 indexed baseToken2Id,
        address owner,
        MutantTraits traits
    );

    event TokensMerged(
        uint256 indexed token1Id,
        uint256 indexed token2Id,
        uint256 indexed newTokenId
    );

    constructor(address _baseNFT1Address, address _baseNFT2Address) 
        ERC721("MutantNFT", "MNFT") 
        Ownable(msg.sender) 
    {
        baseNFT1 = BaseNFT1(_baseNFT1Address);
        baseNFT2 = BaseNFT2(_baseNFT2Address);
        
        emit MutantNFTDeployed(msg.sender, _baseNFT1Address, _baseNFT2Address);
    }

    function merge(uint256 token1Id, uint256 token2Id) public {
        require(baseNFT1.ownerOf(token1Id) == msg.sender, "Not owner of token1");
        require(baseNFT2.ownerOf(token2Id) == msg.sender, "Not owner of token2");
        require(!hasBeenMerged[token1Id], "Token1 already merged");
        require(!hasBeenMerged[token2Id], "Token2 already merged");
        require(token1Id <= baseNFT1.getCurrentTokenId(), "Token1 does not exist");
        require(token2Id <= baseNFT2.getCurrentTokenId(), "Token2 does not exist");

        BaseNFT1.Traits memory traits1 = baseNFT1.getTraits(token1Id);
        BaseNFT2.Traits memory traits2 = baseNFT2.getTraits(token2Id);

        _currentTokenId += 1;
        uint256 newTokenId = _currentTokenId;

        MutantTraits memory newTraits = MutantTraits(
            traits1.strength,
            traits1.agility,
            traits2.magic,
            traits2.intelligence,
            traits1.species,
            traits2.element
        );

        mutantTraits[newTokenId] = newTraits;
        hasBeenMerged[token1Id] = true;
        hasBeenMerged[token2Id] = true;

        _safeMint(msg.sender, newTokenId);
        
        emit MutantCreated(
            newTokenId,
            token1Id,
            token2Id,
            msg.sender,
            newTraits
        );

        emit TokensMerged(token1Id, token2Id, newTokenId);
    }

    function getMutantTraits(uint256 tokenId) public view returns (MutantTraits memory) {
        require(tokenId <= _currentTokenId, "Token does not exist");
        return mutantTraits[tokenId];
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _currentTokenId;
    }
}
