export const BaseNFT1_ABI = [
  "function mint(uint8 _strength, uint8 _agility, string memory _species) public",
  "function getTraits(uint256 tokenId) public view returns (tuple(uint8 strength, uint8 agility, string species))",
  "function getCurrentTokenId() public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

export const BaseNFT2_ABI = [
  "function mint(uint8 _magic, uint8 _intelligence, string memory _element) public",
  "function getTraits(uint256 tokenId) public view returns (tuple(uint8 magic, uint8 intelligence, string element))",
  "function getCurrentTokenId() public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

export const MutantNFT_ABI = [
  "function merge(uint256 token1Id, uint256 token2Id) public",
  "function getMutantTraits(uint256 tokenId) public view returns (tuple(uint8 strength, uint8 agility, uint8 magic, uint8 intelligence, string species, string element))",
  "function getCurrentTokenId() public view returns (uint256)",
  "event MutantCreated(uint256 indexed newTokenId, uint256 baseToken1Id, uint256 baseToken2Id)"
];

export const CONTRACT_ADDRESSES = {
  BaseNFT1: "0x8dC6a70a583470A0f76E0D550A983Bb919531653",
  BaseNFT2: "0xB549518c42491B547fC218DFCe67526BDF6E3cda",
  MutantNFT: "0x3061B261579aCe230aCec2E035Bf50df1eba6E24"
} as const;