# S023 Spec — 智慧合約規格

> **Change ID**: S023
> **Spec 版本**: v1.0
> **更新日期**: 2026-05-16

---

## Section 0.1 — MyNFT.sol

### 目標
實作 ERC721 NFT 鑄造合約，支援付費鑄造、最大供應量限制、擁有者提領。

### 完整合約規格

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 繼承
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// ⚠️ 規格更新（2026-05-16）：OZ v5 已移除 Counters.sol，實作改用 uint256 _nextTokenId
// import "@openzeppelin/contracts/utils/Counters.sol";  // OZ v4 only, removed in v5

contract MyNFT is ERC721, ERC721URIStorage, Ownable {
    // OZ v5: use plain uint256 instead of Counters.Counter
    // using Counters for Counters.Counter;  // OZ v4 only
    // Counters.Counter private _tokenIdCounter;  // OZ v4 only
    uint256 private _nextTokenId; // starts at 1
    uint256 public constant MAX_SUPPLY = 100;
    uint256 public mintPrice = 0.01 ether;

    // 事件
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    // 建構子：名稱="MyNFT" 符號="MNFT" 擁有者=initialOwner
    constructor(address initialOwner) ERC721("MyNFT", "MNFT") Ownable(initialOwner) {}

    // mint：check totalSupply < MAX_SUPPLY + msg.value >= mintPrice
    //       _tokenIdCounter.increment() → _safeMint → _setTokenURI → emit
    function mint(string memory tokenURI_) public payable { ... }

    // totalSupply：回傳 _tokenIdCounter.current()
    function totalSupply() public view returns (uint256) { ... }

    // setMintPrice：onlyOwner，修改 mintPrice
    function setMintPrice(uint256 newPrice) public onlyOwner { ... }

    // withdraw：onlyOwner，require balance > 0，call{value: balance} to owner
    function withdraw() public onlyOwner { ... }

    // override（ERC721URIStorage 必要）
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) { ... }
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) { ... }
}
```

### 驗收條件

- `mint("ipfs://test")` 成功，Token ID = 1，`totalSupply()` = 1
- `mint` 帶 0.009 ETH 時 revert（金額不足）
- 鑄造第 101 個時 revert（超過 MAX_SUPPLY）
- 非 owner 呼叫 `withdraw()` 時 revert
- `tokenURI(1)` 回傳正確的 URI

---

## Section 0.2 — NFTMarket.sol

### 目標
實作去中心化 NFT 市場，支援掛售、購買（含 2.5% 手續費）、取消。使用 ReentrancyGuard 防重入。

### 完整合約規格

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// ⚠️ OZ v5: ReentrancyGuard moved from security/ to utils/
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {

    struct Listing {
        address seller;
        uint256 price;
        bool isActive;
    }

    // mapping: nftContract → tokenId → Listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    uint256 public constant FEE_PERCENT = 25;   // 2.5%
    uint256 public constant FEE_BASE = 1000;
    address public feeRecipient;

    event ItemListed(address indexed nftContract, uint256 indexed tokenId, address indexed seller, uint256 price);
    event ItemSold(address indexed nftContract, uint256 indexed tokenId, address indexed buyer, address seller, uint256 price);
    event ListingCancelled(address indexed nftContract, uint256 indexed tokenId, address indexed seller);

    constructor(address _feeRecipient) { feeRecipient = _feeRecipient; }

    // listItem:
    //   require price > 0
    //   require ownerOf(tokenId) == msg.sender
    //   require getApproved == address(this) OR isApprovedForAll
    //   listings[nft][id] = Listing(msg.sender, price, true)
    //   emit ItemListed
    function listItem(address nftContract, uint256 tokenId, uint256 price) external { ... }

    // buyItem (nonReentrant):
    //   require listing.isActive
    //   require msg.value >= price
    //   require seller != msg.sender
    //   [C] checks done
    //   [E] listing.isActive = false  ← 先更新狀態防重入
    //   [I] 計算 fee + sellerProceeds
    //       safeTransferFrom(seller, buyer, tokenId)
    //       call{value: fee} feeRecipient
    //       call{value: sellerProceeds} seller
    //       if overpaid: refund to buyer
    //   emit ItemSold
    function buyItem(address nftContract, uint256 tokenId) external payable nonReentrant { ... }

    // cancelListing:
    //   require listing.isActive
    //   require listing.seller == msg.sender
    //   listing.isActive = false
    //   emit ListingCancelled
    function cancelListing(address nftContract, uint256 tokenId) external { ... }

    // getListing: view，回傳完整 Listing struct
    function getListing(address nftContract, uint256 tokenId) external view returns (Listing memory) { ... }
}
```

### 驗收條件

- `approve(marketAddr, tokenId)` 後可成功 `listItem`
- 未 approve 直接 `listItem` 時 revert
- `buyItem` 成功：NFT 所有權轉移，ETH 2.5% 到 feeRecipient，97.5% 到 seller
- 賣家自己 `buyItem` 時 revert
- 金額不足時 `buyItem` revert
- 成功購買後 `isActive = false`
- `cancelListing` 成功：`isActive = false`
- 非賣家 `cancelListing` 時 revert
