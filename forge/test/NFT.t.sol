// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/NFT.sol";

contract NFTTest is Test {
    BaseNFT1 public baseNFT1;
    BaseNFT2 public baseNFT2;
    MutantNFT public mutantNFT;
    
    address public owner;
    address public addr1;
    address public addr2;

    event BaseNFT1Deployed(address indexed deployer, string name, string symbol);
    event BaseNFT2Deployed(address indexed deployer, string name, string symbol);
    event MutantNFTDeployed(address indexed deployer, address indexed baseNFT1Address, address indexed baseNFT2Address);
    event BaseNFT1Minted(uint256 indexed tokenId, address indexed owner, uint8 strength, uint8 agility, string species);
    event BaseNFT2Minted(uint256 indexed tokenId, address indexed owner, uint8 magic, uint8 intelligence, string element);
    event MutantCreated(uint256 indexed newTokenId, uint256 indexed baseToken1Id, uint256 indexed baseToken2Id, address owner, MutantNFT.MutantTraits traits);
    event TokensMerged(uint256 indexed token1Id, uint256 indexed token2Id, uint256 indexed newTokenId);

    function setUp() public {
        owner = address(this);
        addr1 = makeAddr("addr1");
        addr2 = makeAddr("addr2");

        // Deploy contracts
        baseNFT1 = new BaseNFT1();
        baseNFT2 = new BaseNFT2();
        mutantNFT = new MutantNFT(address(baseNFT1), address(baseNFT2));
    }

    function testBaseNFT1Deployment() public {
        assertEq(baseNFT1.name(), "BaseNFT1");
        assertEq(baseNFT1.symbol(), "BN1");
    }

    function testBaseNFT1Minting() public {
        vm.startPrank(addr1);
        
        vm.expectEmit(true, true, false, true);
        emit BaseNFT1Minted(1, addr1, 80, 70, "Wolf");
        baseNFT1.mint(80, 70, "Wolf");

        BaseNFT1.Traits memory traits = baseNFT1.getTraits(1);
        assertEq(traits.strength, 80);
        assertEq(traits.agility, 70);
        assertEq(traits.species, "Wolf");
        assertEq(baseNFT1.getCurrentTokenId(), 1);

        vm.stopPrank();
    }

    function testBaseNFT2Deployment() public {
        assertEq(baseNFT2.name(), "BaseNFT2");
        assertEq(baseNFT2.symbol(), "BN2");
    }

    function testBaseNFT2Minting() public {
        vm.startPrank(addr1);
        
        vm.expectEmit(true, true, false, true);
        emit BaseNFT2Minted(1, addr1, 90, 85, "Fire");
        baseNFT2.mint(90, 85, "Fire");

        BaseNFT2.Traits memory traits = baseNFT2.getTraits(1);
        assertEq(traits.magic, 90);
        assertEq(traits.intelligence, 85);
        assertEq(traits.element, "Fire");
        assertEq(baseNFT2.getCurrentTokenId(), 1);

        vm.stopPrank();
    }

    function testMergeNFTs() public {
        // Setup
        vm.startPrank(addr1);
        baseNFT1.mint(80, 70, "Wolf");
        baseNFT2.mint(90, 85, "Fire");
        
        baseNFT1.approve(address(mutantNFT), 1);
        baseNFT2.approve(address(mutantNFT), 1);

        vm.expectEmit(true, true, true, true);
        MutantNFT.MutantTraits memory expectedTraits = MutantNFT.MutantTraits(
            80, 70, 90, 85, "Wolf", "Fire"
        );
        emit MutantCreated(1, 1, 1, addr1, expectedTraits);
        
        mutantNFT.merge(1, 1);

        MutantNFT.MutantTraits memory traits = mutantNFT.getMutantTraits(1);
        assertEq(traits.strength, 80);
        assertEq(traits.agility, 70);
        assertEq(traits.magic, 90);
        assertEq(traits.intelligence, 85);
        assertEq(traits.species, "Wolf");
        assertEq(traits.element, "Fire");
        
        vm.stopPrank();
    }

    function testFailUnauthorizedMerge() public {
        vm.prank(addr1);
        baseNFT1.mint(80, 70, "Wolf");
        vm.prank(addr1);
        baseNFT2.mint(90, 85, "Fire");

        vm.prank(addr2);
        vm.expectRevert("Not owner of token1");
        mutantNFT.merge(1, 1);
    }

    function testFailDoubleMerge() public {
        vm.startPrank(addr1);
        
        baseNFT1.mint(80, 70, "Wolf");
        baseNFT2.mint(90, 85, "Fire");
        
        baseNFT1.approve(address(mutantNFT), 1);
        baseNFT2.approve(address(mutantNFT), 1);
        mutantNFT.merge(1, 1);

        vm.expectRevert("Token1 already merged");
        mutantNFT.merge(1, 1);
        
        vm.stopPrank();
    }

    function testMultipleMerges() public {
        vm.startPrank(addr1);
        
        // Mint NFTs
        baseNFT1.mint(80, 70, "Wolf");
        baseNFT1.mint(75, 65, "Bear");
        baseNFT2.mint(90, 85, "Fire");
        baseNFT2.mint(85, 80, "Ice");

        // First merge
        baseNFT1.approve(address(mutantNFT), 1);
        baseNFT2.approve(address(mutantNFT), 1);
        mutantNFT.merge(1, 1);

        // Second merge
        baseNFT1.approve(address(mutantNFT), 2);
        baseNFT2.approve(address(mutantNFT), 2);
        mutantNFT.merge(2, 2);

        assertEq(mutantNFT.getCurrentTokenId(), 2);
        assertEq(mutantNFT.ownerOf(1), addr1);
        assertEq(mutantNFT.ownerOf(2), addr1);
        
        vm.stopPrank();
    }
}