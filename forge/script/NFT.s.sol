// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NFT.sol";

contract NFTDeployScript is Script {
    function run() external {
        // Retrieve private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy BaseNFT1
        BaseNFT1 baseNFT1 = new BaseNFT1();
        console.log("BaseNFT1 deployed to:", address(baseNFT1));

        // Deploy BaseNFT2
        BaseNFT2 baseNFT2 = new BaseNFT2();
        console.log("BaseNFT2 deployed to:", address(baseNFT2));

        // Deploy MutantNFT with addresses of base NFTs
        MutantNFT mutantNFT = new MutantNFT(
            address(baseNFT1),
            address(baseNFT2)
        );
        console.log("MutantNFT deployed to:", address(mutantNFT));

        vm.stopBroadcast();
    }
}

// script/NFTInteract.s.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NFT.sol";

contract NFTInteractScript is Script {
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address BASE_NFT1_ADDRESS = vm.envAddress("BASE_NFT1_ADDRESS");
        address BASE_NFT2_ADDRESS = vm.envAddress("BASE_NFT2_ADDRESS");
        address MUTANT_NFT_ADDRESS = vm.envAddress("MUTANT_NFT_ADDRESS");

        // Create contract instances
        BaseNFT1 baseNFT1 = BaseNFT1(BASE_NFT1_ADDRESS);
        BaseNFT2 baseNFT2 = BaseNFT2(BASE_NFT2_ADDRESS);
        MutantNFT mutantNFT = MutantNFT(MUTANT_NFT_ADDRESS);

        vm.startBroadcast(deployerPrivateKey);

        // Mint BaseNFT1
        baseNFT1.mint(80, 70, "Wolf");
        console.log("Minted BaseNFT1 #1");

        // Mint BaseNFT2
        baseNFT2.mint(90, 85, "Fire");
        console.log("Minted BaseNFT2 #1");

        // Approve MutantNFT contract
        baseNFT1.approve(MUTANT_NFT_ADDRESS, 1);
        baseNFT2.approve(MUTANT_NFT_ADDRESS, 1);
        console.log("Approved MutantNFT contract");

        // Merge NFTs
        mutantNFT.merge(1, 1);
        console.log("Merged NFTs to create MutantNFT #1");

        vm.stopBroadcast();
    }
}
